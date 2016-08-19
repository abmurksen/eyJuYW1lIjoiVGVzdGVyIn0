(function(){
    'use strict';
    angular.module('admin').controller('assignStdController', ['$scope', 'userService', '$location', 'notification', function($scope, userService, $location, notification) {
        $scope.freeStudents = [];
        $scope.copyFreeStudents = [];
        $scope.showList = [];
        $scope.disabled = true;
        $scope.disabled2 = true;
        $scope.disabled3 = true;
        var chooseUserList = [];
        $scope.currentStudent = null;
        $scope.needList = false;
        var studentForDelete;

        $scope.checkUsersList = function(value) {
            if (value == 'request') {
                $scope.currentValue = value;
                $scope.currentRequest = userService.getUsersRequests();
                $scope.currentStudent = null;
                $scope.needList = false;
                checkList($scope.currentRequest);
            } else {
                $scope.currentValue = value;
                $scope.currentRequest = userService.getFreeUsers();
                $scope.currentStudent = null;
                $scope.needList = false;
                checkList($scope.currentRequest);
            }
            clear();
            $scope.disabled = true;
        };

        function checkList (req) {
            req.then(function(data) {
                $scope.freeStudents = [];
                $scope.copyFreeStudents = [];
                data.forEach(function(item, i) {
                    $scope.freeStudents[i] = item;
                    $scope.copyFreeStudents[i] = item;
                    $scope.freeStudents[i].fullName = item.firstName + ' ' + item.lastName;
                    $scope.copyFreeStudents[i].fullName = item.firstName + ' ' + item.lastName;
                });
            });
        }

        $scope.checked = true;
        $scope.checkUsersList('request');

        function clear() {
            $scope.disabled = false;
            $scope.freeStdName = '';
            $scope.freeStdMail = '';
            $scope.freeStdTel = '';
            $scope.mytime3 = null;
            $scope.mytime4 = null;
            $scope.selectedItem4 = '';
            $scope.dt3 = null;
            $scope.dt4 = null;
        }

        var stdConstructor = function(stdId, stdData, stdData2){
            this.userId =  stdId;
            this.dateStart =  stdData;
            this.dateEnd =  stdData2;

        };

        $scope.hasChanged = function(item){
            $scope.currentStudent = item;
            $scope.freeStdName = item.fullName;
            $scope.freeStdMail = item.email;
            $scope.freeStdTel = item.number;
        };

        $scope.reset = function(){
            $scope.showList = [];
            chooseUserList = [];
            $scope.disabled = true;
            $scope.disabled2 = true;
            $scope.disabled3 = true;
            $scope.checkUsersList($scope.currentValue);

        };

        $scope.addStudent = function() {
            $scope.needList = true;
            var newStudent = new stdConstructor($scope.currentStudent._id, $scope.mytime3.getHours()*1000*60*60 + $scope.mytime3.getMinutes()*1000*60 + $scope.dt3.valueOf(),
             $scope.mytime4.getHours()*1000*60*60 + $scope.mytime4.getMinutes()*1000*60 + $scope.dt4.valueOf());

            chooseUserList.push(newStudent);
            $scope.showList.push($scope.currentStudent.fullName + ' (' + $scope.currentStudent.email + ')');

            var res;
            $scope.freeStudents.map(function( obj, i ) {
                return (obj.email == $scope.currentStudent.email) ? (res = i) : (false);
                }
            );
            $scope.freeStudents.splice(res, 1);
            $scope.disabled3 = false;
            clear();
            $scope.currentStudent = null;
        };

        $scope.clickOnName = function(name) {
            studentForDelete = name;
            $scope.disabled2 = false;
        };

        $scope.deletePerson = function() {
            var mail = studentForDelete[0].slice(studentForDelete[0].indexOf('(')+1, studentForDelete[0].indexOf(')'));
            var res;
            $scope.showList.map(function( obj, i ){
                return (obj == studentForDelete) ? (res = i) : (false);
                }
            );
            $scope.showList.splice(res, 1);
            chooseUserList.splice(res, 1);
            $scope.copyFreeStudents.map(function( obj, i ) {
                return (obj.email == mail) ? (res = obj) : (false);
                }
            );
            $scope.freeStudents.push(res);
        };

        $scope.submitStudentsList = function() {
            console.log(chooseUserList);
            userService.assignStudents(chooseUserList).then(function() {
                $scope.checkUsersList($scope.currentValue);
            });
            notification.success("You have successfully assigned test for users");
            $scope.showList = [];
            chooseUserList = [];
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



    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt3 = new Date(year, month, day);
        $scope.dt4 = new Date(year, month, day);
    };

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime3 = d;
        $scope.mytime4 = d;
    };

        $scope.$watch('dt3',function(oldVal,newVal,attr){
            if($scope.dt3 > $scope.dt4){
                $scope.dt4 = newVal;
            }
        });

        $scope.$watch('dt4',function(oldVal,newVal,attr){
            if($scope.dt3 > $scope.dt4){
                $scope.dt3 = newVal;
            }
        });


}]);})();

