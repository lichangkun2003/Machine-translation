Page({
    data: {
        src:'',
        width:250,//宽度
        height: 250,//高度
    },
    onLoad: function (options) {
    //获取到image-cropper实例
        this.cropper = this.selectComponent("#image-cropper");
        //开始裁剪
        this.setData({
            src:options.src,
        });
        wx.showLoading({
            title: '加载中'
        })
    },
    cropperload(e){
        console.log("cropper初始化完成");
    },
    loadimage(e){
        console.log("图片加载完成",e.detail);
        wx.hideLoading();
        //重置图片角度、缩放、位置
        this.cropper.imgReset();
    },
    clickcut(e) {
        console.log(e.detail);
        //点击裁剪框阅览图片
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    submit() {
        this.cropper.getImg((obj) => {
            let imgSrc = obj.url;
            if (imgSrc) {
                // 返回裁剪后图片的临时地址，并回传给第一个页面
                wx.navigateBack({
                  delta: 1,
                  success: function() {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];
                    wx.getFileSystemManager().readFile({          
                        filePath: imgSrc,          
                        encoding: 'base64',          
                        success: function(res) { 
                            prevPage.scanImageInfo(res.data);                   
                        },
                        
                        fail: function(res){            
                            console.log("[读取图片数据fail]",res)          
                        }  
                    });
                  }
                });     
            }
        });
    },
})