app.controller('videoPanelCtrl', function($scope, $state, loggedInUser) {


        //SOCKETS
        // EMITTERS - my whiteboard.js
        // var canvas = document.getElementById('videoel');
        // var overlay = document.getElementById('overlay')
        var promptbutton = document.getElementById('promptButton');
        var vid = document.getElementById('videoel');
        var overlay = document.getElementById('overlay');
        var overlayCC = overlay.getContext('2d');
        var overlayInstructionA = document.getElementById('overlayInstructionA');
        // var overlayCCInstructionA = overlayInstructionA.getContext('2d')
        $scope.loggedInUser = loggedInUser;
        $scope.opponentReceived = false;
        $scope.showInstructionPrompt = true;
        $scope.showInstructionA = false;
        $scope.showInstructionB = false;
        $scope.waitingForOpponent = false;
        $scope.infoRecieved = false;
        $scope.myInfo;

        //Button/Div Event Listeners
        (function () {

            $scope.canvasClickCounter = 0;
            overlay.addEventListener('click', function(){
                if ($scope.canvasClickCounter === 0){
                    $scope.showInstructionPrompt = false;
                    $scope.showInstructionA = true
                    console.log("Herllo")
                    $scope.$digest()
                    $scope.canvasClickCounter++;
                }
                else if ($scope.canvasClickCounter === 1){
                    $scope.startVideo();
                    $scope.showInstructionA = false;
                    $scope.showInstructionB = true;
                    $scope.$digest()
                     // overlayInstructionA.style.visibility = showInstructions;
                    console.log("showInstructionA", $scope.showInstructionA)
                    console.log("showInstructionB", $scope.showInstructionB)
                    $scope.canvasClickCounter++;
                }
                else if ($scope.canvasClickCounter ===2) {
                    $scope.showInstructionB = false;
                    $scope.waitingForOpponent = true;
                    $scope.$digest()
                    $scope.TakePicture();
                    $scope.canvasClickCounter++;
                }
            });

            window.addEventListener('keydown', function(e){
                var key = e.which || e.keyCode;
                if(key === 13){
                    if ($scope.canvasClickCounter === 0){
                        $scope.showInstructionPrompt = false;
                        $scope.showInstructionA = true
                        console.log("Herllo")
                        $scope.$digest()
                        $scope.canvasClickCounter++;
                    }
                    else if ($scope.canvasClickCounter === 1){
                        $scope.startVideo();
                        $scope.showInstructionA = false;
                        $scope.showInstructionB = true;
                        $scope.$digest()
                         // overlayInstructionA.style.visibility = showInstructions;
                        console.log("showInstructionA", $scope.showInstructionA)
                        console.log("showInstructionB", $scope.showInstructionB)
                        $scope.canvasClickCounter++;
                    }
                    else if ($scope.canvasClickCounter === 2) {
                        $scope.showInstructionB = false;
                        $scope.waitingForOpponent = true;
                        $scope.$digest()
                        $scope.TakePicture();
                        $scope.canvasClickCounter++;
                    }
                }
            });

        })();

        //Socket Event Listeners
        var socket = io(window.location.origin);

        socket.on('connect', function(){
            console.log('I have made a persistent two-way connection to the server!');
        });

        socket.on('infoReceived', function(){
            $scope.infoRecieved = true;
        });

        socket.on('receiveFirst', function(gameObj){
            $scope.theirInfo = gameObj;
            console.log("recieveFirst", $scope.theirInfo)
        });

        socket.on('decideWinner', function(obj){
            if(obj) $scope.theirInfo = obj;
            var gameObj = decideWinner();
            console.log("Got into decide Winner", gameObj);
            //reset infoRecieved
            $scope.infoRecieved = false;
            $state.go('outcomePanel', {myParam: gameObj});
        });

        socket.on('opponentReceivedA', function(){
            console.log("opponentReceivedA Ran!!!")
            $scope.opponentReceived = true;
            socket.emit('opponentReceivedB')
            $scope.$digest()
        });

        socket.on('opponentReceivedB', function(){
            console.log("opponentReceivedB Ran!!!")
            $scope.opponentReceived = true;
            $scope.$digest()
        });

        socket.on('opponentlost', function(){
            console.log("opponentlost Ran!!!")
            $scope.opponentReceived = false;
            $scope.$digest()
        });


        //Determine Outcome Function
        function decideWinner() {
            console.log("theirInfo:", $scope.theirInfo);
            console.log("myInfo:", $scope.myInfo);
            var gameResult = {};
            gameResult.yourInfo = $scope.myInfo;
            gameResult.image = createPicture($scope.myInfo).image;
            gameResult.theirInfo = $scope.theirInfo;
            gameResult.prompt = $scope.promptInput

            if ($scope.myInfo.emotion === 'happy' && $scope.theirInfo.emotion === 'angry'){
                gameResult.result = 'winner';
                gameResult.yourInfo.result = 'winner';
                gameResult.yourInfo.verb = 'happiness';
                gameResult.theirInfo.verb = 'anger';
                console.log("YOU WON!!!!", gameResult);
                return gameResult;
            }
            else if ($scope.myInfo.emotion === 'happy' && $scope.theirInfo.emotion === 'sad'){
                gameResult.result = 'loser';
                gameResult.yourInfo.result = 'loser';
                gameResult.yourInfo.verb = 'happiness';
                gameResult.theirInfo.verb = 'sadness';
                console.log("YOU LOST!!!!", gameResult);
                return gameResult;
            }
            else if ($scope.myInfo.emotion === 'sad' && $scope.theirInfo.emotion === 'happy'){
                gameResult.result = 'winner';
                gameResult.yourInfo.result = 'winner';
                gameResult.yourInfo.verb = 'sadness';
                gameResult.theirInfo.verb = 'happiness';
                console.log("YOU WON!!!!", gameResult);
                return gameResult;
            }
            else if ($scope.myInfo.emotion === 'sad' && $scope.theirInfo.emotion === 'angry'){
                gameResult.result = 'loser';
                gameResult.yourInfo.result = 'loser';
                gameResult.yourInfo.verb = 'sadness';
                gameResult.theirInfo.verb = 'anger';
                console.log("YOU LOST!!!!", gameResult);
                return gameResult;
            }
            else if ($scope.myInfo.emotion === 'angry' && $scope.theirInfo.emotion === 'sad'){
                gameResult.result = 'winner';
                gameResult.yourInfo.result = 'winner';
                gameResult.yourInfo.verb = 'anger';
                gameResult.theirInfo.verb = 'sadness';
                console.log("YOU WON!!!!", gameResult);
                return gameResult;
            }
            else if ($scope.myInfo.emotion === 'angry' && $scope.theirInfo.emotion === 'happy'){
                gameResult.result = 'loser';
                gameResult.yourInfo.result = 'loser';
                gameResult.yourInfo.verb = 'anger';
                gameResult.theirInfo.verb = 'happiness';
                console.log("YOU LOST!!!!", gameResult);
                return gameResult;
            }
            else {
                gameResult.result = 'tie';
                console.log("You Tied!!!!", gameResult);
                return gameResult;
            }

        }


        // getUserMedia only works over https in Chrome 47+, so we redirect to https. Also notify user if running from file.
        if (window.location.protocol == "file:") {
            alert("You seem to be running this example directly from a file. Note that these examples only work when served from a server or localhost due to canvas cross-domain restrictions.");
        } else if (window.location.hostname !== "localhost" && window.location.protocol !== "https:"){
            window.location.protocol = "https";
        }

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-32642923-1']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();


        /********** check and set up video/webcam **********/

        function enablestart() {
            var startbutton = document.getElementById('startbutton');
            // startbutton.value = "start";
            // startbutton.disabled = null;
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
        //console.log("This THING:", navigator.getUserMedia)

        // check for camerasupport
        if (navigator.getUserMedia) {
            // set up stream

            var videoSelector = {video : true};
            if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
                var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
                if (chromeVersion < 20) {
                    videoSelector = "video";
                }
            };

            navigator.getUserMedia(videoSelector, function( stream ) {
                if (vid.mozCaptureStream) {
                    vid.mozSrcObject = stream;
                } else {
                    vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                }
                vid.play();
            }, function() {
                //insertAltVideo(vid);
                alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
            });
        } else {
            //insertAltVideo(vid);
            alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
        }

        vid.addEventListener('canplay', enablestart, false);



        /***********                            *************/
        /*********** setup of emotion detection *************/
        /***********                            *************/



        var ctrack = new clm.tracker({useWebGL : true});
        ctrack.init(pModel);

        $scope.startVideo = function() {
            $scope.drawLoopVar = true;
            $scope.drawInstructionsVar = true
            // start video
            vid.play();
            // start tracking
            ctrack.start(vid);
            // start loop to draw face
            drawLoop();
        };

        console.log(ctrack);

        //The MEAT AND POTATOES!!! Takes a picture and creates an object
        $scope.TakePicture = function() {
            //Stop the drawLoop function by setting this to false
            $scope.drawLoopVar = false;
            $scope.drawInstructionsVar = false;

            //Get current emotion parameters from CP
            //ec is an instance of emotionclassifier()
            //meanPredict is reading the data from cp's current parameters and getting an emotion reading
            var cp = ctrack.getCurrentParameters();
            var er = ec.meanPredict(cp)

            // create object to send to opponent/determine the victor
            var gameObj = createPicture(er)

            //Emit the gameObj Objec to the server
            $scope.myInfo = gameObj;
            $scope.myInfo.id = $scope.loggedInUser._id
            if($scope.infoRecieved) {
                console.log("got into sendSecond elseif", gameObj)
                socket.emit('sendSecond', gameObj)
            }
            else {
                console.log("Got into sendFirst elseif", gameObj)
                socket.emit('sendFirst', gameObj)
            }

            // stop tracking
            ctrack.stop(vid);
            // reset tracking
            ctrack.reset()
            // stop video
            vid.pause();
        };

        function createPicture(er){

            // get the canvas context for drawing
            var gameImage = {};

            //Grab Appropriate Elements
            var video = document.getElementById('videoel');
            var thecanvas = document.getElementById('thecanvas');
            var context = thecanvas.getContext('2d');

            // draw the video contents into the canvas x, y, width, height
            context.drawImage( video, 0, 0, thecanvas.width, thecanvas.height);

            gameImage.emotion = findEmotion(er)
            gameImage.image = thecanvas.toDataURL()

            return gameImage

        }



        function findEmotion(er) {
            var currentValue = 0
            var currentEmotion;
            for (var i = 0; i < er.length; i++) {
                if(er[i].value > currentValue) {
                    currentValue = er[i].value;
                    currentEmotion = er[i].emotion
                }
            }
            return currentEmotion
        }

        function drawInstructions() {
            if($scope.drawInstructionsVar) requestAnimFrame(drawInstructions);
            overlayCCInstructionA.clearRect(0, 0, 400, 300);
            ctrack.draw(overlayCCInstructionA)
        }

        function drawLoop() {
            if($scope.drawLoopVar) requestAnimFrame(drawLoop);
            overlayCC.clearRect(0, 0, 400, 300);
            //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
            if (ctrack.getCurrentPosition()) {
                ctrack.draw(overlay);
            }

            //Get current paramters and predict emotions
            var cp = ctrack.getCurrentParameters();
            var er = ec.meanPredict(cp);
            if (er) {
                updateData(er);
                for (var i = 0; i < er.length; i++) {
                    if (er[i].value > 0.4) {
                        document.getElementById('icon'+(i+1)).style.visibility = 'visible';
                    } else {
                        document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
                    }
                }
            }
        }

        var ec = new emotionClassifier();
        ec.init(emotionModel);
        var emotionData = ec.getBlank();

        /************ d3 code for barchart *****************/

        var margin = {top : 20, right : 20, bottom : 10, left : 40},
            width = 400 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;

        var barWidth = 30;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.linear()
            .domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);

        var y = d3.scale.linear()
            .domain([0,1]).range([0, height]);

        var svg = d3.select("#emotion_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        svg.selectAll("rect").
          data(emotionData).
          enter().
          append("svg:rect").
          attr("x", function(datum, index) { return x(index); }).
          attr("y", function(datum) { return height - y(datum.value); }).
          attr("height", function(datum) { return y(datum.value); }).
          attr("width", barWidth).
          attr("fill", "#2d578b");

        svg.selectAll("text.labels").
          data(emotionData).
          enter().
          append("svg:text").
          attr("x", function(datum, index) { return x(index) + barWidth; }).
          attr("y", function(datum) { return height - y(datum.value); }).
          attr("dx", -barWidth/2).
          attr("dy", "1.2em").
          attr("text-anchor", "middle").
          text(function(datum) { return datum.value; }).
          attr("fill", "white").
          attr("class", "labels");

        svg.selectAll("text.yAxis").
          data(emotionData).
          enter().append("svg:text").
          attr("x", function(datum, index) { return x(index) + barWidth; }).
          attr("y", height).
          attr("dx", -barWidth/2).
          attr("text-anchor", "middle").
          attr("style", "font-size: 12").
          text(function(datum) { return datum.emotion; }).
          attr("transform", "translate(0, 18)").
          attr("class", "yAxis");

        function updateData(data) {
            // update
            var rects = svg.selectAll("rect")
                .data(data)
                .attr("y", function(datum) { return height - y(datum.value); })
                .attr("height", function(datum) { return y(datum.value); });
            var texts = svg.selectAll("text.labels")
                .data(data)
                .attr("y", function(datum) { return height - y(datum.value); })
                .text(function(datum) { return datum.value.toFixed(1); });

            // enter
            rects.enter().append("svg:rect");
            texts.enter().append("svg:text");

            // exit
            rects.exit().remove();
            texts.exit().remove();
        }

        /******** stats ********/
        var stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        document.getElementById('container').appendChild( stats.domElement );

        // update stats on every iteration
        document.addEventListener('clmtrackrIteration', function(event) {
            stats.update();
        }, false);

});
