var express = require('express');
var app = express();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
var nicknames = [];

var port = process.env.PORT || 8888;

app.use('/lib/', express.static(__dirname + '/bower_components/jquery/dist/'));
app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function(socket){
		socket.on('new user', function(data, callback){
			if (nicknames.indexOf(data) != -1){
				callback(false);
			} else{
				callback(true);
				socket.nickname = data;
				nicknames.push(socket.nickname);
				//io.sockets.emit('username', nicknames);
			}

		});
		socket.on("message", function (data) {
				io.sockets.emit("username",  data );
		});

    socket.on("error", function (err) {
        console.dir(err);
    });
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
