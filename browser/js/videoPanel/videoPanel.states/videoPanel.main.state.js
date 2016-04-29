app.config(function ($stateProvider) {
    $stateProvider.state('videoPanel', {
        url: '/videoPanel',
        controller: 'videoPanelCtrl',
        templateUrl: '/js/videoPanel/videoPanel.templates/videoPanel.main.template.html',

        // templateUrl: '/js/videoPanel/videoPanel.templates/videoPanel.main.state.html',
        // resolve: {
        //     allOrders: function(AdminOrderFactory){
        //         return AdminOrderFactory.getAllOrders();
        //     },
        //     isAdminUser: function(AuthService, $state){
        //         AuthService.getLoggedInUser()
        //         .then(function(user){
        //             if(!user.isAdmin) $state.go('home');
        //         });
        //     }
        // }
    });
});
