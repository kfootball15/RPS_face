app.controller('dogTagsCtrl', function($scope, $stateParams, DogTagsFactory, loggedInUser, allDogTags) {

    $scope.loggedInUser = loggedInUser
    $scope.allDogTags = allDogTags;
    console.log($scope.allDogTags)

    $scope.gameObj= $stateParams.myParam
    console.log("gameObj in dogTags", $scope.gameObj)

    //THEIR
    $scope.imageArray = []

    // var count = 0;
    var dogTagDiv = document.getElementById('dogTagDiv')
    for (var i = 0; i < $scope.allDogTags.length; i++) {
        var canv = document.createElement("canvas");
        canv.setAttribute('width', 400);
        canv.setAttribute('height', 300);
        canv.setAttribute('id', i);
        canv.setAttribute('class', 'dogTagClass')
        dogTagDiv.appendChild(canv);
    }

    for (var i = 0; i < $scope.allDogTags.length; i++) {

        // $scope.allDogTags[i]
        var tempCanvas = document.getElementById(i);
        console.log("tempCanvas", tempCanvas)

        // var tempCanvas = document.getElementById('tempCanvas');
        var theirCtx = tempCanvas.getContext('2d');
        var theirImage = new Image();
        theirImage.src = $scope.allDogTags[i].image
        theirCtx.drawImage(theirImage, 0, 0)
        // // var newContent =
        // // newCanvas.appendChild(newContent)
        // document.appendChild(newCtx.drawImage(newImage, 0, 0))
    }


});
