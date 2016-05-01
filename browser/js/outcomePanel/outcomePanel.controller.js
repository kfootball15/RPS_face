app.controller('outcomePanelCtrl', function($scope, $stateParams, $state, DogTagsFactory) {

    //Globals
    $scope.gameObj= $stateParams.myParam
    console.log("outcomePanel Ctrl", $scope.gameObj);
    $scope.result = $stateParams.myParam.result;
    $scope.firstTimeLoser = true;
    var outcomeDiv = document.getElementById('outcomeDiv');
    var socket = io(window.location.origin);


    socket.on('goToDogTagState', function(gameObj){

        console.log("goToDogTagState socket function: pre Create", $scope.result)

        if ($scope.result === 'winner'){
            DogTagsFactory.newDogTag({
                image: gameObj.dogTagImage,
                user: gameObj.myInfo.id,
                prompt: gameObj.prompt
            })
            .then(function(){
                console.log("Got into goToDogTagState socket on outcomePanel", gameObj)
                $state.go('dogTags', {id: gameObj.myInfo.id});
                // $state.go('dogTags', {myParam: gameObj});
            })
        }

    });

    //THEIR
    var theirCanvas = document.getElementById('theirCanvas');
    var theirCtx = theirCanvas.getContext('2d');
    var theirImage = new Image();
    theirImage.src = $scope.gameObj.theirInfo.image;
    theirCtx.drawImage(theirImage, 0, 0)

    //ME
    var myCanvas = document.getElementById('myCanvas');
    var myCtx = myCanvas.getContext('2d');
    var myImage = new Image();
    myImage.src = $scope.gameObj.image

    myCtx.drawImage(myImage, 0, 0)


    //Timer
    $scope.timerCounter = 10;

    if ($scope.gameObj.result === "loser" ) {
        if ($scope.timerCounter > -1) {
            setInterval(function(){
                $scope.timerCounter--
                $scope.$digest();
                if($scope.timerCounter < 1 && $scope.firstTimeLoser) {
                    $scope.timerCounter = 10
                    $scope.firstTimeLoser = false
                    $state.go('loserPanel', {myParam: $scope.gameObj});
                    return;
                }
            }, 1000);
        }
    }
});
