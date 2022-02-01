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

// define modules
const puppeteer = require('puppeteer'); // Puppeteer for scraping

// logger
const cLogger = require('../class/myLogger.js');
const logger = new cLogger('../public/logs/system.log');

class Scrape {

    // constractor
    constructor() {
        this.browser = puppeteer.launch({
            headless: true, // no display mode
            args: [ALLOW_INSECURE, NO_SANDBOX, DISABLE_EXTENSIONS, DISABLE_SANDBOX],
        });
    }

    // search
    doScrape = ...arg => {
        let dataArray = [];
        return new Promise(async(resolve) => {
            // new browser
            const page = await this.browser.newPage();
            // loop
            args.forEach(async(item) => {
                // wait for continue button
                switch(item.type) {
                    case '1':
                        await page.goto(item.value);
                        break;
                    case '2':
                        await page.click(item.value);
                        break;
                    case '3':
                        await page.type(item.value, item.text)
                        break;
                    case '4':
                        await page.select(item.value, ...item.opts); 
                        break;
                    case '5':
                        await page.keyboard.press(item.value);
                        break;
                    case '6':
                        await page.screenshot({path: item.value})
                        break;
                    case 'e':
                        await page.$eval(item.value, item => {
                            dataArray.push(item.textContent);
                        });
                        break;
                    case 'w1':
                        await page.waitForTimeout(item.value);
                        break;
                    case 'w2':
                        await page.waitForSelector(item.value, {timeout: item.timeout});
                        break;
                    case 'w3':
                        await page.waitForNavigation({waitUntil: 'networkidle2'});
                        break;
                }
            });
            resolve(dataArray);
        });
    }

    static isEmpty(obj) {
        return !Object.keys(obj).length; // check whether blank
    }

}

module.exports = DB;