(function(){angular.module('directives').directive('newsDirective', ['$state', 'getStatisticsFromNews', function($state, getStatisticsFromNews) {
    return {
        restrict: 'E',
        templateUrl: 'common/directives/newsDirective-template.html',
        scope: {
            model: '='
        },
        controller: ['$scope', 'userService', function($scope, userService) {
           $scope.model.reqList().then(function(result){
                $scope.model.list = result.data;
            });
            $scope.newsButtonClick = function(){
                $state.go($scope.model.goTo);
            };
            $scope.personClick = function() {
                getStatisticsFromNews.setPersonStatistic($scope.model.typeFlag);
                $state.go('statistics');

            }
        }]
    };
}]);})();
