/* 
	定义了一个translate函数。
	该函数使用了百度翻译API，将一个字符串进行翻译，并返回翻译结果。
	在函数内部，先使用md5算法对appid、q、salt和key进行加密，生成一个sign值，
	然后使用 Promise 向API发送翻译请求，
	包括翻译的源语言和目标语言，以及加密后的appid、q、salt和sign等参数。
	如果翻译成功，将返回一个Promise对象，该对象的状态为resolved，并携带翻译结果；
	如果翻译失败，将返回一个Promise对象，该对象的状态为rejected，并携带错误信息。
*/

const request = require('request');
const md5 = require('md5');
const { response } = require('express');

const APP_ID = '20230418001646816';
const SECRET_KEY = 'mKvsdt9sNUgShA6M0f_s';

function translate(q, from, to) {
    return new Promise((resolve, reject) => {
        const salt = Date.now();
        const sign = md5(`${APP_ID}${q}${salt}${SECRET_KEY}`);

        const options = {
            method: 'POST',
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            form: {
                q,
                from,
                to,
                appid: APP_ID,
                salt,
                sign,
            },
        };

        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            const result = JSON.parse(body);

            if (result.error_code) {
                reject(result.error_msg);
                return;
            }

            resolve(result.trans_result);
        });
    });
}

module.exports = { translate };