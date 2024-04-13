// 导入依赖
const Tesseract = require('tesseract.js');

// 定义云函数
exports.main = async (event, context) => {
  const { imageBuffer } = event;

  // 确保 imageBuffer 是有效的 Buffer
  if (!imageBuffer) {
    return { success: false, message: '无效的图片数据' };
  }

  try {
    // 使用 Tesseract 进行文字识别
    const result = await Tesseract.recognize(
      imageBuffer, // 图片的 Buffer 数据
      'chi_sim', // 指定使用中文简体语言包
      {
        logger: m => console.log(m), // 日志输出
      }
    );

    return { success: true, text: result.text };
  } catch (error) {
    return { success: false, message: '文字识别失败', error };
  }
};