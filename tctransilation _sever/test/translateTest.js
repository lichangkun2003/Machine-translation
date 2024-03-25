// 引入所需的库和被测试的模块
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
const md5 = require('md5');

const { translate } = require('../api/translate');
const APP_ID = '20230418001646816';
const SECRET_KEY = 'mKvsdt9sNUgShA6M0f_s';

describe('Translate', function() {
  // 钩子函数，在每个测试用例执行之前运行，用于创建一个Sinon stub代替request.post方法
  let requestPostStub;

  beforeEach(function() {
    requestPostStub = sinon.stub(request, 'post');
  });

  afterEach(function() {
    requestPostStub.restore();
  });

  it('should return translated text', async function() {
    const expectedResult = [{
      src: 'hello',
      dst: '你好',
    }];
  
    const salt = Date.now();
    const sign = md5(`${APP_ID}hello${salt}${SECRET_KEY}`);
  
    const options = {
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      form: {
        q: 'hello',
        from: 'en',
        to: 'zh',
        appid: APP_ID,
        salt,
        sign,
      },
    };
  
    requestPostStub.withArgs(options).yields(null, null, JSON.stringify({
      trans_result: expectedResult,
    }));
  
    const result = await translate('hello', 'en', 'zh');
    // console.log(result);
  
    expect(result).to.deep.equal(expectedResult);
  });

  it('should handle error when calling translation API', async function() {
    const errorMessage = 'Error: API call failed';
    requestPostStub.yields(new Error(errorMessage));

    try {
      await translate('hello', 'en', 'zh');
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
      sinon.assert.calledOnce(requestPostStub);
    }
  });

  it('should handle error response from translation API', async function() {
    const errorCode = '52001';
    const errorMsg = 'Invalid sign';

    requestPostStub.yields(null, null, JSON.stringify({
      error_code: errorCode,
      error_msg: errorMsg,
    }));

    try {
      await translate('hello', 'en', 'zh');
    } catch (error) {
      expect(error).to.equal(errorMsg);
      sinon.assert.calledOnce(requestPostStub);
    }
  });
});
