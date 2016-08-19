(function () {
    'use strict';

    angular.module('login', [])
        .controller('loginController', ['$scope', '$state', 'userService',
            function($scope, $state, userService) {
                $scope.isNonValidCreds = false;
                $scope.user = $scope.user || [];
                $scope.login = function () {
                    userService.login($scope.user.name, $scope.user.password).then(function (result) {
                        if (result) {
                            $state.go('home');
                            $scope.isNonValidCreds = false;
                            //todo: redirect to necessary page
                        } else {
                            $scope.isNonValidCreds = true;
                        }
                    });
                };
            }
        ]);
})();