(function(){
    'use strict';
    angular.module('admin').controller('assignTchController', ['$scope', 'userService', 'notification', function($scope, userService, notification) {

        $scope.currentUser = null;
        $scope.currentTeacher = null;

        updateUserList();
        updateTeacherList();

        function updateTeacherList () {
            $scope.teachers = [];
            userService.getTeachers().then(function(data) {
                data.forEach(function(item, i){
                    $scope.teachers[i] = item;
                    $scope.teachers[i].fullName = item.firstName + ' ' + item.lastName;
                });
            });
        }

        function updateUserList () {
            $scope.students = [];
            userService.getFinishedUsers().then(function(data) {
                data.forEach(function(item, i) {
                    $scope.students[i] = item;
                    $scope.students[i].fullName = item.firstName + ' ' + item.lastName;
                });
            });
        }

        function clear() {
            $scope.stdName = '';
            $scope.stdMail = '';
            $scope.stdTel = '';
            $scope.tchName = '';
            $scope.tchMail = '';
            $scope.tchTel = '';
            $scope.selectedItem2 = '';
            $scope.selectedItem3 = '';
        }


        $scope.chooseTeacher = function(item) {
            $scope.tchName = item.fullName;
            $scope.tchMail = item.email;
            $scope.tchTel = item.number;
            $scope.currentTeacher = item;

        };

        $scope.chooseUser = function(item) {
            $scope.stdName = item.fullName;
            $scope.stdMail = item.email;
            $scope.stdTel = item.number;
            $scope.currentUser = item;
        };

        $scope.submitTchStd = function() {
            userService.assignTeacher($scope.currentUser._id, $scope.currentTeacher._id).then(function() {
                updateUserList();
                updateTeacherList();
            });
            notification.success("You have successfully assigned teachers on users test");
            clear();

        };

    }]);
})();