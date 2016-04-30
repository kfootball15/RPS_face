app.controller('dogTagsCtrl', function($scope, $stateParams) {

    $scope.gameObj= $stateParams.myParam
    console.log("gameObj in dogTags", $scope.gameObj)

    //THEIR
    var theirCanvas = document.getElementById('theirCanvas');
    var theirCtx = theirCanvas.getContext('2d');
    var theirImage = new Image();
    theirImage.src = $scope.gameObj.loserImage;
    theirCtx.drawImage(theirImage, 0, 0)

    $scope.result = $stateParams.myParam.result




});
