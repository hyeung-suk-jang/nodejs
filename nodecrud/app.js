// CRUD에 필요한 모듈 사용
const mysql = require('mysql');
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

// 연결할 DB 정보입력
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mangoo8@',
  database: 'word',
  port: '3306',
});

//http 서버
const app = express();
app.use(bodyParser.urlencoded({
  extended: false,
}));
//app.use(express.static(__dirname + '/static'));


app.listen(3000, () => {
  console.log('Server is running port 3000!');
  // 데이터베이스 연결
  connection.connect();
});



//소켓서버
var conf = { 
    port: 8888,
    debug: false,
    dbPort: 6379,
    dbHost: '127.0.0.1',
    dbOptions: {},
    mainroom: 'MainRoom'
};
// External dependencies
var express2 = require('express'),
    http = require('http'),
    events = require('events'),
    _ = require('underscore'),
    sanitize = require('validator').sanitize;
// HTTP Server configuration & launch
var app2 = express2(),
    server = http.createServer(app2);
    server.listen(conf.port);

// Express app configuration
//app2.use(express2.bodyParser());
app2.use(express2.static(__dirname + '/static'));

var io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({ host: conf.dbHost, port: conf.dbPort }));

var db = require('redis').createClient(conf.dbPort,conf.dbHost);

// Logger configuration
var logger = new events.EventEmitter();
logger.on('newEvent', function(event, data) {
    // Console log
    console.log('%s: %s', event, JSON.stringify(data));
    
});

// Only authenticated users should be able to use protected methods
var requireAuthentication = function(req, res, next) {
    // TODO
    next();
};

// Send a message to all active rooms
var sendBroadcast = function(text) {
    _.each(io.nsps['/'].adapter.rooms, function(sockets, room) {
        var message = {'room':room, 'username':'ServerBot', 'msg':text, 'date':new Date()};
        io.to(room).emit('newMessage', message);
    });
    logger.emit('newEvent', 'newBroadcastMessage', {'msg':text});
};


// Broadcast message to all connected users
app2.post('/api/broadcast/', requireAuthentication, function(req, res) {
    sendBroadcast(req.body.msg);
    res.send(201, "Message sent to all rooms");
}); 

// ***************************************************************************
// Socket.io events
// ***************************************************************************
var usercount = 1;

//client 커넥션 시도.
io.sockets.on('connection', function(socket) {
	var usernick = 'user'+usercount++;
    // Welcome message on connection
    socket.emit('connected', 'Welcome to the chat server');
    logger.emit('newEvent', 'userConnected', {'socket':socket.id});

    // Store user data in db
    db.hset([socket.id, 'connectionDate', new Date()], redis.print);
    db.hset([socket.id, 'socketID', socket.id], redis.print);
    db.hset([socket.id, 'username', usernick], redis.print);

	
    // Join user to 'MainRoom'
    socket.join(conf.mainroom);
    logger.emit('newEvent', 'userJoinsRoom', {'socket':socket.id, 'room':conf.mainroom});
    // Confirm subscription to user
    socket.emit('subscriptionConfirmed', {'room':conf.mainroom});

	console.log(socket.id);
    // Notify subscription to all users in room
    var data = {'room':conf.mainroom, 'username':usernick, 'msg':'----- Joined the room -----', 'id':socket.id};
    io.to(conf.mainroom).emit('userJoinsRoom', data);

    // User wants to subscribe to [data.rooms]
    socket.on('subscribe', function(data) {
        // Get user info from db
        db.hget([socket.id, 'username'], function(err, username) {

            // Subscribe user to chosen rooms
            _.each(data.rooms, function(room) {
                room = room.replace(" ","");
                socket.join(room);
                logger.emit('newEvent', 'userJoinsRoom', {'socket':socket.id, 'username':username, 'room':room});

                // Confirm subscription to user
                socket.emit('subscriptionConfirmed', {'room': room});
        
                // Notify subscription to all users in room
                var message = {'room':room, 'username':username, 'msg':'----- Joined the room -----', 'id':socket.id};
                io.to(room).emit('userJoinsRoom', message);
            });
        });
    });

    // User wants to unsubscribe from [data.rooms]
    socket.on('unsubscribe', function(data) {
        // Get user info from db
        db.hget([socket.id, 'username'], function(err, username) {
        
            // Unsubscribe user from chosen rooms
            _.each(data.rooms, function(room) {
                if (room != conf.mainroom) {
                    socket.leave(room);
                    logger.emit('newEvent', 'userLeavesRoom', {'socket':socket.id, 'username':username, 'room':room});
                
                    // Confirm unsubscription to user
                    socket.emit('unsubscriptionConfirmed', {'room': room});
        
                    // Notify unsubscription to all users in room
                    var message = {'room':room, 'username':username, 'msg':'----- Left the room -----', 'id': socket.id};
                    io.to(room).emit('userLeavesRoom', message);
                }
            });
        });
    });

    // User wants to know what rooms he has joined
    socket.on('getRooms', function(data) {
        socket.emit('roomsReceived', socket.rooms);
        logger.emit('newEvent', 'userGetsRooms', {'socket':socket.id});
    });

    // Get users in given room
    socket.on('getUsersInRoom', function(data) {
        var usersInRoom = [];
        var socketsInRoom = _.keys(io.nsps['/'].adapter.rooms[data.room]);
        for (var i=0; i<socketsInRoom.length; i++) {
            db.hgetall(socketsInRoom[i], function(err, obj) {
				usersInRoom.push({'room':data.room, 'username':data.username, 'id':data.socketID});
                //usersInRoom.push({'room':data.room, 'username':obj.username, 'id':obj.socketID});
                // When we've finished with the last one, notify user
                if (usersInRoom.length == socketsInRoom.length) {
                    socket.emit('usersInRoom', {'users':usersInRoom});
                }
            });
        }
    });

    // User wants to change his nickname
    socket.on('setNickname', function(data) {
        // Get user info from db
        db.hget([socket.id, 'username'], function(err, username) {

            // Store user data in db
            db.hset([socket.id, 'username', data.username], redis.print);
            logger.emit('newEvent', 'userSetsNickname', {'socket':socket.id, 'oldUsername':username, 'newUsername':data.username});

            // Notify all users who belong to the same rooms that this one
            _.each(socket.rooms, function(room) {
                if (room) {
                    var info = {'room':room, 'oldUsername':username, 'newUsername':data.username, 'id':socket.id};
                    io.to(room).emit('userNicknameUpdated', info);
					console.log('userNicknameUpdated', info);
                }
            });
        });
    });

    // New message sent to group
    socket.on('newMessage', function(data) {
		//alert(data);
		console.log('newMessage',data);
        db.hgetall(socket.id, function(err, obj) {
            if (err) return logger.emit('newEvent', 'error', err);
            // Check if user is subscribed to room before sending his message
            if (_.contains(_.values(socket.rooms), data.room)) {
                var message = {'room':data.room, 'username':obj.username, 'msg':data.msg, 'date':new Date()};
                // Send message to room
                io.to(data.room).emit('newMessage', message);
				
                logger.emit('newEvent', 'newMessage', message);
            }
        });
    });

    // Clean up on disconnect
    socket.on('disconnect', function() {
        
        // Get current rooms of user
        var rooms = socket.rooms;
        
        // Get user info from db
        db.hgetall(socket.id, function(err, obj) {
            if (err) return logger.emit('newEvent', 'error', err);
            logger.emit('newEvent', 'userDisconnected', {'socket':socket.id, 'username':obj.username});

            // Notify all users who belong to the same rooms that this one
            _.each(rooms, function(room) {
                if (room) {
                    var message = {'room':room, 'username':obj.username, 'msg':'----- Left the room -----', 'id':obj.socketID};
                    io.to(room).emit('userLeavesRoom', message);
                }
            });
        });
    
        // Delete user from db
        db.del(socket.id, redis.print);
    });
});


