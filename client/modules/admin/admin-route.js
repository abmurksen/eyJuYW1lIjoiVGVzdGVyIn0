(function(){
    angular.module('admin').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('assignStd', {
                url: '/admin/assignStd',
                templateUrl: 'modules/admin/assignStd/assignStd.html',
                controller: 'assignStdController',
                role:['admin']
            })
            .state('assignTch', {
                url: '/admin/assignTch',
                templateUrl: 'modules/admin/assignTch/assignTch.html',
                controller: 'assignTchController',
                role:['admin']
            })
            .state('newUser', {
                url: '/admin/newUser',
                templateUrl: 'modules/admin/newUser/newUser.html',
                controller: 'newUserController',
                role:['admin']
            })
    }])
}());