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

    static browser;
    static page;

    // constractor
    constructor() {
    }

    init() {
        return new Promise(async(resolve) => {
            Scrape.browser = await puppeteer.launch({
                headless: false, // no display mode
                args: [ALLOW_INSECURE, NO_SANDBOX, DISABLE_EXTENSIONS, DISABLE_SANDBOX],
            });
            // new browser
            Scrape.page = await Scrape.browser.newPage();
            resolve();
        });
    }

    // search
    doScrape(obj) {

        return new Promise(async(resolve) => {   
            let dataArray = [];
            // wait for continue button
            switch(obj.type) {
                case '1':
                    await Scrape.page.goto(obj.value);
                    resolve();
                    break;
                case '2':
                    await Scrape.page.click(obj.value);
                    resolve();
                    break;
                case '3':
                    await Scrape.page.type(obj.value, obj.text);
                    resolve();
                    break;
                case '4':
                    await Scrape.page.select(obj.value, obj.opts); 
                    resolve();
                    break;
                case '5':
                    await Scrape.page.keyboard.press(obj.value);
                    resolve();
                    break;
                case '6':
                    await Scrape.page.screenshot({path: obj.value});
                    resolve();
                    break;
                case 'e':
                    await Scrape.page.$eval(obj.value, obj => {
                        dataArray.push(obj.textContent);
                    });
                    resolve(dataArray);
                    break;
                case 'w1':
                    await Scrape.page.waitForTimeout(obj.value);
                    resolve();
                    break;
                case 'w2':
                    await Scrape.page.waitForSelector(obj.value, {timeout: obj.timeout});
                    resolve();
                    break;
                case 'w3':
                    await Scrape.page.waitForNavigation({waitUntil: 'networkidle2'});
                    resolve();
                    break;
            }
        });
    }
}

module.exports = Scrape;