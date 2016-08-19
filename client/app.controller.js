(function () {
    angular.module('myApp')
        .controller('appController', ['$scope', 'context', '$location',
            function ($scope, context, $location) {
                $scope.isLoginPage = function () {
                    return $location.$$url === '/login';
                };
                
                $scope.isAdmin = function () {
                    return context.getRole() === 'admin';
                };
                
                $scope.isUser = function () {
                    return context.getRole() === 'user';
                };
                
                $scope.isTeacher = function () {
                    return context.getRole() === 'teacher';
                };
                
                $scope.isGuest = function () {
                    return context.getRole() === 'guest';
                };
                $scope.setUserName = function(name) {
                    $scope.userName = name;
                }
            }
        ]);
})();