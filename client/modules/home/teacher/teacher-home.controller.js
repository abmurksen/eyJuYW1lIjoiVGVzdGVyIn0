(function () {
    'use strict';

    angular.module('home')
        .controller('teacherHomeController', ['$scope', 'userService', '$rootScope',
            function($scope, userService, $rootScope) {

                $scope.list = [];
                $scope.date = [];
                $rootScope.checking = false;
                $scope.length;

                userService.getTestsList()
                    .then ( function(data) {
                        $scope.list = data;
                        $scope.length = data.length;
                        for (var i = 0; i < data.length; ++i) {
                            $scope.date[i] = new Date($scope.list[i].date).toDateString();
                        }
                    })
                $scope.startCheck = function(num) {
                    $rootScope.checking = true;
                    $rootScope.idTest = $scope.list[num]._id;
                }             

            }]);
})();
