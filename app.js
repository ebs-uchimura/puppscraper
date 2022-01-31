/**
 * app.js
 *
 * function：Node.js server
 **/

'use strict';

// const
const DEF_PORT = 3000;

// ■ define module
const express = require('express'); // express
const path = require('path'); // path
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

// express
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// express setting
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// top
app.use("/", require("./router/index.js"));

// search
app.use("/search", require("./router/search.js"));

// error
app.use("/err", require("./router/error.js"));

// listen to 3000
app.listen(DEF_PORT, () => {
    // log
    console.log(`app listening to http://localhost:${DEF_PORT}`);
});
