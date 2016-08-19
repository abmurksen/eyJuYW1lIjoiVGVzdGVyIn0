(function(){
    angular.module('personalProfile').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('editProfile', {
                url: '/yourProfile',
                templateUrl: 'modules/profile/editProfile/editProfile.html',
                controller: 'editProfileController',
                role: ['admin', 'user', 'teacher']
            })
            .state('checkMicrophone', {
                url: '/checkMicrophone',
                templateUrl: 'modules/profile/check microphone/checkMicrophone.html',
                controller: 'checkMicrophoneController',
                role: ['admin', 'user', 'teacher']
            });
    }]);
}());
