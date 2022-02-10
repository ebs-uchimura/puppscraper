/**
 * app.ts
 *
 * function：Node.js server
 **/

'use strict';

// constants
const DEF_NETKEIBA_URL: string = 'https://netkeiba.com';
const DEF_TRAINING_URL: string = 'https://race.netkeiba.com/race/oikiri.html?race_id=';
const DEF_URL_QUERY: string = '&type=2&rf=shutuba_submenu';
const TOKYO_ID: string = '2022050104';
const CHUKYO_ID: string = '2022070112';
const KOKURA_ID: string = '2022100108';
const OUTPUT_PATH: string = './public/output/';
const DEF_PORT: number = 3000;

// import modules
import * as fs from 'fs'; // fs
import { Scrape } from './class/myScraper';
import { dotenv } from 'dotenv';
dotenv.config();

const scraper = new Scrape();

// get now
const getDateTime = (): string => {
    const today: Date = new Date();
 
    const year: number = today.getFullYear();
    const month: number = today.getMonth() + 1;
    const day: number = today.getDate();

    return `${year}${month}${day}`;
}

const ACTIVE_ID: string = CHUKYO_ID;

// main
(async(): Promise<void> => {
    try {
        let outText: string = "";
        await scraper.init();
        await scraper.doGo(DEF_NETKEIBA_URL);
        await scraper.doWaitSelector('.Icon_Login', 50000);
        await scraper.doClick('.Icon_Login');
        await scraper.doWaitSelector('input[name="login_id"]', 10000);
        await scraper.doType('input[name="login_id"]', process.env.NETKEIBA_ID);
        await scraper.doType('input[name="pswd"]', process.env.NETKEIBA_PASS);
        await scraper.doWaitFor(3000);
        await scraper.doClick('.loginBtn__wrap input');
        await scraper.doWaitFor(3000);
        for(let j: number = 1; j <= 12; j++) {
            await scraper.doWaitNav();
            outText += `${j}R\n`;
            console.log(outText);
            const targetUrl: string = `${DEF_TRAINING_URL}${ACTIVE_ID}${String(j).padStart(2,'0')}${DEF_URL_QUERY}`;
            await scraper.doGo(targetUrl);
            await scraper.doWaitSelector('.TrainingTimeDataList', 10000);
            for(let i: number = 1; i <= 18; i++) {
                const horseName: string = await scraper.doSingleEval(`.OikiriDataHead${i} .Horse_Info .Horse_Name a`, 'innerHTML');
                const trainingDate: string = await scraper.doSingleEval(`.OikiriDataHead${i} .Training_Day`, 'innerHTML');
                const trainingPlace: string = await scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(6)`, 'innerHTML');
                const trainingCondition: string = await scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(7)`, 'innerHTML');
                const trainingSpeed: string = await scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(11)`, 'innerHTML');
                const trainingEvaluation: string = await scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(12)`, 'innerHTML');
                const tmpText: string = await scraper.doMultiEval(`.OikiriDataHead${i} .TrainingTimeDataList li .RapTime`, 'innerHTML');
                const cellColor: string = await scraper.doMultiEval(`.OikiriDataHead${i} .TrainingTimeDataList li`, 'className');
                const finalText: string = `${horseName}: ${trainingDate} ${trainingPlace}: ${trainingCondition}\n${tmpText}\n${cellColor}\n${trainingSpeed}${trainingEvaluation}\n`;
                console.log(finalText);
                await scraper.doWaitFor(500);
                outText += finalText;
            }
        }
      
        fs.writeFile(`${OUTPUT_PATH}${getDateTime()}-${ACTIVE_ID}.txt`, outText, err => {
            if (err) throw err;
            console.log('File is created successfully.');
        });
        
    } catch(e) {
        console.log(e);
    }  
})();

