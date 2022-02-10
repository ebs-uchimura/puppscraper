/**
 * myScraper.ts
 *
 * class：Scrape
 * function：scraping site
 **/

'use strict';

// constants 
const USER_ROOT_PATH: string = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]; // user path
const CHROME_EXEC_PATH1: string  = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path1
const CHROME_EXEC_PATH2: string  = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path2
const CHROME_EXEC_PATH3: string  = '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path3
const IGNORE_CERT_ERROR: string = '--ignore-certificate-errors'; // ignore cert-errors
const ALLOW_INSECURE: string = '--allow-running-insecure-content'; // allow insecure content
const NO_SANDBOX: string = '--no-sandbox'; // no sandbox
const DISABLE_SANDBOX: string = '--disable-setuid-sandbox'; // no setup sandbox
const DISABLE_EXTENSIONS: string = '--disable-extensions'; // disable extension

// define modules
import puppeteer from 'puppeteer-core'; // Puppeteer for scraping
import path from 'path'; // path
import * as fs from 'fs'; // fs

export class Scrape {

    static browser : puppeteer.Browser;
    static page: puppeteer.Page;

    // constractor
    constructor() {
    }

    // initialize
    init():Promise<void> {
        return new Promise(async(resolve) => {
            try {
                // lauch browser
                Scrape.browser = await puppeteer.launch({
                    headless: true, // no display mode
                    executablePath: await getChromePath(), // chrome.exe path
                    ignoreDefaultArgs: [DISABLE_EXTENSIONS], // ignore extensions
                    args: [ALLOW_INSECURE, NO_SANDBOX, DISABLE_SANDBOX],
                });
                // create new page
                Scrape.page = await Scrape.browser.newPage();
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // go page
    doGo(targetPage: string):Promise<void> {
        return new Promise(async(resolve) => { 
            try {
                await Scrape.page.goto(targetPage);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // click
    doClick(elem: string):Promise<void> {
        return new Promise(async(resolve) => {  
            try { 
                await Scrape.page.click(elem);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // type
    doType(elem: string, value: string):Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.type(elem, value);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
        
    }

    // select
    doSelect(elem: string):Promise<void> {
        return new Promise(async(resolve) => {  
            try {
                await Scrape.page.select(elem); 
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // screenshot
    doScreenshot(path: string):Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.screenshot({path: path});
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // eval
    doSingleEval(selector: string, property: string): Promise<string> {
        return new Promise(async(resolve) => { 
            try {        
                const item: any = await Scrape.page.$(selector);
                if(item !== null) {
                    const data: any = await (await item.getProperty(property)).jsonValue();
                    if(data !== null) {
                        resolve(data);
                    }
                }
            } catch(e) {
                console.log(e);
            }
        });
    }

    // eval
    doMultiEval(selector: string, property: string): Promise<string> {
        return new Promise(async(resolve) => { 
            try {         
                let datas: string[] = [];
                const list = await Scrape.page.$$(selector);
                for(let ls of list) {
                    datas.push(await (await ls.getProperty(property)).jsonValue());
                }
                resolve(datas.join());
            } catch(e) {
                console.log(e);
            }
        });
    }

    // waitfor
    doWaitFor(time: number):Promise<void> {
        return new Promise(async(resolve) => {  
            try {
                await Scrape.page.waitForTimeout(time);
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // waitSelector
    doWaitSelector(elem: string, time: number):Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.waitForSelector(elem, {timeout: time});
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // waitNav
    doWaitNav():Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.waitForNavigation({waitUntil: 'networkidle2'});
                resolve();
            } catch(e) {
                console.log(e);
            }
        });
    }

    // exit
    doClose():Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.browser.close();
                resolve();
            } catch(e) {
                console.log(e);
            }   
        });
    }   
}

// get chrome absolute path
const getChromePath = ():any => {
    // chrome tmp path
    const tmpPath: string = path.join(USER_ROOT_PATH, CHROME_EXEC_PATH3);
    // 32bit
    if(fs.existsSync(CHROME_EXEC_PATH1)) {
        return CHROME_EXEC_PATH1;
    // 64bit
    } else if(fs.existsSync(CHROME_EXEC_PATH2)) {
        return CHROME_EXEC_PATH2;
    // user path
    } else if(fs.existsSync(tmpPath)) {
        return tmpPath;
    // error
    } else {
        // error logging
       console.log('8: no chrome path error');
    }
}