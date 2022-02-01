/**
 * error.js
 *
 * function：error
 **/

'use strict';

// define modules
const express = require('express');
const router = express.Router();

// 404 error
router.use((req, res, next) => {
    res.status(404);
    res.end('my notfound! : ' + req.path);
});

// 500 error
router.use((err, req, res, next) => {
    res.status(500);
    res.end('my 500 error! : ' + err);
});

module.exports = router;