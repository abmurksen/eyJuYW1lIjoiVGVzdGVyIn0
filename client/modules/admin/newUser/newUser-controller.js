(function() {
    'use strict';
    angular.module('admin')
        .controller('newUserController', ['$scope', 'userService', 'notification',
            function ($scope, userService, notification) {

                $scope.sexList = [
                    { 'name': 'мужской' },
                    { 'name': 'женский' },
                ];

                $scope.statusList = [
                    { 'name': 'Администратор'},
                    { 'name': 'Преподователь'},
                    { 'name': 'Сотрудник'},
                    { 'name': 'Кандидат'}
                ];



                $scope.phnumberMd = '+375';
                // $scope.dt = new Date();
                // $scope.dt2 = new Date();

                $scope.newUser = function () {
                    var user = {};
                    user.firstName = $scope.firstMd;
                    user.lastName = $scope.secondMd;
                    user.email = $scope.emailMd;
                    user.password = 11111;
                    if($scope.bDate){
                        var arr = $scope.bDate.split('.');
                        user.birthDate = new Date(arr[2], arr[1]-1, arr[0]).getTime() ;
                    }
                    

                                        
                    user.sex = $scope.sex;
                    user.role = $scope.status;
                    user.status = "free";
                    user.number = $scope.phnumberMd;
                    var re = /\s*,\s*/;
                    if($scope.group){
                        user.group = [];
                        var arr1 = $scope.group.split(re);
                        arr1.forEach(function(item){
                            user.group.push({name: item});
                        })
                        // user.group = arr1;
                    }
                    
                    // var dateStart = $scope.mytime.getHours()*1000*60*60 + $scope.mytime.getMinutes()*1000*60 + $scope.dt.valueOf();
                    // var dateEnd = $scope.mytime2.getHours()*1000*60*60 + $scope.mytime2.getMinutes()*1000*60 + $scope.dt2.valueOf();
                    // userService.newUser($scope.firstMd, $scope.secondMd, $scope.emailMd, $scope.phnumberMd, dateStart, dateEnd);
                    userService.createUser(user);
                    $scope.dt = null;
                    $scope.dt2 = null;
                    $scope.mytime = null;
                    $scope.mytime2 = null;
                    $scope.firstMd = null;
                    $scope.secondMd = null;
                    $scope.emailMd = null;
                    $scope.phnumberMd = '+375';

                    // $scope.sex = null;
                    $scope.bDate = null;
                    // $scope.status = null;
                    $scope.group = null;
                    notification.success("новый пользователь успешно создан");
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

            }]).directive('dropdownList', function ($timeout) {
                return {
                    restrict: 'E',
                    scope: {
                        itemsList: '=',
                        datafield: '=',
                        placeholder: '@'
                    },
                    template: '<input type="text" class="form-control input-admin" ng-model="search" placeholder="{{ placeholder }}" />' +
                    '<div class="search-item-list"><ul class="list">' +
                    '<li ng-repeat="item in itemsList | filter:search" ng-click="chooseItem( item )">{{ item.name }}' +
                    // '<span class="amount">{{ item.amount }}</span>' +
                    '</li>' +
                    '</ul></div>',
                    link: function (scope, el, attr) {
                        var $listContainer = angular.element(el[0].querySelectorAll('.search-item-list')[0]);
                        el.find('input').bind('focus', function () {
                            $listContainer.addClass('show');
                        });
                        el.find('input').bind('blur', function () {
                            /*
                               * 'blur' реагирует быстрее чем ng-click,
                               * поэтому без $timeout chooseItem не успеет поймать item до того, как лист исчезнет
                               */
                            $timeout(function () { $listContainer.removeClass('show') }, 200);
                        });

                        scope.chooseItem = function (item) {
                            scope.search = item.name;
                            switch(item.name){
                                case 'мужской': scope.datafield = 'male'//scope.sex = 'mail'
                                    break;
                                case 'женский': scope.datafield ='female'//scope.sex = 'femail'
                                    break;
                                case 'Администратор': scope.datafield ='admin'//scope.status = 'admin'
                                    break;
                                case 'Преподователь': scope.datafield ='преподователь'//scope.status = 'преподователь'
                                    break;
                                case 'Сотрудник': scope.datafield ='user'//scope.status = 'user'
                                    break;
                                case 'Кандидат': scope.datafield ='guest'//scope.status = 'guest'
                                    break;

                            }
                            $listContainer.removeClass('show');
                        }
                    }
                }
            }
        );
})();

