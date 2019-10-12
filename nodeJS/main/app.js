var express = require('express');
var http = require('http');
const Sequelize = require('sequelize');
const models = require("./models");

var path = require('path');
//const testModels = require("./models/test.js");

models.sequelize.sync().then(() => {
    console.log(" DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
});

//익스프레스 객체 생성
const app = express();

function configApp() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    require('./routes').routes(app);

}

configApp();

app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});

module.exports = app;
