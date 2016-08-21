var testA = require('../db/mongo').testA;
var testDemo = require('../db/mongo').testDemo;
var testB = require('../db/mongo').testB;
var testMaker = require('../logic/testMaker');
var q = require('q');
var stackService = require('./stackService');
var service = require('./userService');


function findA(query, fields, options){
	return testA.find(query, fields, options);
}
function findB(query, fields, options){
	return testB.find(query, fields, options);
}
function getAllQuestions(){
	return testA.find({},{},{});
}
function getQFromLevel(_level,rand){
	return testA.find({level: _level},{'type':1, 'question':1, 'options':1},{skip : rand, limit : 1 });
}
function addNewQuestion(info){
	return testA.save(info);	
}
function addNewQuestionB(info){
	return testB.save(info);	
}
function removeCollection(query){
	return testA.remove(query);
}

function removeCollectionDemo(query){
	return testDemo.remove(query);
}

function removeCollectionB(query){
	return testB.remove(query);
}
function getTest(user){
	return testMaker.make(testA,user);
}

function getSecondTest(level){
	return testMaker.makeAgain(testB,level);
}
function getComplaintedA(){
	return testA.find({complaint: true},{'type':1, 'question':1, 'options':1},{});
}

function getComplaintedB(){
	return testB.find({complaint: true},{'type':1, 'question':1, 'options':1},{});
}
function addQuestionArrayA(info){
	return testA.create(info);
}
function addQuestionArrayDemo(info){
	return testDemo.create(info);
}
function addQuestionArrayB(info){
	return testB.create(info);
}

function result(id, ans){
	var pr = q.defer();
	
	var count =0;
	var rez =0;
	
	ans.forEach(function(element) {
		count++;
		var qw = new Number(element.mark) ;
		+qw;
		rez +=qw;
		
	});

	rez/=count;
	stackService.findStack({_id: id}, {}, {}).then(function (data_){
		var resultRecord = {};
		var data = data_[0];
		resultRecord.userId = data.userId,
		resultRecord.firstName = data.firstName,
		resultRecord.lastName = data.lastName,
		resultRecord.email = data.email,

		resultRecord.result = {};

		resultRecord.result.autoMark = data.autoMark;
		resultRecord.result.teacherMark = rez;
		resultRecord.result.level = data.level;
		var total = data.autoMark * 0.3 + rez*0.7;
		resultRecord.result.totalMark = Math.round(total);
		//((data.level - 1)*20) + (rez*0.2);
		resultRecord.teacherId = data.teacherId;
		resultRecord.teacherFirstName = data.teacherFirstName;
		resultRecord.teacherLastName = data.teacherLastName;
		resultRecord.teacherEmail = data.teacherEmail;

		stackService.addResults(resultRecord).then(function(data){
			stackService.removeStackCollection({_id: id}).then(function(data){
				service.updateStatus(resultRecord.userId,'free');
				pr.resolve();
			}).catch(function(err){
				pr.reject(err);
			})
		}).catch(function(err){
			pr.reject(err);
		})

	}).catch(function(err){
		pr.reject(err);
	});



	return pr.promise;
}
function checkTest(testId, tId){
    var pr = q.defer();
    stackService.findStack({_id: testId},{'answers':1,'teacherId':1},{}).then(function(data){
    	
    	if(data[0].teacherId == tId){
		    	var qIdArr =[];
		    	var forTeacher =[];
		    	console.log(forTeacher);
		    	data[0].answers.forEach(function(element){
		    		qIdArr.push(element.qId);
		    	});
		    	console.log(qIdArr);
		    
		    	findB({_id : {$in:qIdArr}},{'question':1,'type':1},{}).then(function(qdata){
		    		for(var i=0; i<qdata.length; i++){
		    			var question ={};
		    			question.qId = qdata[i]._id;
		    			question.answer = data[0].answers[i].answer;
		    			question.type = qdata[i].type;
		    			question.question = qdata[i].question;
		    			forTeacher.push(question);
		    			
		    		}
		    		console.log(forTeacher);
		    		pr.resolve({questions: forTeacher, tId : testId});

		    	}).catch(function(err){
		    		pr.reject(err);
		    	})
    	}
    	else {
    		pr.reject('ERROR. THIS TEST IS NOT FOR YOU');
    	}
    }).catch(function(err){
    	pr.reject(err);
    });
    return pr.promise;
};


function blockComplained(A, B){
	var pr = q.defer();
	testA.update({_id : {$in : A}},{ $set: { bad: true, complaint: false }},{multi: true}).then(function(data){
		
		testB.update({_id : {$in : B}},{ $set: { bad: true, complaint: false }},{multi: true}).then(function(data){
			
			pr.resolve();
		}).catch(function(err){
			pr.reject(err);
		});
	}).catch(function(err){
		pr.reject(err);
	})
	return pr.promise;
}

function disblockComplained(A, B){
	var pr = q.defer();
	testA.update({_id : {$in : A}},{ $set: { complaint: false, bad : false }},{multi: true}).then(function(data){
		
		testB.update({_id : {$in : B}},{ $set: { complaint: false, bad : false }},{multi: true}).then(function(data){
			
			pr.resolve();
		}).catch(function(err){
			pr.reject(err);
		});
	}).catch(function(err){
		pr.reject(err);
	})
	return pr.promise;
}






module.exports.getAllQuestions = getAllQuestions;
module.exports.getQFromLevel = getQFromLevel;
module.exports.addNewQuestion = addNewQuestion;
module.exports.addNewQuestionB = addNewQuestionB;
module.exports.removeCollection = removeCollection;
module.exports.getTest= getTest;
module.exports.removeCollectionB = removeCollectionB;
module.exports.removeCollectionDemo = removeCollectionDemo;
module.exports.getSecondTest = getSecondTest;
module.exports.getComplaintedA = getComplaintedA;
module.exports.getComplaintedB = getComplaintedB;
module.exports.addQuestionArrayA = addQuestionArrayA;
module.exports.addQuestionArrayDemo = addQuestionArrayDemo;
module.exports.addQuestionArrayB = addQuestionArrayB;
module.exports.result = result;
module.exports.checkTest = checkTest;
module.exports.findA = findA;
module.exports.findB = findB;
module.exports.blockComlained = blockComplained;
module.exports.disblockComlained = disblockComplained;
