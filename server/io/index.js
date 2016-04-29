'use strict';
var socketio = require('socket.io');
//Might need to specify


var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!

        //test emit
        socket.emit('test', {emotion: "happy"});

        socket.on('disconnect', function(){
            console.log("See ya...");
        });

        socket.on('winner', function(start, end, color){
            console.log('catching the winner event here')

            // we need to emit an event all sockets except the socket that originally emitted the
            // the draw data to the server
            // broadcasting means sending a message to everyone else except for the
            // the socket that starts it
            socket.broadcast.emit('winner', start, end, color);
        });
    });

    return io;

};

