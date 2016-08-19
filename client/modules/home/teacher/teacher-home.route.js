(function(){
    angular.module('home').config(['$stateProvider', '$urlRouterProvider', 
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
            .state('checkTest', {
                url: '/checkTest',
                templateUrl: 'modules/home/teacher/check test/checkTest.html',
                controller: 'checkTestController',
                role: ['teacher']
            })
        }
    ])
})();