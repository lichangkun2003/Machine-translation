// 调用服务器8081端口 --- 进行文本翻译工作
function translate(q, {from = 'auto', to = 'auto'} = {from: 'auto', to: 'auto'}){
	return new Promise((resolve, reject) => {
		wx.request({        
            url: "https://express-toch-98190-4-1317758392.sh.run.tcloudbase.com/text",        
            method: 'GET',        
            dataType: 'json',        
            header:{                
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },      
			data:{
				q,
				from,
				to,
			}, 
			success(res){
				if(res.data){
					resolve(res)
				} else {
					reject({status: 'error', msg: '翻译失败'});
					wx.showToast({
						title: '翻译失败',
						icon: 'none',
						duration: 3000
					});
				}
			},
			fail(){
				reject({status: 'error', msg: '翻译失败'});
				wx.showToast({
					title: '网络异常',
					icon: 'none',
					duration: 3000
				});
			}   
        });
	})
}

// 调用服务器8081端口 --- 进行图片翻译工作
function imageInfo(imageData) {
	return new Promise(
		function(resolve,reject){        
			wx.request({        
				url: "https://express-toch-98190-4-1317758392.sh.run.tcloudbase.com/image",        
				method: 'POST',        
				dataType: 'json',        
				header:{                
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				},      
				data:{
					imageData,
				}, 
				success(res){
					console.log('本地请求get word success：',res.data);              
					resolve(res);
				},
				fail : function(res){              
					console.log('本地端口get word fail：',res.data); 
					reject({status: 'error', msg: '图片识别失败'});
					wx.showToast({
						title: '图片网络异常',
						icon: 'none',
						duration: 3000
					});   
				}
		});
	}) ;
}

module.exports.translate = translate;
module.exports.imageInfo = imageInfo;
