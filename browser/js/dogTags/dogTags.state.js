app.config(function ($stateProvider) {
    $stateProvider.state('dogTags', {
        url: '/dogTags/:id',
        params: {
            myParam: null
        },
        controller: 'dogTagsCtrl',
        templateUrl: '/js/dogTags/dogTags.html',
        resolve: {
            loggedInUser: function(AuthService){
                return AuthService.getLoggedInUser();
            },
            allDogTags: function(DogTagsFactory, $stateParams){
                console.log("started the resolve")
                return DogTagsFactory.getAllDogTags($stateParams.id)
                // .then(function(dogTags){
                //     console.log("Dog Tag State getAllDogTags", dogTags)
                // })
            }
        },
    });
});
