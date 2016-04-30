app.controller('outcomePanelCtrl', function($scope, $stateParams) {

    $scope.gameObj= $stateParams.myParam

    var thecanvas = document.getElementById('thecanvas');
    var context = thecanvas.getContext('2d');
    var testImage = new testImage();
    testImage.src = $scope.gameObj.image

    console.log($scope.gameObj.image)
    context.drawImage(testImage, 0, 0)

});
