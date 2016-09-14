(function () {
    'use strict';

    angular.module('home')
        .controller('adminHomeController',['$scope', '$state', '$rootScope', 'userService', 'getStatisticsFromNews', 'adminHomeService',
            function($scope, $state, $rootScope, userService, getStatisticsFromNews, adminHomeService) {
                $state.go('usersState');
                // $scope.newsList = adminHomeService.newsList;
                // $scope.resNews = [];
                // userService.getResults().then(function(data){
                //     data.forEach(function(item, i) {
                //         $scope.resNews[i] = item;
                //         $scope.resNews[i].fullName = item.firstName + ' ' + item.lastName;
                //         $scope.resNews[i].fullTeacherName = item.teacherFirstName + ' ' + item.teacherLastName;
                //     });
                // });

                // $scope.showInfoNews = function(item) {
                //     getStatisticsFromNews.setPersonStatistic(item);
                //     $state.go('statistics');
                // };

                // $scope.redirect = function(state) {
                //     $state.go(state);
                // }

            }
        ]);
})();
