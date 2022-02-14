/**
 * myScraper.ts
 *
 * class：Scrape
 * function：scraping site
 **/

'use strict';

// constants 
const USER_ROOT_PATH: string = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] ?? ''; // user path
const CHROME_EXEC_PATH1: string = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path1
const CHROME_EXEC_PATH2: string = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path2
const CHROME_EXEC_PATH3: string = '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path3
const DISABLE_EXTENSIONS: string = '--disable-extensions'; // disable extension
const ALLOW_INSECURE: string = '--allow-running-insecure-content'; // allow insecure content
// const IGNORE_CERT_ERROR: string = '--ignore-certificate-errors'; // ignore cert-errors
// const NO_SANDBOX: string = '--no-sandbox'; // no sandbox
// const DISABLE_SANDBOX: string = '--disable-setuid-sandbox'; // no setup sandbox
const DEFAULT_LATENCY: number = 20; // 20ms
const DOWNLOAD_SPEED_LIMIT: number = 4 * 1024 * 1024 / 8; // 4Mbps
const UPLOAD_SPEED_LIMIT: number = 2 * 1024 * 1024 / 8; // 2Mbps

// define modules
import puppeteer from 'puppeteer-core'; // Puppeteer for scraping
import path from 'path'; // path
import * as fs from 'fs'; // fs

export class Scrape {

    static browser: puppeteer.Browser;
    static page: puppeteer.Page;

    // constractor
    constructor() {
    }

    // initialize
    init(): Promise<void> {
        return new Promise(async(resolve) => {
            try {
                // lauch browser
                Scrape.browser = await puppeteer.launch({
                    headless: true, // no display mode
                    executablePath: await getChromePath(), // chrome.exe path
                    ignoreDefaultArgs: [DISABLE_EXTENSIONS], // ignore extensions
                    args: [ALLOW_INSECURE],
                });
                // create new page
                Scrape.page = await Scrape.browser.newPage();
                // mimic agent
                await Scrape.page.setUserAgent('bot');
                // cdp session
                const client = await Scrape.page.target().createCDPSession();
                // emulate condition
                await client.send('Network.emulateNetworkConditions', {
                    offline: false, // not offline
                    latency: DEFAULT_LATENCY, // default latency
                    downloadThroughput: DOWNLOAD_SPEED_LIMIT, // download speed limit
                    uploadThroughput: UPLOAD_SPEED_LIMIT, // upload speed limit
                });
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // go page
    doGo(targetPage: string): Promise<void> {
        return new Promise(async(resolve) => { 
            try {
                await Scrape.page.goto(targetPage, { waitUntil: 'networkidle2' });
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // click
    doClick(elem: string): Promise<void> {
        return new Promise(async(resolve) => {  
            try { 
                await Scrape.page.click(elem);
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // type
    doType(elem: string, value: string): Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.type(elem, value);
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // select
    doSelect(elem: string): Promise<void> {
        return new Promise(async(resolve) => {  
            try {
                await Scrape.page.select(elem); 
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // screenshot
    doScreenshot(path: string): Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.screenshot({path: path});
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // eval
    doSingleEval(selector: string, property: string): Promise<string> {
        return new Promise(async(resolve) => { 
            try {        
                // target item
                const item: any = await Scrape.page.$(selector);
                // if not null
                if(item !== null) {
                    // got data
                    const data: any = await (await item.getProperty(property)).jsonValue();
                    // if got data not null
                    if(data !== null) {
                        // resolved
                        resolve(data);
                    }
                }
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // eval
    doMultiEval(selector: string, property: string): Promise<string[]> {
        return new Promise(async(resolve) => { 
            try {
                // data set
                let datas: string[] = [];
                // target list
                const list: any = await Scrape.page.$$(selector);
                // loop in list
                for(let ls of list) {
                    // push to data set
                    datas.push(await (await ls.getProperty(property)).jsonValue());
                }
                // resolved
                resolve(datas);
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // waitfor
    doWaitFor(time: number): Promise<void> {
        return new Promise(async(resolve) => {  
            try {
                await Scrape.page.waitForTimeout(time);
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // waitSelector
    doWaitSelector(elem: string, time: number): Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.waitForSelector(elem, {timeout: time});
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // waitNav
    doWaitNav(): Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.page.waitForNavigation({waitUntil: 'networkidle2'});
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }
        });
    }

    // exit
    doClose(): Promise<void> {
        return new Promise(async(resolve) => {   
            try {
                await Scrape.browser.close();
                // resolved
                resolve();
            } catch(e: unknown) {
                // error
                console.log(e);
            }   
        });
    }   
}

// get chrome absolute path
const getChromePath = (): string => {
    // chrome tmp path
    const tmpPath: string = path.join(USER_ROOT_PATH, CHROME_EXEC_PATH3);
    // 32bit
    if(fs.existsSync(CHROME_EXEC_PATH1)) {
        return CHROME_EXEC_PATH1 ?? '';
    // 64bit
    } else if(fs.existsSync(CHROME_EXEC_PATH2)) {
        return CHROME_EXEC_PATH2 ?? '';
    // user path
    } else if(fs.existsSync(tmpPath)) {
        return tmpPath ?? '';
    // error
    } else {
        // error logging
        return '';
        console.log('8: no chrome path error');
    }
}