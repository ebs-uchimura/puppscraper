/**
 * app.ts
 *
 * function：Node.js server
 **/

'use strict';

// constants
// base url
const DEF_NETKEIBA_URL: string = 'https://netkeiba.com';
// training page url
const DEF_TRAINING_URL: string = 'https://race.netkeiba.com/race/oikiri.html?race_id=';
// query
const DEF_URL_QUERY: string = '&type=2&rf=shutuba_submenu';
// courses
const COURSE_ARRAY: string[] = ['阪神', ' 小倉'];
// tokyo id
const TOKYO_ID: string = '202205010501';
// hanshin id
const HANSHIN_ID: string = '202209010101';
// kokura id
const KOKURA_ID: string = '202210020101';
// output path
const OUTPUT_PATH: string = './public/output/';

// import modules
import * as fs from 'fs'; // fs
import { Scrape } from './class/myScraper'; // scraper
import { Aggregate } from './class/myAggregator'; // aggregator
import * as dotenv from 'dotenv'; // dotenc
dotenv.config();

// netkeiba id
const netKeibaId: string = process.env.NETKEIBA_ID ?? '';
// netkeiba pass
const netKeibaPass: string = process.env.NETKEIBA_PASS ?? '';
// header
const sheetTitleArray: string[][] = [
    ['馬名', '実施日', '競馬場', '馬場状態', '強さ', 'レビュー']
];

// get now
const getDateTime = (): string => {
    // today
    const today: Date = new Date();
    // year
    const year: number = today.getFullYear();
    // month
    const month: number = today.getMonth() + 1;
    // day
    const day: number = today.getDate();
    // result
    return `${year}${month}${day}`;
}

const makeEmptyCsv = (filePath: string):Promise<void> => {
    return new Promise(async(resolve, reject) => {  
        try { 
            if(!fs.existsSync(filePath)) {
                fs.writeFile(filePath, '', err => {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
            } else{
                fs.unlink(filePath, err => {
                    if (err) throw err;
                    console.log('File is deleted successfully.');
                });
            }
            resolve();
        } catch(e) {
            console.log(e);
        }
    });
}

// scraper
const scraper = new Scrape();

// aggregator
const aggregator = new Aggregate();

// active course ID
const activeIdArray: string[] = [HANSHIN_ID, KOKURA_ID];

// main
(async(): Promise<void> => {
    try {
        // initialize
        await scraper.init();
        // goto netkeiba
        await scraper.doGo(DEF_NETKEIBA_URL);
        // wait for loading of login button
        await scraper.doWaitSelector('.Icon_Login', 50000);
        // click login
        await scraper.doClick('.Icon_Login');
        // wait for id/pass input
        await scraper.doWaitSelector('input[name="login_id"]', 10000);
        // input id
        await scraper.doType('input[name="login_id"]', netKeibaId);
        // input pass
        await scraper.doType('input[name="pswd"]', netKeibaPass);
        // wait 3 sec
        await scraper.doWaitFor(3000);
        // click login button
        await scraper.doClick('.loginBtn__wrap input');
        // wait 3 sec
        await scraper.doWaitFor(3000);
        // course
        await activeIdArray.forEach(async(val: string, index: number): Promise<void> => {
            // course
            const targetCourse: string = val.slice( 0, -2 );
            const courseName: string = COURSE_ARRAY[index];
            // csv filename
            const filePath: string = `${OUTPUT_PATH}${courseName}${getDateTime()}.xlsx`;
            // make empty csv
            await makeEmptyCsv(filePath);
            // init
            await aggregator.init(filePath);
            // base url
            const baseUrl: string = `${DEF_TRAINING_URL}${targetCourse}`;
            // loop each races
            for(let j: number = 1; j <= 12; j++) {
                // post array
                let postArray: string[][] = [];
                // race
                const raceName: string = `${courseName}${j}R`;
                // url
                const targetUrl: string = `${baseUrl}${String(j).padStart(2,'0')}${DEF_URL_QUERY}`;
                // goto site
                await scraper.doGo(targetUrl);
                // wait for datalist
                await scraper.doWaitSelector('.TrainingTimeDataList', 10000);
                // loop each horses
                for(let i: number = 1; i <= 18; i++) {
                    Promise.all([
                        // horse name
                        scraper.doSingleEval(`.OikiriDataHead${i} .Horse_Info .Horse_Name a`, 'innerHTML'),
                        // date
                        scraper.doSingleEval(`.OikiriDataHead${i} .Training_Day`, 'innerHTML'),
                        // place
                        scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(6)`, 'innerHTML'),
                        // condition
                        scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(7)`, 'innerHTML'),
                        // training speed
                        scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(11)`, 'innerHTML'),
                        // training evaluation
                        scraper.doSingleEval(`.OikiriDataHead${i} td:nth-child(12)`, 'innerHTML'),
                    ]).then((array1: string[]):void => {
                        // push results
                        postArray.push(array1);
                    });
                    // rap time
                    const rapTimes: string[] = await scraper.doMultiEval(`.OikiriDataHead${i} .TrainingTimeDataList li .RapTime`, 'innerHTML');
                    // push results
                    postArray.push(rapTimes);
                    // cell color
                    await scraper.doMultiEval(`.OikiriDataHead${i} .TrainingTimeDataList li`, 'className')
                        .then((array2: string[]):void => {
                            // push results
                            postArray.push(array2);
                        });
                    // wait 0.5 sec
                    await scraper.doWaitFor(500);
                }
                // push data
                await aggregator.writeData(sheetTitleArray, postArray, raceName);
                await scraper.doWaitFor(500);
                console.log(`${raceName} finished`);
            }
            // make csv
            await aggregator.makeCsv(filePath);
            console.log(`${filePath} finished`);
        });
    } catch(e) {
        // error
        console.log(e);
    } 
})();
