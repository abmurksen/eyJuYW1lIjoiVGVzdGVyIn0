(function () {
    'use strict';
    angular.module('myApp')
        .controller('headerController', ['$scope', '$state','$timeout' ,'authService', 'navigationFactory', 'context',
            function($scope, $state, $timeout, authService, navigationFactory, context) {
                $scope.logout = function () {
                    authService.logout();
                };
                
                $scope.headerMenu = navigationFactory.getNavigationMenu();
                $scope.isShowSmallNav = true;
                $scope.personalName = context.getFirstName() + ' ' + context.getLastName();
                $scope.forChoise = [];
                $scope.choosen = 0;
                $scope.menuLength = $scope.headerMenu.length + 1;
                $scope.role;

                for(var i = 0; i < $scope.menuLength; ++i) {
                    $scope.forChoise.push(false);
                }

                
                $scope.selectMenu = function (menuItem) {
                    if (menuItem.state) {
                        $scope.isShowSmallNav = false;
                        $state.go(menuItem.state);
                        setTimeout(function() {
                            $scope.isShowSmallNav = true;
                        }, 0);
                    }
                };

                $scope.timeToChange = function() {
                    $scope.role = context.getRole();
                    for(var i = 0; i < $scope.menuLength; ++i) {
                        $scope.forChoise[i] = false;
                    }
                    $scope.choosen = $state.current.name;
                    if ($scope.choosen === 'home' ||
                        $scope.choosen === 'checkTest'||
                        $scope.choosen === 'passTest') {
                        $scope.forChoise[0] = true;

                    }
                    else if($scope.choosen === 'assignStd' ||
                            $scope.choosen === 'assignTch' ||
                            $scope.choosen === 'newUser') {
                        $scope.forChoise[1] = true;

                    }
                    else if($scope.choosen === 'statistics') {
                        $scope.forChoise[2] = true;
                    }
                    else if($scope.choosen === 'addQuestion' ||
                            $scope.choosen === 'badQuestions') {
                        $scope.forChoise[3] = true;


                    }
                    else if($scope.choosen === 'editProfile' ||
                            $scope.choosen === 'checkMicrophone') {
                        $scope.forChoise[$scope.menuLength - 1] = true;
                    }
                }

                $scope.click = function() {
                    $scope.timeToChange(0);
                    $state.go('home');
                }
                $timeout($scope.timeToChange,100);

                $scope.timeToChangeA = function() {
                    $timeout($scope.timeToChange, 100);
                }

            }
        ]);
})();