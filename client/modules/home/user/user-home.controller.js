(function () {
    'use strict';
    
    angular.module('home')
        .controller('userHomeController', ['$scope', '$state', 'userService', 'context', 'notification', 
            function($scope, $state, userService, context, notification) {

            $scope.disStart;
            $scope.disReq;
            $scope.status;
            $scope.firstName = context.getFirstName();
            $scope.lastName = context.getLastName();
            $scope.dataStart;
            $scope.dataEnd;
            $scope.close;


            $scope.updateButtons = function () {
                $scope.disStart = true;
                $scope.disReq = true;
                $scope.openNow = false;

                if ($scope.status === 'scha') {
                    $scope.disStart = false;
                    $scope.disReq = true;
                    $scope.openNow = true;
                }
                else if($scope.status === 'free') {
                    $scope.disStart = true;
                    $scope.disReq = false;
                }
                else if($scope.status === 'req' || $scope.status === 'stack') {
                    $scope.disStart = true;
                    $scope.disReq = true;
                }
                else if ($scope.status === 'open') {
                    $scope.disStart = false;
                    $scope.disReq = true;
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
            $scope.onSendRequest = function() {
                userService.sendTestRequest().then( function() {
                    notification.success("You have successfully send request for test");
                    $scope.update();
                })
            };

            $scope.update();
        }]
    );
})();