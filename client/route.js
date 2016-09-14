(function () {
    'use strict';

    angular.module('myApp').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'common/login/login.html',
                    controller: 'loginController',
                    noAuth: true
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'modules/home/home.html',
                    controller: 'homeController',
                    role: [ 'admin','user', 'teacher', 'guest']//
                });
            $urlRouterProvider.otherwise('/home');

            // use the HTML5 History API
            $locationProvider.html5Mode(true);
        }
    ])
})();