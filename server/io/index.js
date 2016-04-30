'use strict';
var socketio = require('socket.io');
//Might need to specify


var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    var connectCounter = 0;
    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log("we have another connection", socket.id)

        socket.on('disconnect', function(){
            console.log("See ya...");
        });

        socket.on('sendFirst', function(obj){
            socket.broadcast.emit('infoReceived');
            socket.broadcast.emit('receiveFirst', obj);
        })

        socket.on('sendSecond', function(obj){
            // socket.broadcast.emit('infoReceived');
            socket.emit('decideWinner')
            socket.broadcast.emit('decideWinner', obj)
        })
    });

    return io;

};

