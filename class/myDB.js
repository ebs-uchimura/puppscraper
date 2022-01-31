/**
 * myDB.js
 *
 * class：DB
 * function：db operation
 **/

'use strict';

// const
const WAIT_TIME = 1000;

// ■ define module
const mysql = require('mysql2'); // mysql

class DB {

    // constractor
    constructor(config) {
        // connection
        this.connection = mysql.createConnection(config);
        // result object
        this.obj; 
    }

    // ★ inquire
    doInquiry = async(sql, inserts) => {
        return new Promise(async(resolve) => {
            // promise pool    
            const promisePool = this.connection.promise(); 
            // set query
            const qry = mysql.format(sql, inserts);
            // do query
            const [rows, fields] = await promisePool.query(qry); 
            // result object
            setTimeout(() => {
                if(DB.isEmpty(rows)) {
                    resolve('error'); // empty
                } else {
                    resolve(rows); // return value
                }
            }, WAIT_TIME);
        });
    }

    static isEmpty(obj) {
        return !Object.keys(obj).length; // check whether blank
    }

}

module.exports = DB;