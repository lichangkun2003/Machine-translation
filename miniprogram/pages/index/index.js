// 获取应用实例
// import {translate, imageInfo} from '../../utils/api.js'
import {translate,imageInfo} from '../../utils/apitest.js'
import BrailleConverter from '../../utils/braille.js'


const app = getApp();

//引入插件：微信同声传译
var plugin = requirePlugin("WechatSI");
//获取全局唯一的语音识别管理器recordRecoManager
let manager = plugin.getRecordRecognitionManager();

// 检测盲文占比的函数
function isBrailleText(text) {
	// console.log(text)
	let brailleChars = Object.keys(BrailleConverter.ASCII);
	// console.log(brailleChars)
	let textChars = text.split('');
	let brailleCount = textChars.filter(char => brailleChars.includes(char)).length;
	// console.log(brailleCount)
	return brailleCount / textChars.length >= 0.5; // 假设盲文字数占比超过50%则认为是盲文
}

// 转换文本为英文或盲文的函数
async function convertText(query, targetLang) {
	if (isBrailleText(query)) {
	  // 如果输入为盲文，则直接转换为英文
	  let englishText = BrailleConverter.toText(query);
	  let translationResult = await translate(englishText, { from: 'auto', to: targetLang });
	  return { success: true, text: translationResult.data};
	} else if (targetLang === 'mw') {
	  // 如果目标语言为盲文，则先翻译成英文，再转换为盲文
	  let translationResult = await translate(query, { from: 'auto', to: 'en' });
	  console.log(translationResult)
	  let englishText = translationResult.data[0].dst;-
	  console.log(englishText)
	  let brailleText = BrailleConverter.toBraille(englishText);
	// let brailleText = BrailleConverter.toBraille(query);
	// console.log(brailleText)
	  return { success: true, text: [{src:query,dst:brailleText}] };
	} else {
	  // 否则直接返回原文
	//   console.log(targetLang)
	  let translationResult = await translate(query, { from: 'auto', to: targetLang });
	  console.log(translationResult)
	  return { success: true, text: translationResult.data };
	// translate(query, { from: 'auto', to: targetLang }).then(res => {
	// 	return { success: true, text: res.data };
	//   })
	}
}

