// 封装的云托管调用函数
function translate(q, {from = 'auto', to = 'auto'} = {from: 'auto', to: 'auto'}) {
    const encodedQ = encodeURIComponent(q);
    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);

    // 拼接 URL
    const path = `/text?q=${encodedQ}&from=${encodedFrom}&to=${encodedTo}`;
    console.log(q)
	// 直接返回 wx.cloud.callContainer 的调用结果
	return wx.cloud.callContainer(
		{
			config: {
				env: "prod-2gwhqvn3e325f9f5", // 替换为您的环境ID
			},
			// path: "/text" + '?q=' + q + '&from=' + from + '&to=' + to,
            path:path,
			method: "GET",
			header: {
				"X-WX-SERVICE": "express-toch", // 您的服务名称
				"content-type": "application/json", // 内容类型
			},
			data: {
                // q,
                // from,
                // to
            }
		}
	).then(res => {
	  // 成功时的回调
	  if (res.statusCode === 200) {
        if(res.data){
            return res; // 返回后端服务返回的数据
        } else {
            wx.showToast({
                title: '翻译失败',
                icon: 'none',
                duration: 3000
            });
            throw new Error(`服务器返回状态码：${res.statusCode}`); // 抛出错误
        }
	  } else {
        wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 3000
        });
		throw new Error(`服务器返回状态码：${res.statusCode}`); // 抛出错误
	  }
	}).catch(err => {
		// 失败时的回调
		wx.showToast({
			title: '网络异常',
			icon: 'none',
			duration: 3000
		});
		console.error('调用云托管服务失败:', err);
		throw err; // 抛出错误
	});
}
  

// 封装的云托管调用函数
function imageInfo(imageData) {
	// 直接返回 wx.cloud.callContainer 的调用结果
	return wx.cloud.callContainer(
		{
			config: {
				env: "prod-2gwhqvn3e325f9f5", // 替换为您的环境ID
			},
			path: "/image",
			method: "POST",
			header: {
				"X-WX-SERVICE": "express-toch", // 您的服务名称
				"content-type": "application/json", // 内容类型
			},
			data: {
                imageData,
            }, 
		}
	).then(res => {
	  // 成功时的回调
	  if (res.statusCode === 200) {
        console.log('本地请求get word success：',res.data); 
        return res; 
	  } else {
        wx.showToast({
            title: '图片网络异常',
            icon: 'none',
            duration: 3000
        });   
        console.log('本地端口get word fail：',res); 
		throw new Error(`图片识别失败 服务器返回状态码：${res.statusCode}`); // 抛出错误
	  }
	}).catch(err => {
	  // 失败时的回调
	  console.error('调用云托管服务失败:', err);
	  throw err; // 抛出错误
	});
}

  
module.exports.translate = translate;
module.exports.imageInfo = imageInfo;