var test = require('./test');
var uploadFile = require('./uploadFile');
var loadFile = require('./loadFile');
var login = require('./login');
var signup = require('./signup');
var userInfo = require('./userInfo');
var schedule = require('./schedule');
var express = require('express');

module.exports.routes = function(app) {
  var PREFIX = '/api';

  app.use(PREFIX + '/test', test);
  app.use(PREFIX + '/login', login);
  app.use(PREFIX + '/signup', signup);
  app.use(PREFIX + '/userInfo', userInfo);
  app.use(PREFIX + '/uploadFile', uploadFile);
  app.use(PREFIX + '/loadFile', loadFile);
  app.use(PREFIX + '/schedule', schedule);

  app.use('/file', express.static(filePath));

  app.get('/', function(req, res) {
    res.json(':메인페이지');
  });
};