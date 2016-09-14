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
            }).state('reports', {
                url: '/admin/reports',
                templateUrl: 'modules/admin/reports/report.html',
                controller: 'reportController',
                role:['admin']
            }).state('usersState',{
                url: '/admin/usersState',
                templateUrl: 'modules/admin/usersState/users.html',
                controller: 'usersStateController',
                role:['admin']
            }).state('testForUsers',{
                url: '/admin/assignTest',                
                params: {
                    list: { array: true }
                },
                templateUrl: 'modules/admin/assignTest/tests.html',
                controller: 'assignTest',
                role:['admin']
            }).state('createNewTest',{
                url: '/admin/createTest',
                templateUrl: 'modules/admin/newTest/newTest.html',
                controller: 'newTestcontroller',
                role:['admin']
            })

    }]);
}());