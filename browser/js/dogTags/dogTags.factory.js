app.factory('DogTagsFactory', function($http) {

    var DogTagsFactory = {};

    function getData(res) {
        return res.data;
    }

    DogTagsFactory.getAllDogTags = function(id){
        console.log("Got into Factory getAllDogTags", id)
        return $http.get('/api/dogTags/' + id)
        .then(function(dogTags){
            return dogTags.data;
        });
    };

    DogTagsFactory.newDogTag = function(newDogTag) {
        console.log("DogTag Factory: newDogTag function", newDogTag)
        return $http({
            method: 'POST',
            url: '/api/dogTags',
            data: newDogTag
        }).then(function(response){
            console.log("Got something back from newDogTag Factory:", response)
            return response.data;
        })
    };

    // DogTagsFactory.getUser = function(userId) {
    //     return $http.get('api/dogTags/' + userId)
    //     .then(getData)
    //     .then(function(user) {
    //         return user;
    //     });
    // };

    // DogTagsFactory.deleteUser = function(userId) {
    //     return $http.delete('api/dogTags/' + userId)
    //     .then(getData)
    //     .then(function(user) {
    //         return user;
    //     });
    // };

    // DogTagsFactory.updateUser = function(userId, update){
    //     return $http({
    //         method: 'PUT',
    //         url: '/api/dogTags/' + userId,
    //         data: update
    //     }).then(function(response){
    //         return response;
    //     })
    // };



    return DogTagsFactory;
});
