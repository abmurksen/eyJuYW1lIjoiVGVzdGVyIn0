(function() {
    'use strict';
    angular.module('admin')
        .controller('newUserController', ['$scope', 'userService', 'notification',
            function ($scope, userService, notification) {

                $scope.phnumberMd = '+375';
                $scope.dt = new Date();
                $scope.dt2 = new Date();

                $scope.newUser = function () {
                    var dateStart = $scope.mytime.getHours()*1000*60*60 + $scope.mytime.getMinutes()*1000*60 + $scope.dt.valueOf();
                    var dateEnd = $scope.mytime2.getHours()*1000*60*60 + $scope.mytime2.getMinutes()*1000*60 + $scope.dt2.valueOf();
                    userService.newUser($scope.firstMd, $scope.secondMd, $scope.emailMd, $scope.phnumberMd, dateStart, dateEnd);
                    $scope.dt = null;
                    $scope.dt2 = null;
                    $scope.mytime = null;
                    $scope.mytime2 = null;
                    $scope.firstMd = null;
                    $scope.secondMd = null;
                    $scope.emailMd = null;
                    $scope.phnumberMd = null;
                    notification.success("You have successfully added a new user");
                };

                $scope.inlineOptions = {
                    customClass: getDayClass,
                    minDate: new Date(),
                    showWeeks: true
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };


                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                    // $scope.minDate2 = $scope.minDate2 ? null : new Date();
                };

                $scope.$watch('dt',function(oldVal,newVal,attr){
                    if($scope.dt > $scope.dt2){
                        $scope.dt2 = newVal;
                    }
                });

                $scope.$watch('dt2',function(oldVal,newVal,attr){
                    if($scope.dt > $scope.dt2){
                        $scope.dt = newVal;
                    }
                });

                $scope.toggleMin();

                $scope.open1 = function () {
                    $scope.popup1.opened = true;
                };

                $scope.popup1 = {
                    opened: false
                };

                $scope.open2 = function () {
                    $scope.popup2.opened = true;
                };

                $scope.popup2 = {
                    opened: false
                };

                $scope.setDate = function (year, month, day) {
                    $scope.dt = new Date(year, month, day);
                    $scope.dt2 = new Date(year, month, day);
                };

                function getDayClass(data) {
                    var date = data.date,
                        mode = data.mode;
                    if (mode === 'day') {
                        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                        for (var i = 0; i < $scope.events.length; i++) {
                            var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                            if (dayToCheck === currentDay) {
                                return $scope.events[i].status;
                            }
                        }
                    }

                    return '';
                }


                $scope.mytime = new Date();
                $scope.mytime2 = new Date();

                $scope.hstep = 1;
                $scope.mstep = 1;

                $scope.ismeridian = true;
                $scope.toggleMode = function () {
                    $scope.ismeridian = !$scope.ismeridian;
                };

                $scope.update = function () {
                    var d = new Date();
                    d.setHours(14);
                    d.setMinutes(0);
                    $scope.mytime = d;
                    $scope.mytime2 = d;
                };

            }]);
})();