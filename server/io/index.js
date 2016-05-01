'use strict';
var socketio = require('socket.io');
//Might need to specify


var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        // Now have access to socket, wowzers!
        console.log("we have another connection", socket.id);

        socket.on('disconnect', function(){
            console.log("See ya...");
        });

        socket.on('sendFirst', function(obj){
            socket.broadcast.emit('infoReceived');
            socket.broadcast.emit('receiveFirst', obj);
        });

        socket.on('sendSecond', function(obj){
            // socket.broadcast.emit('infoReceived');
            socket.emit('decideWinner')
            socket.broadcast.emit('decideWinner', obj)
        });

        socket.on('sendDogTag', function(gameObj){
            //This object needs to have:
                //- Winners USERID
                //- Embarassing Photo
            // console.log("Serverside sendDogTag", gameObj)
            var winnersGameObj = {}
            winnersGameObj.myInfo = gameObj.theirInfo
            winnersGameObj.theirInfo = gameObj.myInfo
            winnersGameObj.dogTagImage = gameObj.loserImage
            winnersGameObj.prompt = gameObj.prompt
            // console.log("winnersGameObj:", winnersGameObj)

            socket.emit('goHome')
            socket.broadcast.emit('goToDogTagState', winnersGameObj)
        });
    });

    return io;

};

