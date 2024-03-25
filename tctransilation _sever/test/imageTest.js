//测试用例
const scanImageInfo = require("../api/image")
const { expect } = require("chai");
const fs = require("fs");
const imageData = fs.readFileSync('./testImage.png');
const imageBase64 = imageData.toString("base64")

describe("scanImageInfo", () => {
    it("should return an object with content and numberWords properties when given valid image data", async () => {
        const result = await scanImageInfo(imageBase64);
        console.log(result);
        expect(result).to.be.an("object");
        expect(result).to.have.property("content");
        expect(result).to.have.property("numberWords");
    });

    it("should return null when given invalid image data", async () => {
        const imageData = null;
        const result = await scanImageInfo(imageData);

        expect(result).to.be.null;
    });
});