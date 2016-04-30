app.controller('outcomePanelCtrl', function($scope, $stateParams, $state) {

    //Globals
    $scope.gameObj= $stateParams.myParam
    $scope.result = $stateParams.myParam.result
    var outcomeDiv = document.getElementById('outcomeDiv');
    var socket = io(window.location.origin);


    socket.on('goToDogTagState', function(gameObj){
        //Need to create an emitter on the server
        //Need to create an emitter in the LoserPanel for after the loser takes his/her picture
        //Winner (and only winner, who would be the only one currently in this state) should $state.go to
            //his dog tags page
        //Persist the opponents dog tag to a database
        //Loser should have a listener in the Loser Panel (could listen for the same event) and $state.go to his opponents dog tag state


        //Database post request first

        //$state.go to the dogTag state
        $state.go('dogTags', {myParam: gameObj});
        console.log("Got into goToDogTagState socket on outcomePanel", gameObj)

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
                if($scope.timerCounter < 1) {
                    $state.go('loserPanel', {myParam: $scope.gameObj});
                    return;
                }
            }, 1000);
        }
    }
});
