/**
 * search.js
 *
 * function：db search
 **/

'use strict';

// define modules
const router = require('express').Router(); // router
require('dotenv').config(); // dotenv

// logger
const cLogger = require('../class/myLogger.js');
const logger = new cLogger('../public/logs/system.log');

// mysql setting
const dbSetting = {
    host: process.env.DEF_HOST,
    user: process.env.DEF_USER,
    password: process.env.DEF_PASS,
    database: process.env.DEF_DB,
    insecureAuth : true,
};
// db
const DB = require('../class/myDB.js');
const myDb = new DB(dbSetting);

// user
router.get('/user/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    const resultObj = await myDb.doInquiry("SELECT * FROM ?? WHERE ?? = ?", ['user', searchCol, searchWd]);
    // render
    res.render('index', {obj: resultObj[0]});
});

// site
router.get('/site/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    const resultObj = await myDb.doInquiry("SELECT * FROM ??", ['site', searchCol, searchWd]);
    // render
    res.render('index', {obj: resultObj[0]});
});

// product
router.get('/product/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    const resultObj = await myDb.doInquiry("SELECT * FROM ??", ['product', searchCol, searchWd]);
    // render
    res.render('index', {obj: resultObj[0]});
});

module.exports = router;