(function(){
    'use strict';
    angular.module('personalProfile')
        .controller('editProfileController',['$scope', 'userService', 'notification',
            function($scope, userService, notification){

                $scope.userProfile = {};
                $scope.disable2 = true;

                userService.getProfileStatistics().then(
                    function(data) {
                        $scope.userProfile.name = data.firstName + ' ' + data.lastName;
                        $scope.userProfile.email = data.email;
                        $scope.userProfile.telNumber = data.number;
                        $scope.userProfile.totalTests = data.totalTests;
                        $scope.userProfile.assignTests = data.assignTest;
                        $scope.results = data.results;
                        $scope.role = data.role;
                        if(data.results) {
                            $scope.testData = data.results.map(function(item) {
                                var buf = new Date(item.date);
                                return (buf.getDate() + '.' + buf.getMonth() + '.' + buf.getFullYear());
                            });
                            $scope.myData = data.results.map(function(item, i) {
                                return item.result.totalMark;
                            })
                        }
                    }
                );


                $scope.onScndInput = function() {
                    $scope.disable2 = false;
                };

                $scope.changeMail = function() {
                    $scope.userProfile.email = $scope.mail;
                };

                $scope.changeTelNumber = function() {
                    $scope.userProfile.telNumber = $scope.telNbr;
                };

                $scope.save = function() {
                    $scope.disable2 = true;
                    notification.success("You have successfully changed phone number");
                    userService.editProfile($scope.userProfile.telNumber);
                };

                $scope.change = function() {
                    $scope.disable2 = true;
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
                    }
                ]

                $scope.color = 'red';

    }]);


    angular.module('myApp').directive('barsChart', function ($parse) {
        //explicitly creating a directive definition variable
        //this may look verbose but is good for clarification purposes
        //in real life you'd want to simply return the object {...}
        var directiveDefinitionObject = {
            //We restrict its use to an element
            //as usually  <bars-chart> is semantically
            //more understandable
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            //our data source would be an array
            //passed thru chart-data attribute
            scope: {data: '=chartData'},
            link: function (scope, element, attrs) {
                //in D3, any selection[0] contains the group
                //selection[0][0] is the DOM node
                //but we won't need that this time
                var chart = d3.select(element[0]);
                //to our original directive markup bars-chart
                //we add a div with out chart stling and bind each
                //data entry to the chart
                chart.append("div").attr("class", "chart")
                    .selectAll('div')

                    .data(scope.data).enter().append("div")
                    .transition().ease("elastic")
                    .style("width", function(d) {return d + "%"; })
                    .style("min-width", "55px")
                    .style("height", "25px")
                    .style("padding", "5px")
                    .style("data-title", '25.07.2016')
                    .text(function(d) { return d + "%"; });
                //a little of magic: setting it's width based
                //on the data value (d)
                //and text all with a smooth transition
            }
        };
        return directiveDefinitionObject;
    });
})();
