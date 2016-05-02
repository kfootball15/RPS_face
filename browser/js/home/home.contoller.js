app.controller('HomeCtrl', function($scope) {

  $scope.name = "Jeff"

  var socket = io(window.location.origin);
  socket.emit('disconnect')



});
