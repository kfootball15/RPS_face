app.controller('outcomePanelCtrl', function($scope, $stateParams) {

    $scope.gameObj= $stateParams.myParam

    $scope.result = $stateParams.myParam.result

    var outcomeDiv = document.getElementById('outcomeDiv');

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



});
