'use strict';
var chalk = require('chalk');
var fs = require('fs');

// Requires in ./db/index.js -- which returns a promise that represents
// mongoose establishing a connection to a MongoDB database.
var startDb = require('./db');

var secureConfig = {
    key: fs.readFileSync(__dirname + '/../key.pem'),
    cert: fs.readFileSync(__dirname + '/../cert.pem')
};

// console.log(secureConfig)
// Create a node server instance! cOoL!
var server = require('https').createServer(secureConfig);

var createApplication = function () {
    // console.log("createApplication")
    var app = require('./app');
    server.on('request', app); // Attach the Express application.
    require('./io')(server);   // Attach socket.io.
};

var startServer = function () {
    // console.log("startServer")
    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
    console.error(chalk.red(err.stack));
    process.kill(1);
});


//MY BEST TRY:

// 'use strict';
// var chalk = require('chalk');
// var https = require('https');
// var fs = require('fs');

// var secureConfig = {
//     key: fs.readFileSync(__dirname + '/../key.pem'),
//     cert: fs.readFileSync(__dirname + '/../cert.pem')
// };

// // Requires in ./db/index.js -- which returns a promise that represents
// // mongoose establishing a connection to a MongoDB database.
// var startDb = require('./db');

// var PORT = process.env.PORT || 1337;

// var createApplication = function () {
//     var app = require('./app');
//     // Create a node server instance! cOoL!
//     var server = https.createServer(secureConfig, app).listen(PORT, function () {
//         console.log('HTTPS server patiently listening on PORT', PORT);
//     });
//     console.log("should be 1st")
//     server.on('request', app); // Attach the Express application.
//     require('./io')(server);   // Attach socket.io.
// };

// var startServer = function () {


//     console.log("should be 2nd")
//     // server.listen(PORT, function () {
//     //     console.log('HTTPS server patiently listening on PORT', PORT);
//     // });

// };

// startDb.then(createApplication).then(startServer).catch(function (err) {
//     console.error(chalk.red(err.stack));
//     process.kill(1);
// });
