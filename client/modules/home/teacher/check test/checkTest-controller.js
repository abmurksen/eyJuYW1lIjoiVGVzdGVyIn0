(function () {
	'use strict';

	angular.module('home').controller('checkTestController', ['$scope', '$state','userService','angularPlayer','$rootScope','$timeout','notification',
		 function($scope, $state, userService, angularPlayer, $rootScope, $timeout, notification) {

		$scope.$on('$stateChangeStart', function () {
			if (angularPlayer.isPlayingStatus() === true ) {
				$timeout( function() {angularPlayer.pause();});
			}
		});

		if($rootScope.checking === true) {
			$rootScope.checking = false;
			var a = {id: $rootScope.idTest};
			userService.getOneTest(a)
				.then( function(data) {
					$scope.allQuestions = data.questions;
					$scope.initFirst();
				})
		}
		else {
			$state.go('home');
		}

		var startUrl = 'modules/home/teacher/check test/templateTests/templateTest';

		$scope.urls = {
				'questionWithoutChoiceOfAnswers': startUrl + '1.html',
				'essay': startUrl + '2.html',
				'listeningWithoutChoiceOfAnswers': startUrl + '3.html',
				'speaking': startUrl + '4.html'
			};

		/*$scope.allQuestions = [
			{
				qId: '',
				type: 'questionWithoutChoiceOfAnswers',
				question: 'Mimimi nyanyanya. What you choose?',
				answer: 'hz. but I was try.',

			},
			{
				qId: '',
				type: 'essay',
				question: 'Which colors do you like?',
				answer: 'Blue..  dark like sea, deep like sky.I love magic colors of natural stones, beauty wild flowers.',
			},
			{
				qId: '',
				type: 'listeningWithoutChoiceOfAnswers',
				question: 'assets/audio/papa_roach_-_last_resort(zaycev.net).mp3',
				answer: 'CUT MY LIFE IN TO PEASES, THIS IS MY LAST RESORT.. oh yeahh, last resort.',
			},
			{
				qId: '',
				type: 'speaking',
				question: 'Vladimerski central - ?',
				answer: 'assets/audio/vcvc.mp3',
			}
		];*/

		$scope.allQuestions = [];
		$scope.currentPage = 1;
		$scope.copyCurrentPage = 1;
		$scope.forValidMark = [];
		$scope.dirty = []
		$scope.finalMarks = [];
		$scope.omg = {
			tempMark:''
		};
		$scope.focus = true;
		angularPlayer.init();
		$scope.forSong = [];

		$scope.initFirst = function() {
			$scope.totalCount = $scope.allQuestions.length;
			for (var i = 0; i < $scope.totalCount; ++i) {
				var temp = {
					qId: $scope.allQuestions[i].qId,
					mark: ''
				};
				$scope.finalMarks.push(temp);
				$scope.forValidMark.push(false);
				$scope.dirty.push(false);
				$scope.forSong.push({});
				if($scope.allQuestions[i].type === 'listeningWithoutChoiceOfAnswers') {
					$scope.forSong[i] = {
				    	id: i,
				    	artist: '',
				    	url: $scope.allQuestions[i].question
				    }
				}
				else if ($scope.allQuestions[i].type === 'speaking' ) {
					 $scope.forSong[i] = {
				    	id: i,
				    	artist: '',
				    	url: $scope.allQuestions[i].answer
				    }
				}
				$scope.initNewPage($scope.currentPage);
			}
		}

		$scope.initNewPage = function (currentPage) {
			$scope.omg.tempMark = $scope.finalMarks[currentPage - 1].mark;
			$scope.currentPage = currentPage;

		};

		$scope.savePrevPage = function(prevNumPage) {
			$scope.dirty[prevNumPage - 1] = true;
			$scope.finalMarks[prevNumPage - 1].mark = $scope.omg.tempMark;
			$scope.omg.tempMark = '';

		};

		$scope.pageChanged = function(prevNumPage, currentPage) {
    		$scope.savePrevPage(prevNumPage);
    		if (angularPlayer.isPlayingStatus() === true ) {
				$timeout( function() {angularPlayer.pause();});
			}
			$scope.initNewPage(currentPage);
    		$scope.copyCurrentPage = $scope.currentPage;
  		};

  		$scope.setNumPage = function(numPage) {
			$scope.dirty[$scope.copyCurrentPage - 1] = true;
			$scope.pageChanged($scope.copyCurrentPage, numPage);
		};

		$scope.onlineWriteValid = function(currentPage) {
			$scope.forValidMark[currentPage - 1] = $scope.validMark(100);
		}

		$scope.validMark = function (scale) {
			var tempIntMark = parseInt($scope.omg.tempMark, 10);
			var temptempMark = tempIntMark+'';
			if (temptempMark !== $scope.omg.tempMark) {
				return false;
			}
			return tempIntMark !== NaN && tempIntMark >=0 && tempIntMark <=scale;
		}
		$scope.validAll = function() {
			for(var i = 0; i < $scope.totalCount; ++i) {
				if($scope.forValidMark[i] === false) {
					return false;
				}
			}
			return true;
		}

		$scope.isPlayingMy = false;
        $scope.startPlay = function() {
        	$scope.isPlayingMy = true;
        }

		$scope.finishCheck = function(num) {
			$scope.validNeededNumPage = true;
    		$scope.savePrevPage(num);
			var rez = {
				tid: $rootScope.idTest,
				finalMarks: $scope.finalMarks
			}
			userService.finishCheck(rez)
			.then( function() {
				$state.go('home');
  				notification.success("You have successfully completed check test.");
			})
		}

	}]);

	angular.module('home').directive('focus',
	function($timeout) {
		return {
			scope : {
				trigger : '@focus'
			},
			link : function(scope, element) {
				scope.$watch('trigger', function(value) {
					if (value === "true") {
						$timeout(function() {
							element[0].focus();
						});
					}
				});
			}
		};
	}
); 
})();