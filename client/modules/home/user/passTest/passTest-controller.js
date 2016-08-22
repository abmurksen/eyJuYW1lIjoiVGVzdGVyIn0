(function () {
	'use strict';

	angular.module('home').controller('passTestController', ['$scope', '$state','userService', 'angularPlayer','notification', '$timeout', 'recorderService',
		 function($scope, $state, userService, angularPlayer, notification, $timeout, recorderService) {

		$scope.$on('$stateChangeStart', function () {
			if (angularPlayer.isPlayingStatus() === true ) {
				$timeout( function() {angularPlayer.pause();});
			}
		});

		userService.getStatus().then ( function(result) {
			if(result.status !== 'scha') {
				$state.go('home');
				notification.error("You can't pass test now");
			}
		})

		/*$scope.allQuestions = [
			{
				qId: '',
				type: 'oneOfMany',
				question: 'Mimimi nyanyanya. What you choose?',
				options: [
					'Mimimi',
					'Nyanyanya',
					'No, I am normal man'
				]
			},
			{
				qId: '',
				type: 'manyOfMany',
				question: 'Which colors do you like?',
				options: [
					'The red',
					'Cian',
					'Yellow, mmm'
				]
			},
			{
				qId: '',
				type: 'questionWithoutChoiceOfAnswers',
				question: 'Which colors do you like?',
			},
			{
				qId: '',
				type: 'listeningWithOneOfMany',
				question: 'assets/audio/papa_roach_-_last_resort(zaycev.net).mp3',
				options: [
					'Behind blue eyes',
					'Last resort',
					'Riot'
				]
			},
			{
				qId: '',
				type: 'listeningWithManyOfMany',
				question: 'assets/audio/Three Days Grace - Animal I Have Become.mp3',
				options: [
					'One-X',
					'Life starts now',
					'TDG'
				]
			},
			{
				qId: '',
				type: 'speaking',
				question: 'aga'
			},
		];*/

		$scope.whichPart = 1;

		$scope.initVars = function() { 
			$scope.allQuestions = null;
			$scope.currentPage = 1;
			$scope.copyCurrentPage = 1;
			$scope.userAnswers = [];
			$scope.validAnswers = [];
			$scope.dirty = [];
			$scope.totalCount = null;
			$scope.forSong = [];
			$scope.omg = {
				tempChoise: null
			};
			$scope.success = '';
		}
		$scope.initTimer = function() {
			$scope.timer = 1000*60*60*2;
			$scope.timerHours = Math.floor($scope.timer/1000/60/60);
			$scope.timerMin = Math.floor($scope.timer/1000/60) - $scope.timerHours*60;
			$scope.timerSec = Math.floor($scope.timer/1000) - $scope.timerMin*60 - $scope.timerHours*60*60;
		}();

		function testTimer(){
			$scope.timer -= 1000;
			if($scope.timer === 1000*60*60) {
				notification.info("1 hour to finish");
			}
			else if($scope.timer === 1000*60*30) {
				notification.info("30 minutes to finish");
			}
			else if($scope.timer === 1000*60*5) {
				notification.warning("5 minutes to finish");
			}
		    if ($scope.timer === 0){
		    	//something
		    	if($scope.whichPart === 1) {
		    		$state.go('home');
		    		notification.error("You don't have time to finish first part.");
		    	}
		    	else if($scope.whichPart === 2) {
		    		$scope.sendSecondPart($scope.currentPage, false);
		    	}
		    } 
		    else {
		    	$scope.timerHours = Math.floor($scope.timer/1000/60/60);
				$scope.timerMin = Math.floor($scope.timer/1000/60) - $scope.timerHours*60;
				$scope.timerSec = Math.floor($scope.timer/1000) - $scope.timerMin*60 - $scope.timerHours*60*60;
		        $timeout(testTimer,1000);
		    }
		}
		$timeout(testTimer,1000);

		var isCheckboxType = function(type) {
			return type === 'manyOfMany' || type === 'listeningWithManyOfMany';
		};
		var isRadioType = function(type) {
			return type === 'oneOfMany' || 	type === 'listeningWithOneOfMany';
		};

		var isTextType = function(type) {
			return type === 'questionWithoutChoiceOfAnswers' || type === 'essay' || type === 'listeningWithoutChoiceOfAnswers';	
		};
		var isAudioType = function(type) {
			return type === 'speaking';
		}

		$scope.initNewPage = function(currentPage) {
			if (isCheckboxType($scope.allQuestions[currentPage - 1].type)) {
		 		$scope.omg.tempChoise = [];
			 	for (var i = 0; i < $scope.allQuestions[currentPage - 1].options.length; ++i) {
	    			$scope.omg.tempChoise.push(false);
	    		}
	    		for (var i = 0; i < $scope.userAnswers[currentPage - 1].answer.length; ++i) {
	    			$scope.omg.tempChoise[$scope.userAnswers[currentPage - 1].answer[i]] = true;
	    		}
	    	}
	    	else if (isRadioType($scope.allQuestions[currentPage - 1].type)) {
	    		if($scope.userAnswers[currentPage - 1].answer[0] !== null) {
	    			$scope.omg.tempChoise = $scope.userAnswers[currentPage - 1].answer[0];
	    		}
	    		else {
	    			$scope.omg.tempChoise = -1;
	    		}
	    	}
    		else {
    			$scope.omg.tempChoise = $scope.userAnswers[currentPage - 1].answer[0];
    		}
    		$scope.currentPage = currentPage;

		};

		$scope.initAll = function(result) {
			$scope.allQuestions = result;
			$scope.totalCount = $scope.allQuestions.length;

			for (var i = 0; i < $scope.totalCount; i++) {
				var tempAnswer = {
					qId: '',
					answer: [],
					badForUser: false
				};
				tempAnswer.qId = $scope.allQuestions[i]._id;
				tempAnswer.type = $scope.allQuestions[i].type;
				$scope.userAnswers.push(tempAnswer);
				$scope.validAnswers.push(false);
				$scope.dirty.push(false);
				$scope.forSong.push({});
				if ($scope.allQuestions[i].type === 'listeningWithoutChoiceOfAnswers' || 
					$scope.allQuestions[i].type === 'listeningWithManyOfMany' ||
					$scope.allQuestions[i].type === 'listeningWithOneOfMany' ) {
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

		$scope.initVars();

		userService.getTestDemo().then( function(result) {
			$scope.initAll(result);
	 	});

		var startUrl = 'modules/home/user/passTest/templateTests/templateTest';

		$scope.urls = {
				'oneOfMany': startUrl + '1.html',
				'manyOfMany': startUrl + '2.html',
				'questionWithoutChoiceOfAnswers': startUrl + '3.html',
				'essay': startUrl + '4.html',
				'listeningWithOneOfMany': startUrl + '5.html',
				'listeningWithManyOfMany': startUrl + '6.html',
				'listeningWithoutChoiceOfAnswers': startUrl + '7.html',
				'speaking': startUrl + '8.html'
			};

		$scope.savePrevPage = function(prevNumPage) {
			$scope.dirty[prevNumPage - 1] = true;
			if (isCheckboxType($scope.allQuestions[prevNumPage - 1].type)) {
		 		$scope.userAnswers[prevNumPage - 1].answer = [];
			 	for (var i = 0; i < $scope.omg.tempChoise.length; ++i) {
			 		if ($scope.omg.tempChoise[i]) {
	    				$scope.userAnswers[prevNumPage - 1].answer.push(i);
	    			}
	    		}
		 	}
		 	else if (isRadioType($scope.allQuestions[prevNumPage - 1].type)) {
		 		$scope.userAnswers[prevNumPage - 1].answer = [];
		 		$scope.userAnswers[prevNumPage - 1].answer.push($scope.omg.tempChoise);	
		 	}
		 	else if (isTextType($scope.allQuestions[prevNumPage - 1].type)) {
		 		$scope.userAnswers[prevNumPage - 1].answer[0] = $scope.omg.tempChoise;
		 	}
		 	else {
		 		$scope.userAnswers[prevNumPage - 1].answer[0] = $scope.omg.tempChoise;
		 	}			
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

		$scope.song = {
    			id: 'one',
    			artist: 'Drake',
    			url: 'assets/audio/Three Days Grace - Animal I Have Become.mp3'

		};

  		$scope.changeValidC = function(currentPage) {
  			for(var i = 0; i < $scope.totalCount; ++i) {
  				if( $scope.omg.tempChoise[i] === true) {
  					$scope.validAnswers[currentPage - 1] = true;
  					return;
  				}
  			}
  			$scope.validAnswers[currentPage - 1] = false;
  		};

  		$scope.changeValidRT = function(currentPage) {
  			if ($scope.omg.tempChoise !== '') {
  				$scope.validAnswers[currentPage - 1] = true;
  			}
  			else {
  				$scope.validAnswers[currentPage - 1] = false;
  			}
  		};
  		$scope.allValidAnswers = function () {
  			for(var i = 0; i < $scope.totalCount; ++i) {
  				if($scope.validAnswers[i] === false){
  					return false;
  				}
  			}
  			return true;
  		};

  		$scope.addBadForUser = function(num) {
  			var temp = $scope.userAnswers[num].badForUser;
  			if (temp) {
  				$scope.userAnswers[num].badForUser = false;
  			}
  			else 
  				$scope.userAnswers[num].badForUser = true;
  		};

  		$scope.sendFirstPart = function(currentPage) {
    		$scope.savePrevPage(currentPage);
  			userService.sendFirstPartDemo($scope.userAnswers)
  				.then ( function(data) {
  					// notification.success("You have successfully completed the first part of the test.");

					$state.go('home');

					notification.success("Поздравляем вы успешно завершили прохождени теста.");



  					// $scope.whichPart = 2;
  					// $scope.initVars();
  					// $scope.initAll(data);
  				});
  		};
  		$scope.sendSecondPart = function(currentPage,which) {
    		$scope.savePrevPage(currentPage);
  			userService.sendSecondPart($scope.userAnswers)
  				.then ( function() {
  					$state.go('home');
  					if(which === true) {
  						notification.success("You have successfully completed all test");
  					}
  					else {
  						notification.error("You don't have time to finish second part");
  					}
  				});
  		};

  		$scope.save = function(currentPage) {
            var c = recorderService.controller('audioInput');
            var xhr = new XMLHttpRequest();
			xhr.onload = xhr.onerror = function() {
                if (this.status == 200) {
                  //log("success");
                } else {
                  //log("error " + this.status);
                }
              };
            xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                $scope.omg.tempChoise =  xhr.responseText;
                $scope.validAnswers[currentPage - 1] = true;
                $scope.success = 'Success';
                }
            }

            /*xhr.upload.onprogress = function(event) {
                log(event.loaded + ' / ' + event.total);
            }*/

            xhr.open("POST", "upload", true);
            xhr.send(c.audioModel);
        }
        $scope.isPlayingMy = false;
        $scope.startPlay = function() {
        	$scope.isPlayingMy = true;
        }

	}]);
})();