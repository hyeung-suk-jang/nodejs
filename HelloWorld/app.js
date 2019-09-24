const express = require("express");
const http = require('http');
const mysql = require('mysql');
const api = require('./api');

const app = express();
var server = http.createServer(app);

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'mangoo',
    port : '3306',
    database : 'testdb'
})

connection.connect();

connection.query('select * from user', function(err,rows, fields){
    if(!err){
        console.log('data :',rows);
    }else{
        console.log('error 발생',err);
    }
});
connection.end();


app.use(api);

app.get('/', function(req,res){
    res.send('Hello world');
})

app.get('world.html',function(req,res){
    res.send('Hello World');
});


server.listen(8000,function(){
    console.log('Express server listening on port' + server.address().port);
})
