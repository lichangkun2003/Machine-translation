const axios = require("axios");
const getBaiduToken = require("./getBaiduToken");

const scanImageInfo = async (imageData) => {
    const baiduToken = await getBaiduToken();

    if(!baiduToken) {
        throw new Error("Failed to retrieve Baidu token.");
    }

    const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${baiduToken}`;

    try {
        const res = await axios.post(detectUrl,{
            image: imageData,
        },{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        // console.log(res.data);
        
        const words = res.data.words_result.map((word) => word.words).join(""); // 从响应数据中提取文字信息
        return { content: words, numberWords: words.length }; // 返回提取的内容和字符数
    } catch(error) {
        console.log(error);
        return null;
    } 
};

module.exports = scanImageInfo;