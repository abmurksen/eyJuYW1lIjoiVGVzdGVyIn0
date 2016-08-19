var mongo = require('../db/mongo');
var prompt = require('prompt');
var testService = require('../services/testService');
var bodyParser = require('body-parser');
var testA = require('../db/tests/testA.json').tests;
var testB = require('../db/tests/testB.json').tests;


function addAll(testA,testB){
	testService.addQuestionArrayA(testA).then(function(data){
		console.log('Add Auto question ');
		testService.addQuestionArrayB(testB).then(function(data){
				console.log('Add teacher question ');
		}).catch(function(err){
			console.log(err);
		});
	}).catch(function(err){
		console.log(err);
	});

}

	console.log('Default testGen. Please, wait...');
	testService.removeCollection({}).then(function(data){
		testService.removeCollectionB({}).then(function(data){
			addAll(testA,testB);
		}).catch(function(err){
			console.log(err);
		});
		
		  }).catch(function (err) {
			 console.log(err);
	});
	




