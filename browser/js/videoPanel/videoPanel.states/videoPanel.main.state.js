app.config(function ($stateProvider) {
    $stateProvider.state('videoPanel', {
        url: '/videoPanel',
        controller: 'videoPanelCtrl',
        templateUrl: '/js/videoPanel/videoPanel.templates/videoPanel.main.template.html',
        resolve: {
            loggedInUser: function(AuthService){
                return AuthService.getLoggedInUser();
            }
        }
    });
});
