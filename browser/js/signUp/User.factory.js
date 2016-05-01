app.factory('UserFactory', function($http) {

    var UserFactory = {};

    function getData(res) {
        return res.data;
    }

    UserFactory.getAllUsers = function(){
        return $http.get('/api/members/')
        .then(function(users){
            return users.data;
        });
    };

    UserFactory.signup = function(newUser) {
        return $http.post('api/members/', newUser)
        .then(getData)
        .then(function(createdUser) {
            return createdUser;
        });
    };

    UserFactory.getUser = function(userId) {
        return $http.get('api/members/' + userId)
        .then(getData)
        .then(function(user) {
            return user;
        });
    };

    UserFactory.deleteUser = function(userId) {
        return $http.delete('api/members/' + userId)
        .then(getData)
        .then(function(user) {
            return user;
        });
    };

    UserFactory.updateUser = function(userId, update){
        return $http({
            method: 'PUT',
            url: '/api/members/' + userId,
            data: update
        }).then(function(response){
            return response;
        })
    };

    return UserFactory;
});
