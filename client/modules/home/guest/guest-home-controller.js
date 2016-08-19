(function () {
    'use strict';
    
    angular.module('home')
        .controller('guestHomeController', ['$scope', '$state', 'userService', 'context', 'notification', 
            function($scope, $state, userService, context, notification) {

            $scope.disStart;
            $scope.status;
            $scope.firstName = context.getFirstName();
            $scope.lastName = context.getLastName();
            $scope.dataStart;
            $scope.dataEnd;
            $scope.close;


            $scope.updateButtons = function () {
                $scope.disStart = true;
                $scope.openNow = false;

                if ($scope.status === 'scha') {
                    $scope.disStart = false;
                    $scope.openNow = true;
                }
                else if($scope.status === 'free') {
                    $scope.disStart = true;
                }
                else if($scope.status === 'req' || $scope.status === 'stack') {
                    $scope.disStart = true;
                }
                else if ($scope.status === 'open') {
                    $scope.disStart = false;
                }
            }

            $scope.update = function() { 
                    userService.getStatus().then(function (data) {
                        $scope.status = data.status;
                        if($scope.status === 'scha' || $scope.status === 'open') {
                            $scope.dateStart = new Date(data.dateStart).toUTCString();
                            $scope.dateEnd = new Date(data.dateEnd).toUTCString();
                        }
                        $scope.updateButtons();
                });
            }

            $scope.update();
        }]
    );
})();