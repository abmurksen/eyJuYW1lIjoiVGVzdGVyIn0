(function(){
    'use strict';
    angular.module('admin').controller('newTestcontroller', ['$scope', '$state', 'userService', '$location', '$stateParams', 'notification', function($scope, $state, userService, $location, $stateParams, notification) {
        
        // $stateParams.list
        // console.log($state.params.list);
        
        $scope.data = {
            model: null,
            availableOptions: [
                // { name: 'string' },
                // { name: 'integer' },
                // { name: 'boolean' },
                // { name: 'null' },
                // { name: 'object' },
                // { name: 'array' }
                // { value: 'myString', name: 'string' },
                // { value: 1, name: 'integer' },
                // { value: true, name: 'boolean' },
                // { value: null, name: 'null' },
                // { value: { prop: 'value' }, name: 'object' },
                // { value: ['a'], name: 'array' }
            ],
            availableTests: [

            ],
            selectedTests:[
                
            ]
        };

        var getTestsList = function (){
            userService.getTestsArray('').then(function(data){
                data.forEach(function(item){
                    var tmpobj = {};
                    tmpobj.name = item.name;
                    tmpobj.value = JSON.stringify(item);
                    $scope.data.availableTests.push(tmpobj);
                });
                // $scope.data.availableTests = data;
            })
        } ;

        getTestsList();

        if($stateParams.list !== undefined){
            $scope.data.availableOptions = $stateParams.list;    
        }     
        $scope.freeStudents = [];
        $scope.copyFreeStudents = [];
        
        $scope.disabled = true;
        $scope.disabled2 = true;
        $scope.disabled3 = true;
        $scope.disabledAdd = true;        
        $scope.disabledDel = true;
        var testsToAdd = [];
        var chooseUserList = [];
        var usersToDelete = [];
        $scope.currentStudent = null;
        $scope.needList = false;
        var studentForDelete;

        var testsListToDelit = [];



        var now = new Date();
        $scope.dt3= new Date(now.getFullYear(), now.getMonth(), now.getDate());
        $scope.dt4= new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
        $scope.mytime3 = now;
        var tomorrow = ((new Date()).setDate(now.getDate()+1));
        $scope.mytime4 = tomorrow;

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
        // $scope.checkUsersList('request');

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

        $scope.clickOnName = function(item) {
            // usersToDelete.push(item); 
            usersToDelete = item; 
            
        //     studentForDelete = item;
        //     var obj = JSON.parse(item[0]);
        //     $scope.freeStdName = obj.firstName + ' ' + obj.lastName;
        //     $scope.freeStdMail = obj.email;
        //     $scope.freeStdTel = obj.number;
            $scope.disabled2 = false;
        };

        $scope.clickOnTestToSelect = function(item){
            var objArr =[];
            item.forEach(function(itm){
                objArr.push(JSON.parse(itm));
            })
            testsToAdd = objArr;
            $scope.disabledAdd = false;
        }

        $scope.clickToDel = function(item){
            testsListToDelit.push(item);
            $scope.disabledDel = false;

        }

        $scope.selectTest = function(){
            $scope.data.selectedTests = testsToAdd;
        }

        $scope.deleteFromSelected = function(){
            testsListToDelit.forEach(function(id){
                $scope.data.selectedTests.forEach(function(item, ind, arr){
                    if(id == item._id){
                        arr.splice(ind, 1);
                    }
                })
            });
        }

        $scope.deletePerson = function() {

            usersToDelete.forEach(function(itm){
                $scope.data.availableOptions.forEach(function(item, ind, arr){
                    var em = JSON.parse(itm).email;
                    if(JSON.parse(item.user).email == em){
                        arr.splice(ind, 1);
                    }
                })
            });
            disabled2 = true;

            // var mail = studentForDelete[0].slice(studentForDelete[0].indexOf('(')+1, studentForDelete[0].indexOf(')'));
            // var res;
            // $scope.showList.map(function( obj, i ){
            //     return (obj == studentForDelete) ? (res = i) : (false);
            //     }
            // );
            // $scope.showList.splice(res, 1);
            // chooseUserList.splice(res, 1);
            // $scope.copyFreeStudents.map(function( obj, i ) {
            //     return (obj.email == mail) ? (res = obj) : (false);
            //     }
            // );
            // $scope.freeStudents.push(res);

        };

        $scope.submitStudentsList = function() {
            var listToSend = [];
            $scope.data.availableOptions.forEach(function(item){
                listToSend.push(JSON.parse(item.user).email);
            });
            var objToSend = {};
            objToSend.users = listToSend;
            var tests = [];
            $scope.data.selectedTests.forEach(function(item){
                tests.push({id: item._id, name: item.name });
            });
            objToSend.tests = tests;
            userService.assignNewTest(objToSend).then(function() {
                 notification.success("You have successfully assigned test for users");
            });
           
           
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

