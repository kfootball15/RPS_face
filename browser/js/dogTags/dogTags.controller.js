app.controller('dogTagsCtrl', function($scope, $stateParams, DogTagsFactory, loggedInUser, allDogTags) {

    $scope.loggedInUser = loggedInUser
    $scope.allDogTags = allDogTags;
    console.log($scope.allDogTags)

    $scope.gameObj= $stateParams.myParam
    console.log("gameObj in dogTags", $scope.gameObj)

    //THEIR
    $scope.imageArray = []

    // for (var i = 0; i < $scope.allDogTags.length; i++) {
    //     var theirCanvas = document.getElementById('theirCanvas');
    //     var theirCtx = theirCanvas.getContext('2d');
    //     var theirImage = new Image();
    //     theirImage.src = $scope.allDogTags[i].image;
    //     theirCtx.drawImage(theirImage, 0, 0)
    // }

    // $scope.createCanvas = function(img){
    //     var theCanvas = document.getElementById('theCanvas')
    //     // var newCanvas = document.createElement('canvas')
    //     // console.log(newCanvas)

    //     // // var theirCanvas = document.getElementById('theirCanvas');
    //     var newCtx = theCanvas.getContext('2d');
    //     var newImage = new Image();
    //     newImage.src = img;
    //     var newContent = newCtx.drawImage(newImage, 0, 0)
    //     // newCanvas.appendChild(newContent)
    //     theCanvas.appendChild(newContent)
    // }




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
