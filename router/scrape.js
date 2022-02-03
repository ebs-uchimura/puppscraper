/**
 * scrape.js
 *
 * function：render top page
 **/

'use strict';

// define modules
const express = require('express');
const router = express.Router();

// logger
const Scrape = require('../class/myScraper.js');
const scraper = new Scrape();

// top page
router.get('/', async(req, res) => {
    await scraper.init();
    await scraper.doScrape({
        type: '1',
        value: 'https://www.yahoo.co.jp/'
    });
    await scraper.doScrape({
        type: '3',
        value: 'input[name="p"]',
        text: "hoge",
    });
});

module.exports = router;