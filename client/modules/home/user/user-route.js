(function(){
    angular.module('home').config(['$stateProvider', '$urlRouterProvider', 
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
            .state('passTest', {
                url: '/passTest',
                templateUrl: 'modules/home/user/passTest/passTest.html',
                controller: 'passTestController',
                role: ['user', 'guest']
            })
        }
    ])
})();