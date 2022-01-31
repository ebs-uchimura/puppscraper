/**
 * myLogger.js
 *
 * class：LOGGER
 * function：save log
 **/

'use strict';

// ■ define module
const log4js = require('log4js'); // logger

class LOGGER {

  // constructer
  constructor(path) {
    // config
    log4js.configure({
        appenders : {
            system : {
                type : 'file', 
                filename : path, // output path
            }
        },
        categories : {
            default : {
                appenders : ['system'], 
                level : 'debug',
            },
        },
    });
    // instance
    this.logger = log4js.getLogger('system'); 
    // log level
    this.logger.level = 'debug'; 
  }

  // logging
  doLog(mode, id, msg) {
    let logMode = '';
    let subMsg1 = '';
    let subMsg2 = '';
    switch (mode) {
        case 1:
            logMode = 'normal';
            break;
        case 2:
            logMode = 'error';
            break;
        case 3:
            logMode = 'critical error';
            subMsg1 = '[fatal]';
            subMsg2 = 'shutdown now.';
            break;
        default:
            break;
    }
    this.logger.debug(`${logMode}-${subMsg}: ${id} ${msg}.${subMsg2}`);
    console.log(`${logMode}-${subMsg}: ${id} ${msg}.${subMsg2}`);
  }
}

module.exports = LOGGER;