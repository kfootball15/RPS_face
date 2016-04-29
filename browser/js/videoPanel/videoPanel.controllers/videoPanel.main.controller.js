app.controller('videoPanelCtrl', function($scope) {


        //SOCKETS
        // EMITTERS - my whiteboard.js
        //theGamePanel = whiteboard

        window.theGamePanel = new window.EventEmitter();

        (function () {

            var canvas = document.getElementById('videoel');
            console.log("Canvas Video Element", canvas)

            canvas.addEventListener('conclusion', function (e) {
                console.log("Sending conclusion Event!!!")

                theGamePanel.send(gameImage, loser, true)
            });

            canvas.addEventListener('loser', function (e) {
                console.log("Sending loser Event!!!")

                theGamePanel.send(gameImage, loser, true)
            });

            canvas.addEventListener('mousedown', function (e) {
                console.log("Sending winner Event!!!")

                theGamePanel.send(gameImage, winner, true)
            });


            theGamePanel.send = function (gameImage, outcome, shouldBroadcast) {
                // Draw the line between the start and end positions
                // that is colored with the given color.
                // If shouldBroadcast is truthy, we will emit a draw event to listeners
                // with the start, end and color data.
                if (shouldBroadcast) {
                    // this event we emit is caught by the whiteboard object in app.js
                    whiteboard.emit('sendGameImage', {}, 'winner');
                }
            };

        })();

        //.on's - my app.js
        //This is way more important
        //This is where all of your event emmitters and listeners will go
        var socket = io(window.location.origin);

        socket.on('test', function(obj){
            console.log("We have arrived", obj.emotion)
        })

        socket.on('connect', function(){

              console.log('I have made a persistent two-way connection to the server!');


              // the draw event is emitted in whiteboard.js and caught here
              theGamePanel.on('click', function (gameImage, outcome){
                  socket.emit('winner')
              })



              socket.on('otherDraw', function(start, end, color){
                theGamePanel.draw(start, end, color)
              })

              socket.on('sendGameImage', function(gameImage, outcome){
                socket.emit('winner', start, end, color)
              })

        })



        //---------------------------------------------//




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

        var vid = document.getElementById('videoel');
        var overlay = document.getElementById('overlay');
        var overlayCC = overlay.getContext('2d');

        /********** check and set up video/webcam **********/

        function enablestart() {
            var startbutton = document.getElementById('startbutton');
            startbutton.value = "start";
            startbutton.disabled = null;
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
        console.log("This THING:" navigator.getUserMedia)

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

        /*********** setup of emotion detection *************/

        var ctrack = new clm.tracker({useWebGL : true});
        ctrack.init(pModel);

        $scope.startVideo = function() {
            $scope.drawLoopVar = true;
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

            //Get current emotion parameters from CP
            //ec is an instance of emotionclassifier()
            //meanPredict is reading the data from cp's current parameters and getting an emotion reading
            var cp = ctrack.getCurrentParameters();
            var er = ec.meanPredict(cp)
            console.log("inside stopVideo Function", er)

            // create object to send to opponent/determine the victor
            var image = createPicture(er)
            console.log("CreatePicture result", image)

            // stop tracking
            ctrack.stop(vid);
            // reset tracking
            ctrack.reset()
            // stop video
            vid.pause();
        };

        function createPicture(er){
            // return document.getElementById('videoel')
            // get the canvas context for drawing
            var gameImage = {};

            //Grab Appropriate Elements
            var video = document.getElementById('videoel');
            var thecanvas = document.getElementById('thecanvas');
            var context = thecanvas.getContext('2d');

        // draw the video contents into the canvas x, y, width, height
            context.drawImage( video, 0, 0, thecanvas.width, thecanvas.height);

            gameImage.emotion = findEmotion(er)
            gameImage.image =
            console.log(gameImage)

            return gameImage

        // // get the image data from the canvas object
        //     var dataURL = thecanvas.toDataURL();
        //     console.log("dataURL", dataURL)

        // // set the source of the img tag
        //     video.setAttribute('src', dataURL);
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
            console.log(er)
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
