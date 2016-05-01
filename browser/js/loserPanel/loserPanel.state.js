app.config(function ($stateProvider) {
    $stateProvider.state('loserPanel', {
        url: '/loserPanel',
        params: {
            myParam: null
        },
        controller: 'loserPanelCtrl',
        templateUrl: '/js/loserPanel/loserPanel.html',
        resolve: {
            loggedInUser: function(AuthService){
                return AuthService.getLoggedInUser();
            }
        },
    });
});
