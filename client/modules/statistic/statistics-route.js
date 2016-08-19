(function(){
    angular.module('statistic',[]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('statistics', {
                url: '/statistics',
                templateUrl: '/modules/statistic/statistic.html',
                controller: 'statisticController',
                role: ['admin']
            });
    }])
})();