Page({
	data:{
		query: '',
		hideClearIcon: false,
		result: [],
		curLang: {},
		active: 0,
		numberWords: 0,
		canUse: true,
		auidoSrc: '',
		imageData: '../../images/wenzi.png',
		isRecognizing : false,
	},  
	onReady: function () {
		this.innerAudioContext = wx.createInnerAudioContext();
		this.innerAudioContext.onError(function (res) {
		  wx.showToast({
			title: '语音播放初始化失败',
		  });
		});
	},
	onLoad: function(options){
		if(options.query){
			this.setData({query: options.query});
		}
		this.initRecord();
	},
	onShow: function(){
		if(this.data.curLang.lang !== app.globalData.curLang.lang){
			this.setData({curLang: app.globalData.curLang});
			this.onConfirm();
		}
	},
	onInput: function(e){
		let word = e.detail.value;
		this.setData({'numberWords': word.length});
		this.setData({'query': word});
		if(this.data.query.length > 0){
			this.setData({'hideClearIcon': false});
		} else {
			this.setData({'hideClearIcon': true});
		}
	},
	onTapClose: function(){
		this.setData({
			query: '',
			numberWords:0, 
			hideClearIcon: true
		});
	},
	onConfirm: function(){
		if (!this.data.query) return;
		wx.showToast({
			title: "翻译中",
			icon: 'none',
			duration: 1500,
		});

		convertText(this.data.query, this.data.curLang.lang).then(result => {
			if (result.success) {
			  this.setData({'result': result.text});
			  let history = wx.getStorageSync('history') || [];
			  history.unshift({query: this.data.query, result: result.text[0].dst});
			  history.length = history.length > 10 ? 10 : history.length;
			  wx.setStorageSync('history', history);
			} else {
				console.log(this.data.query)
			  	// this.setData({'result': this.data.query});
			}
		  }).catch(error => {
			console.error('Error in convertText:', error);
		});


		// translate(this.data.query, {from: 'auto', to: this.data.curLang.lang}).then(res => {
		// 	this.setData({'result': res.data});
			
		// 	let history = wx.getStorageSync('history') || [];
		// 	history.unshift({query: this.data.query, result: res.data[0].dst});
		// 	history.length = history.length > 10 ? 10 : history.length;
		// 	wx.setStorageSync('history', history);
		// })
	},

	// 实现函数节流，避免用户频繁点击翻译按钮导致翻译请求过多。在1500毫秒内只能点击一次翻译按钮。
	throttle: function(){
		if(this.data.canUse){
			this.onConfirm.apply(this, arguments);
			this.setData({"canUse": false});
			setTimeout(()=>{
				this.setData({"canUse": true})
			}, 1500);
		}
	},

	//微信插件同声传译实现语音识别  
	//初始化  
	initRecord: function() {    
		var that = this;
		//有新的识别内容返回，则会调用此事件
		manager.onRecognize = function (res) {      
			console.log("current result", res.result);
		}    
		//正常开始录音识别时调用    
		manager.onStart = function (res) {
			//提示录音开始
			wx.showToast({
				title: '开始录音',      
			});
			console.log("成功开始录音识别", res);   
			that.setData({
				isRecognizing: true,
			});
		}    
		//识别错误事件    
		manager.onError = function (res) {      
			console.error("error msg", res.msg);  
			console.error("error info", res); 
			that.setData({
				isRecognizing: false,
			}); 
		}    
		//识别结束事件    
		manager.onStop = function (res) {      
			console.log("record file path", res.tempFilePath) ;     
			console.log("result", res.result);           
			if(res.result == ''){        
				//录音内容为空时      
				wx.showModal({
					title: '提示',
					content: '不好意思，没有听清呢',
					showCancel: false,
					success: function (res) {}        
				});
				that.setData({
					isRecognizing: false,
				});
				return;      
			}     
			else{       
				//不为空时提示开始识别        
				wx.showToast({
					title: '正在识别',         
				});
				let text = res.result.replace(/，/, ' ').replace(/。/gi, '');//正则去除识别结果结尾的句号        
				//将识别结果显示在输入框        
				that.setData({          
					query: text,
					numberWords: text.length
				});
				that.setData({
					isRecognizing: false,
				});  
				that.onConfirm();    
			}      
		} 
	},
	//按住说话  
	touchStart: function(e){     
		console.log('录音状态 ');
		console.log(this.data.isRecognizing);
		//开始识别    
		if (this.data.isRecognizing) {
			return;
		}
		manager.start({      
			lang: 'zh_CN',    //识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
			duration: 60000, //指定录音的时长，单位ms，最大为60000。如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音
		}); 
	},  
	//松开结束  
	touchEnd: function(e){    
		console.log('结束录音状态 ');
		//结束识别    
		manager.stop();  
	},
	//阅读文字
	readText: function () {
		let content = "";
		for(let i = 0 ; i < this.data.result.length ; i++){
			content += this.data.result[i].dst;
			console.log(content); 
		}
		let lang = "";
		if(this.data.curLang.lang === 'en' ){
			lang = "en_US";
		}else if(this.data.curLang.lang === 'zh'){
			lang = "zh_CN";
		}else{
			wx.showToast({
				title: '不支持该语言',
			})
			return;
		}
		let that = this;
		plugin.textToSpeech({
			lang: lang,
			tts: true,
			content: content,
			success: function (res) {
				that.setData({
					auidoSrc: res.filename
				});
				that.readStart();
			},
			fail: function (res) {
				wx.showToast({
					title: '语音转换失败',
				});
			}
		})
	},
	//开始阅读文字
	readStart: function () {
		if (this.data.auidoSrc == '') {
			return;
		}
		this.innerAudioContext.src = this.data.auidoSrc; //设置音频地址
		this.innerAudioContext.volume = 1; //设置音量为最大值
		this.innerAudioContext.onCanplay(() => {
			this.innerAudioContext.play(); //播放音频
		});

	},
	//暂停阅读
	readPause: function () {
		this.innerAudioContext.pause();
	},

	//根据图片的内容调用API获取图片文字
	getImgInfo: function (imageData) {
		wx.showLoading({
			title: '识别中...',
		})
		var that = this
		that.getBaiduToken().then(res => {
			// console.log(res)
			//获取token
			const token = res.data.access_token
			// console.log(token)
			const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}` // baiduToken是已经获取的access_Token      
			wx.request({
				url: detectUrl,
				data: {
					image: imageData
				},
				method: 'POST',
				dataType: 'json',
				header: {
					'content-type': 'application/x-www-form-urlencoded' // 必须的        
				},
				success: function (res, resolve) {
					console.log(res)
					//将 res.data.words_result数组中的内容加入到words中           
					const words = res.data.words_result.map((word) => word.words).join(""); // 从响应数据中提取文字信息
					console.log(words)
					that.setData({
						query:words,
						numberWords: words.length
					}) 
					that.onConfirm()
					// wx.hideLoading()
					 
        			return { content: words, numberWords: words.length }; // 返回提取的内容和字符数
					
				},
				fail: function (res, reject) {
					console.log('get word fail：', res.data);
					wx.hideLoading()
				},
				complete: function () {
					wx.hideLoading()
				}
			})
		})
	},
	// 获取百度access_token  
	getBaiduToken: function () {
		return new Promise(resolve => {
			var APIKEY = "luEfsgjXr8PvHwCIq7d3Y9Fn"
			var SECKEY = "TVReOBGyYnRpNm3AYkfnVPgMSrT9RhRU"
			var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${APIKEY}&client_secret=${SECKEY}`
			wx.request({
			url: tokenUrl,
			method: 'POST',
			dataType: 'json',
			header: {
				'content-type': 'application/json; charset-UTF-8'
			},
			success: function (res) {
				console.log("[BaiduToken获取成功]", res);
				return resolve(res)
			},
			fail: function (res) {
				console.log("[BaiduToken获取失败]", res);
				return resolve(res)
			}
			})
		})
	},
	//图片识别
	scanImageInfo: function(imageData) {
		// console.log(imageData)
		// this.getImgInfo(imageData).then(res => {
		// 	this.setData({
		// 		query:res.data.content,
		// 		numberWords: res.data.numberWords
		// 	}) 
		// 	this.onConfirm();    
		// })
		this.getImgInfo(imageData) 
	},


	doUpload: function () {
        var that = this;    
        // 选择图片，拍照或从相册中获取
        wx.chooseImage({      
            count: 1,      
            sizeType: ['compressed'],      
            sourceType: ['album', 'camera'],      
            success: function (res) {
                wx.showLoading({          
                    title: '上传中',        
                })
				let filePath = res.tempFilePaths[0];  
				wx.navigateTo({
					url: '/pages/photo/photo?src=' + filePath,
				})               
            }
        });
    },
  //  原函数
	// fileUpload: function () {
	// 	let that = this;
	// 	wx.chooseMessageFile({
	// 		count: 1,
	// 		type: 'file',
	// 		success: function (res) {
	// 		  const filePath = res.tempFiles[0].path;
	// 		  const fs = wx.getFileSystemManager()
	// 		  fs.readFile({
	// 			filePath: filePath,
	// 			encoding: 'utf8',
	// 			position: 0,
	// 			success(res) {
	// 				console.log(res.data)
	// 				that.setData({
	// 					query:res.data,
	// 					numberWords: res.data.length
	// 				}) 
	// 				that.onConfirm();
	// 		  	},
	// 		  })
	// 		},
	// 		fail: function (res) {
	// 		  console.error(res);
	// 		}
	// 	});  
  // }

  fileUpload: function () {
    let that = this;
    wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: function (res) {
            const filePath = res.tempFiles[0].path;
            // 获取文件后缀
            const fileExt = filePath.split('.').pop().toLowerCase();
            if (fileExt === 'txt') {
                const fs = wx.getFileSystemManager();
                fs.readFile({
                    filePath: filePath,
                    encoding: 'utf8',
                    success(res) {
                        console.log(res.data);
                        that.setData({
                            query: res.data,
                            numberWords: res.data.length
                        });
                        that.onConfirm();
                    },
                    fail(res) {
                        console.error(res);
                    }
                });
            }
            else if (fileExt === 'docx') {
              wx.openDocument({
                  filePath: filePath,
                  success(res) {
                      console.log('open file succeed');
                  },
                  fail(res) {
                      console.error(res);
                  }
              });
          }
            else {
                console.error('Unsupported file type');
            }
        },
        fail: function (res) {
            console.error(res);
        }
    });
}



})
