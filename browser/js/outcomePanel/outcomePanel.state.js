app.config(function ($stateProvider) {
    $stateProvider.state('outcomePanel', {
        url: '/outcomePanel',
        params: {
            myParam: null
        },
        controller: 'outcomePanelCtrl',
        templateUrl: '/js/outcomePanel/outcomePanel.html',
    });
});
