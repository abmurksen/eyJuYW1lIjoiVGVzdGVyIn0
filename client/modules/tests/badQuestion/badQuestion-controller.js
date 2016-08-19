(function(){
    angular.module('admin').controller('badQuestionController', ['$scope', '$state','$timeout', 'userService','angularPlayer','notification',
    	 function($scope, $state, $timeout, userService, angularPlayer, notification){

    	$scope.$on('$stateChangeStart', function () {
			if (angularPlayer.isPlayingStatus() === true ) {
				$timeout( function() {angularPlayer.pause();});
			}
		});

    	userService.getBadQuestions()
    		.then ( function(result) {
				$scope.initAll(result);
		})

		$scope.allQuestions = [];
		$scope.currentPage = 1;
		$scope.copyCurrentPage = 1;
		$scope.adminSay = [];
		$scope.totalCount;

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

    	$scope.initAll = function(result) {
    		$scope.allQuestions = result;
    		$scope.totalCount = $scope.allQuestions.length;
    		for (var i = 0; i < $scope.totalCount; ++i) {
    			var temp = {
    				qId: $scope.allQuestions[i]._id,
    				normal: ''
    			}
    			$scope.adminSay.push(temp);
    		}
		}

		$scope.thinkBad = function(currentPage) {
			$scope.adminSay[currentPage - 1].normal = false;
		}

		$scope.thinkGood = function(currentPage) {
			$scope.adminSay[currentPage - 1].normal = true;
		}

		$scope.thinkStill = function(currentPage) {
			$scope.adminSay[currentPage - 1].normal = '';
		}

		$scope.initNewPage = function(currentPage) {
			$scope.currentPage = currentPage;
		}


		$scope.pageChanged = function(prevNumPage, currentPage) {
    		if(angularPlayer.getPlaylist().length > 0)
    			angularPlayer.clearPlaylist( function() {
    				});   
    		$scope.initNewPage(currentPage);	
    		$scope.copyCurrentPage = $scope.currentPage;

  		};

		$scope.setNumPage = function(numPage) {
			$scope.pageChanged($scope.copyCurrentPage, numPage);
		};

		$scope.sendQuestions = function() {
			$scope.adminSayBad = {
				A:[],
				B:[]
			}
			$scope.adminSayGood = {
				A:[],
				B:[]
			}
			for (var i = 0; i < $scope.totalCount; ++ i) {
				if ($scope.allQuestions[i].type === 'oneOfMany' || 
					$scope.allQuestions[i].type === 'manyOfMany' ||
					$scope.allQuestions[i].type === 'listeningWithManyOfMany' ||
					$scope.allQuestions[i].type === 'listeningWithOneOfMany') {

					if($scope.adminSay[i].normal === true){
						$scope.adminSayGood.A.push($scope.adminSay[i].qId);
					}
					else if($scope.adminSay[i].normal === false ){
						$scope.adminSayBad.A.push($scope.adminSay[i].qId);
					}
				}
				else {
					if($scope.adminSay[i].normal === true){
						$scope.adminSayGood.B.push($scope.adminSay[i].qId);
					}
					else if($scope.adminSay[i].normal === false ){
						$scope.adminSayBad.B.push($scope.adminSay[i].qId);
					}
				}
			}
			userService.sendBadQuestions($scope.adminSayBad)
				.then( function() {
					userService.sendGoodQuestions($scope.adminSayGood)
						.then( function() {
							$state.go('home');
							notification.success("You have successfully send some questions");
						})
				})
		}

    }])
})();