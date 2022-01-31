// define modules
const express = require('express'); // express
const router = express.Router(); // router
require('dotenv').config(); // dotenv

// logger
const cLogger = require('./class/myLogger.js');
const logger = new cLogger('./public/logs/system.log');

// mysql setting
const dbSetting = {
    host: process.env.DEF_HOST,
    user: process.env.DEF_USER,
    password: process.env.DEF_PASS,
    database: process.env.DEF_DB,
    insecureAuth : true,
};
// db
const DB = require('./class/myDB.js');
const myDb = new DB(dbSetting);

// user
router.get('/search/user/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    console.log(await myDb.doInquiry("SELECT * FROM ?? WHERE ?? = ?", ['user', searchCol, searchWd]));
});

// site
router.get('/search/site/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    console.log(await myDb.doInquiry("SELECT * FROM ??", ['site', searchCol, searchWd]));
});

// product
router.get('/search/product/:column/:word', async(req, res) => {
    // column
    const searchCol = req.params.column;
    // word
    const searchWd = req.params.word;
    // search
    console.log(await myDb.doInquiry("SELECT * FROM ??", ['product', searchCol, searchWd]));
});

module.exports = router;