const axios = require("axios");

const apiKey = 'luEfsgjXr8PvHwCIq7d3Y9Fn';    
const secKey = 'TVReOBGyYnRpNm3AYkfnVPgMSrT9RhRU';

const getBaiduToken = async () => {
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secKey}`;

    try {
        const res = await axios.post(tokenUrl);
        const baiduToken = res.data.access_token;
        return baiduToken;
    } catch(error) {
        console.log(error);
        return null;
    }
};

module.exports = getBaiduToken;