
(function() {
    'use strict';
    angular.module('admin',['smart-table'])
        .controller('usersStateController', ['$scope','userService',
            function ($scope,userService) {

            }]).controller('safeCtrl', ['$scope','$state','userService' , function ($scope,$state, userService) {

                var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
                var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
                var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
                var id = 1;

                $scope.selected = false;
                var selectedList = [];
                var selectedCount = 0;
                $scope.asgnTest = function(){

                    var listToAssgn = [];
                    selectedList.forEach(function(item , ind , arr){
                        if(item){
                            var itemtemp = {};
                            itemtemp.user = JSON.stringify($scope.rowCollection[ind]);
                            itemtemp.fullName = $scope.rowCollection[ind].firstName + ' ' + $scope.rowCollection[ind].lastName + '(' + $scope.rowCollection[ind].email + ')';
                            listToAssgn.push(itemtemp);
                        }
                    })


                    $state.go('testForUsers',{ list : listToAssgn});
                }

                $scope.select = function (row){
                    if(selectedList[$scope.rowCollection.indexOf(row)]){
                        selectedCount--;
                    }else{
                        selectedCount++;
                    }

                    selectedList[$scope.rowCollection.indexOf(row)] = !selectedList[$scope.rowCollection.indexOf(row)];
                    
                    if(selectedCount > 0){
                        $scope.selected = true;
                    }else{
                        $scope.selected = false;
                    }
                }

                $scope.addNewUser = function(){
                    $state.go('newUser');
                }


                // function generateRandomItem(id) {

                //     var firstname = firstnames[Math.floor(Math.random() * 3)];
                //     var lastname = lastnames[Math.floor(Math.random() * 3)];
                //     var birthdate = dates[Math.floor(Math.random() * 3)];
                //     var balance = Math.floor(Math.random() * 2000);

                //     return {
                //         id: id,
                //         firstName: firstname,
                //         lastName: lastname,
                //         birthDate: new Date(birthdate),
                //         balance: balance
                //     }
                // }

                $scope.rowCollection = [];


                // for (id; id < 5; id++) {
                //     $scope.rowCollection.push(generateRandomItem(id));
                // }
                var users = [];
                $scope.makeTable = function(){
                    userService.getAll().then(function(data){
                        users = data;
                        data.forEach(function(item){
                            selectedList.push(false);
                            var tobj = {};
                            tobj.id = item._id;
                            tobj.firstName = item.firstName;
                            tobj.lastName = item.lastName; 
                            var bDate = new Date(item.birthDate);
                            // var mon = bDate.getMonth().toString().length ==1 ? '0'+bDate.getMonth() : bDate.getMonth();
                            var mon = (bDate.getMonth()+1).toString().length == 1 ? '0' + (bDate.getMonth()+1) : (bDate.getMonth()+1);

                                    
                            var day = bDate.getDate().toString().length ==1 ? '0'+bDate.getDate() : bDate.getDate();

                            tobj.birthDate = day + '.' + mon +'.'+ bDate.getFullYear() ;
                            var sex;
                            switch(item.sex){
                                case 'male': sex = 'Муж.';
                                    break;
                                case 'female': sex = 'Жен.';
                                    break;                                
                                default : sex = '';
                                    break;
                            }                           
                            tobj.sex = sex ;
                            tobj.email = item.email;
                            tobj.number = item.number;

                            if(item.group.length == 0){
                                tobj.group = '';
                                $scope.rowCollection.push(tobj);
                            } else{
                                item.group.forEach(function(itm){
                                    var ttobj = {};
                                     ttobj.firstName = item.firstName;
                                     ttobj.lastName = item.lastName;
                                     var bDate = new Date(item.birthDate);
                                     var mon = (bDate.getMonth()+1).toString().length == 1 ? '0' + (bDate.getMonth()+1) : (bDate.getMonth()+1);

                                     var day = bDate.getDate().toString().length == 1 ? '0' + bDate.getDate() : bDate.getDate();

                                     ttobj.birthDate = day + '.' + mon + '.' + bDate.getFullYear();
                                     var sex;
                                     switch (item.sex) {
                                         case 'male': sex = 'Муж.';
                                             break;
                                         case 'female': sex = 'Жен.';
                                             break;
                                         default: sex = '';
                                             break;
                                     }
                                     ttobj.sex = sex;
                                     ttobj.email = item.email;
                                     ttobj.number = item.number;

                                    ttobj.group = itm.name;
                                    $scope.rowCollection.push(ttobj);
                                })
                                
                            }

                            
                        });
                    });
                };
                $scope.makeTable();

                //add to the real data holder
                $scope.addRandomItem = function addRandomItem() {
                    $scope.rowCollection.push(generateRandomItem(id));
                    id++;
                };

                //remove to the real data holder
                $scope.removeItem = function removeItem(row) {
                    var index = $scope.rowCollection.indexOf(row);
                    if (index !== -1) {
                        $scope.rowCollection.splice(index, 1);
                        selectedList.splice(index, 1);
                    }
                }
            }]);
        })();
//                 $scope.rowCollection = [
//                     // { firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com' },
//                     // { firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com' },
//                     // { firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com' }
//                 ];

//                 $scope.makeTable = function(){
//                     userService.getAll().then(function(data){
//                         data.forEach(function(item){
//                             var tobj = {};
//                             tobj.firstName = item.firstName;
//                             tobj.lastName = item.lastName;                            
//                             tobj.status = item.role;
//                             tobj.email = item.email;


//                             $scope.rowCollection.push(tobj);
//                         });
//                     });
//                 };
//                 $scope.makeTable();
//                 $scope.getters = {
//                     firstName: function (value) {
//                         //this will sort by the length of the first name string
//                         return value.firstName.length;
//                     }
//                 }


//             }]).directive('csSelect', function () {
//                 return {
//                     require: '^stTable',
//                     template: '<input type="checkbox"  style="display:block !important">',
//                     scope: {
//                         row: '=csSelect'
//                     },
//                     link: function (scope, element, attr, ctrl) {

//                         element.bind('change', function (evt) {
//                             scope.$apply(function () {
//                                 ctrl.select(scope.row, 'multiple');
//                             });
//                         });

//                         scope.$watch('row.isSelected', function (newValue, oldValue) {
//                             if (newValue === true) {
//                                 element.parent().addClass('st-selected');
//                             } else {
//                                 element.parent().removeClass('st-selected');
//                             }
//                         });
//                     }
//                 };
            // });
// })();


