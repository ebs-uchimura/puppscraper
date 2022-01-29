/**
 * myLogger.js
 *
 * クラス名：LOGGER
 * 機能：ログ保存
 **/

'use strict';

// モジュール読み込み
const log4js = require('log4js'); // ロガー

class LOGGER {

   // コンストラクタ
  constructor(path) {
    // ロガー設定
    log4js.configure({
      appenders : {
        system : {
          type : 'file', 
          filename : path, // 保存先
        }
      },
      categories : {
        default : {
          appenders : ['system'], 
          level : 'debug',
        },
      },
    });
    this.logger = log4js.getLogger('system'); // ロガーインスタンス
    this.logger.level = 'debug'; // ログレベル
  }

  // ロギング
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