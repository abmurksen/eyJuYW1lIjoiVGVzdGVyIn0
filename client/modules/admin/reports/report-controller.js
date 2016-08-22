(function() {
    'use strict';
    angular.module('admin')
        .controller('reportController', ['$scope','userService',
            function ($scope,userService) {
                $scope.rowCollection = [
                    // { firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com' },
                    // { firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com' },
                    // { firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com' }
                ];

                $scope.makeTable = function(){
                    userService.getReport().then(function(data){
                        data.forEach(function(item){
                            var tobj = {};
                            tobj.firstName = item.firstName;
                            tobj.lastName = item.lastName;
                            tobj.mark = item.result.autoMark + '('+item.result.totalMark+'%)';
                            tobj.status = item.result.totalMark <= 50 ? 'не пройдено': 'пройдено';
                            tobj.date = new Date(item.date);
                            tobj.email = item.email;


                            $scope.rowCollection.push(tobj);
                        });
                    });
                };
                $scope.makeTable();


            }]);
})();