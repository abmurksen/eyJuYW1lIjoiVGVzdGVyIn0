(function () {
    'use strict';

    angular.module('statistic').controller('statisticController', ['$scope', '$state', '$rootScope', 'userService', 'getStatisticsFromNews', function($scope, $state, $rootScope, userService, getStatisticsFromNews) {

        $scope.searchList = [];
        $scope.showUInfo = false;
        $scope.checked4 = true;

        $scope.objFlags = {
            name: "",
            res: false,
            req: false,
            finish: false
        };
        $scope.showSearchList = function(value) {
            $scope.showUInfo = false;
            $scope.searching = '';
            $scope.objFlags.name = '';
            switch (value) {
                case 'userReq':
                    $scope.objFlags.req = true;
                    $scope.objFlags.res = false;
                    $scope.objFlags.finish = false;
                    break;
                case 'teacherReq':
                    $scope.objFlags.finish = true;
                    $scope.objFlags.res = false;
                    $scope.objFlags.req = false;
                    break;
                case 'finishTest':
                    $scope.objFlags.res = true;
                    $scope.objFlags.req = false;
                    $scope.objFlags.finish = false;
                    break;
                case 'free':
                    $scope.objFlags.res = false;
                    $scope.objFlags.req = false;
                    $scope.objFlags.finish = false;
                    break;
            }
            showPersonList($scope.objFlags);
        };

            $scope.myData = [];

        function showPersonList(obj) {
            $scope.searchList = [];
            userService.searchUser(obj).then(function(data) {
                data.forEach(function(item, i) {
                    $scope.searchList[i] = item;
                    $scope.searchList[i].fullName = item.firstName + ' ' + item.lastName;
                });
            }).then (function() {
                getStatisticsFromNews.setPersonStatistic();
            })
        }

        if(getStatisticsFromNews.getPersonStatistic() != undefined ) {
            $scope.checked4 = false;
            var resFlag = getStatisticsFromNews.getPersonStatistic();
            switch(resFlag) {
                case 'res':
                    $scope.objFlags.res = true;
                    $scope.checked3 = true;
                    break;
                case 'req':
                    $scope.objFlags.req = true;
                    $scope.checked1 = true;
                    break;
                case 'finish':
                    $scope.objFlags.finish = true;
                    $scope.checked2 = true;
                    break;
            }
            showPersonList($scope.objFlags);
        }

        $scope.searchUser = function() {
            $scope.showUInfo = false;
            $scope.objFlags.name = $scope.searching;
            showPersonList($scope.objFlags);
        };

        $scope.showInfo = function(item) {
           $scope.showUInfo = true;
            $scope.loaded = false;
           userService.showInfoProfile(item._id).then(function(data) {
               if(data.results) {
                   $scope.myData = data.results.map(function (item, i) {
                       return item.result.totalMark;
                   });
                   $scope.testData = data.results.map(function(item) {
                       var buf = new Date(item.date);
                       return (buf.getDate() + '.' + buf.getMonth() + '.' + buf.getFullYear());
                   });
               }
               $scope.loaded = true;
               $scope.choosenUser = data;
               $scope.choosenUser.fullName = data.firstName + ' ' + data.lastName;
               $scope.choosenUser.role = data.role;
               $scope.choosenUser.status = data.status;
               $scope.choosenUser.mail = data.email;
               $scope.choosenUser.tel = data.number;
               $scope.choosenUser.assignTest = data.assignTest;
               $scope.choosenUser.totalTests = data.totalTests;
           })
        };

        $scope.levels = [
            {
                name: 'Begginer',
            },
            {
                name: 'Pre-Intermediate',
            },
            {
                name: 'Intermediate',
            },
            {
                name: 'Upper-Intermediate',
            },
            {
                name: 'Advance',
            },
            {
                name: 'Date: ',
            },
        ]
    }]);
})();