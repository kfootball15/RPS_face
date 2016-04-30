app.config(function ($stateProvider) {
    $stateProvider.state('dogTags', {
        url: '/dogTags',
        params: {
            myParam: null
        },
        controller: 'dogTagsCtrl',
        templateUrl: '/js/dogTags/dogTags.html',
    });
});
