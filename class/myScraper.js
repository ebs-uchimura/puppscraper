/**
 * myScraper.js
 *
 * class：Scrape
 * function：scraping site
 **/

'use strict';

// constants 
const IGNORE_CERT_ERROR = '--ignore-certificate-errors'; // ignore cert-errors
const ALLOW_INSECURE = '--allow-running-insecure-content'; // allow insecure content
const NO_SANDBOX = '--no-sandbox'; // no sandbox
const DISABLE_SANDBOX = '--disable-setuid-sandbox'; // no setup sandbox
const DISABLE_EXTENSIONS = '--disable-extensions'; // disable extension
const CHROME_EXEC_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'; // chrome.exe path1

// define modules
const puppeteer = require('puppeteer-core'); // Puppeteer for scraping

// logger
const cLogger = require('../class/myLogger.js');
const logger = new cLogger('../public/logs/system.log');

class Scrape {

    // constractor
    constructor() {
        this.browser = puppeteer.launch({
            headless: true, // no display mode
            executablePath: CHROME_EXEC_PATH, // chrome.exe path
            args: [ALLOW_INSECURE, NO_SANDBOX, DISABLE_EXTENSIONS, DISABLE_SANDBOX],
        });
    }

    // search
    search = async(...arg) => {
        return new Promise(async(resolve) => {
            // new browser
            const page = await this.browser.newPage();
            // loop
            args.forEach(item => {
                // wait for continue button
                switch(item.type) {
                    case 1:
                        await page.waitForSelector(item.value, {timeout: 10000});
                        break;
                    case 2:
                        await page.waitForSelector(item.value, {timeout: 10000});
                        break;
                    case 3:
                        await page.waitForSelector(item.value, {timeout: 10000});
                        break;
                }
            });
        });
    }

    static isEmpty(obj) {
        return !Object.keys(obj).length; // check whether blank
    }

}

module.exports = DB;