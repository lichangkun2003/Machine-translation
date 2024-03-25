// test.js 文件
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const { expect } = chai;
const fs = require("fs");
const imageData = fs.readFileSync('./testImage.png');
const imageBase64 = imageData.toString("base64")

chai.use(chaiHttp);

describe('API tests', function() {

    it('should return translation result for GET /text', function(done) {
        const query = 'hello';
        chai.request(app)
          .get(`/text?q=${query}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            console.log(res.body);
            expect(res.body[0].dst).to.equal('你好');
            console.log(res.body);
            done();
          });
    });
      

    it('should return image info for POST /image', function(done) {
        chai.request(app)
        .post('/image')
        .send({imageData:imageBase64})
        .end(function(err, res) {
            expect(res).to.have.status(200);
            console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.body.content).to.be.an('string');
            done();
        });
    });

    it('should return 500 status code for invalid POST /image request', function(done) {
        chai.request(app)
        .post('/image')
        .end(function(err, res) {
        expect(res).to.have.status(500);
        done();
        });
    });

});