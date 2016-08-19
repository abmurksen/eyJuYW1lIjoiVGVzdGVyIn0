(function () {
	'use strict';
	angular.module('tests')
		.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    		//$urlRouterProvider.otherwise('/tests');

			$stateProvider
        		.state('addQuestion', {
            		url: '/tests/addQuestion',
            		templateUrl: 'modules/tests/addQuestion/addQuestion.html',
            		controller: 'addQuestionController',
					role:['admin']
        		})
                .state('badQuestions', {
                    url: '/tests/badQuestions',
                    templateUrl: 'modules/tests/badQuestion/badQuestion.html',
                    controller: 'badQuestionController',
                    role: ['admin']
            })
		}])
})();