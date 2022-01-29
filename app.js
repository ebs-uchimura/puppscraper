/**
 * app.js
 *
 * function：Node.js server
 **/

// const
const DEF_PORT = 3000;

// ■ define module
const express = require('express'); // express
const router = express.Router(); // router
const path = require('path'); // path
const mysql = require('mysql2'); // mysql
require('dotenv').config();

// logger
const cLogger = require('../class/myLogger.js');
const logger = new cLogger('./logs/system.log');

// mysql setting
const dbSetting = {
    host: process.env.DEF_HOST,
    user: process.env.DEF_USER,
    password: process.env.DEF_PASS,
    database: process.env.DEF_DB,
};

// passport
const passport = require('passport'); // passport
const passportHttp = require('passport-http');

passport.use(new passportHttp.BasicStrategy((username, password, done) => {
    if (username === 'user' && password == 'pass') {
        return done(null, true);
    } else {
        return done(null, false);
    }
  }
));

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

// mypage
app.use("/mypage",  passport.authenticate('basic', { session: false, }), (req, res) => {
    require("./router/mypage.js");
});

// error
app.use("/err", require("./router/error.js"));

// 404 error
app.use((req, res, next) => {
    res.status(404);
    res.end('my notfound! : ' + req.path);
});

// 500 error
app.use((err, req, res, next) => {
    res.status(500);
    res.end('my 500 error! : ' + err);
});

// listen to 3000
app.listen(DEF_PORT, () => {
    // log
    console.log(`app listening to http://localhost:${PORT}`);
});