// 데이터 조회
app.get('/', (request, response) => {
  fs.readFile('wordList.html', 'utf-8', (error, data) => {
    // Select 쿼리문 사용
    connection.query('SELECT * from wordlist', (error, results, fields) => {
      if (error) throw error;
      response.send(ejs.render(data, {
        data: results,
      }));
    });
  });
});

// 데이터 추가
app.get('/create', (request, response) => {
  fs.readFile('insertNewWord.html', 'utf-8', (error, data) => {
    if (error) throw error;
    response.send(data);
  });
});

// 데이터 추가
app.post('/create', (request, response) => {
  const body = request.body;
  connection.query('INSERT INTO wordlist (eng,kor) VALUE (?, ?)',
    [body.eng, body.kor], () => {
      // 조회 페이지로 이동
      response.redirect('/');
    });
});

// 데이터 수정
app.get('/modify/:id', (request, response) => {
  // 파일을 읽어옵니다.
  fs.readFile('modify.html', 'utf-8', (error, data) => {
    connection.query('SELECT * from wordlist WHERE idx =?', [request.params.id], (error, results) => {
      if (error) throw error;
      response.send(ejs.render(data, {
        data: results[0],
      }));
    });
  });
});

//수정완료.
app.post('/modify/:id', (request, response) => {
  const body = request.body;
  connection.query('UPDATE wordlist SET eng = ?, kor = ? WHERE idx = ?',
    [body.eng, body.kor, request.params.id], (error, results) => {
      if (error) throw error;
      // 조회페이지로 이동
      response.redirect('/');
    });
});

// 데이터 삭제
app.get('/delete/:id', (request, response) => {
  connection.query('DELETE FROM wordlist where idx=?', [request.params.id], () => {
    // 조회 페이지로 이동
    response.redirect('/');
  });
});


/*
INSERT INTO wordlist(eng,kor) VALUES("progress","전진(하다),진보(하다)");
INSERT INTO wordlist(eng,kor) VALUES("progressive","진보적인, 점진적인");
INSERT INTO wordlist(eng,kor) VALUES("propose","제안하다; 청혼하다");
INSERT INTO wordlist(eng,kor) VALUES("proposal","제안, 청혼");
INSERT INTO wordlist(eng,kor) VALUES("produce","생산[제조]하다; 농산물");
INSERT INTO wordlist(eng,kor) VALUES("producer","생산자, 제작자");
INSERT INTO wordlist(eng,kor) VALUES("product","생산품, 제품");
INSERT INTO wordlist(eng,kor) VALUES("production","생산, 제조");
INSERT INTO wordlist(eng,kor) VALUES("productive","생산적인, 결실이 많은; 비옥한");
INSERT INTO wordlist(eng,kor) VALUES("protect","보호하다, 막다, 지키다");

*/