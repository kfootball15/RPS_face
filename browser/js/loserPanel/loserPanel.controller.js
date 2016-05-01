app.controller('loserPanelCtrl', function($scope, $state, $stateParams, DogTagsFactory, loggedInUser) {

    //Logged In User
    $scope.loggedInUser = loggedInUser
    var dogTag = {}
    dogTag.opponent = $scope.loggedInUser._id

    //The GameObj and result
    $scope.gameObj= $stateParams.myParam
    $scope.result = $stateParams.myParam.result
    dogTag.user = $scope.gameObj.theirInfo.id

    console.log("LoserPanel GameObj:", $scope.gameObj)


    //CREATE A DOG TAG CREATOR FUCNTION!!!!
        //Have Losers USERID, winners USERID, The losing Image





    //SOCKETS
    var socket = io(window.location.origin);
    var promptbutton = document.getElementById('promptButton');
    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayInstructionA = document.getElementById('overlayInstructionA');
    $scope.showInstructionB = true;
    $scope.waitingForOpponent = false;



    //Button/Div Event Listeners
    (function () {

        $scope.canvasClickCounter = 0;
        overlay.addEventListener('click', function(){
            if ($scope.canvasClickCounter === 0){
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
                    $scope.showInstructionB = false;
                    $scope.waitingForOpponent = true;
                    $scope.$digest()
                    $scope.TakePicture();
                    $scope.canvasClickCounter++;
                }
            }
        });

    })();


    //State Changes
    socket.on('goHome', function(){

        console.log("Got into goHome socket on losePanel")
        $state.go('home');

    });


    /***********                            *************/
    /*********** setup of emotion detection *************/
    /***********                            *************/

    $scope.startVideo = function() {
        // start video
        vid.play();

    };



    //The MEAT AND POTATOES!!! Takes a picture and creates an object
    $scope.TakePicture = function() {

        // create object to send to opponent/determine the victor
        var image = createPicture().image;
        $scope.gameObj.loserImage = image;
        socket.emit('sendDogTag', $scope.gameObj);

        // stop video
        vid.pause();
    };

    function createPicture(){

        var imageObj = {};

        //Grab Appropriate Elements
        var video = document.getElementById('videoel');
        var thecanvas = document.getElementById('thecanvas');
        var context = thecanvas.getContext('2d');

        // draw the video contents into the canvas x, y, width, height
        context.drawImage( video, 0, 0, thecanvas.width, thecanvas.height);
        imageObj.image = thecanvas.toDataURL()
        return imageObj
    }




    //--------                    ---------//
    //-------- GET WEBCAM WORKING ---------//
    //--------                    ---------//
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





});
