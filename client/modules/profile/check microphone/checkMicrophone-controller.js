(function(){
    'use strict';
    angular.module('myApp')
        .controller('checkMicrophoneController',['$scope', 'userService', 'notification', 'recorderService','context','angularPlayer',
            function($scope, userService, notification, recorderService, context, angularPlayer){

                //$scope.role = context.getRole();
                angularPlayer.init();
                $scope.forSong = {
                    id: 'check',
                    artist: '',
                    url: 'assets/audio/Three Days Grace - Animal I Have Become.mp3'
                }
                $scope.isPlayingMy = false;
                $scope.startPlay = function() {
                    $scope.isPlayingMy = true;
                }
                /*ng-class="{'btn-admin': role === 'admin',
                                'btn-user': role === 'user',
                                'btn-teacher': role ==='teacher',
                                'btn-guest': role === 'guest'}"*/
                
    }]);


})();
