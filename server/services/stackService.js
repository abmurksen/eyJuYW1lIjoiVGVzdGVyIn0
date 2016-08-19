var stack = require('../db/mongo').stack;
var testA = require('../db/mongo').testA;
var results = require('../db/mongo').results;
var request = require('../db/mongo').request;
var openTests = require('../db/mongo').openTests;
var service = require('./userService');

var q = require('q');

function getAllStack(){
	return stack.find({},{},{});
}
function getAllRequest(){
	return request.find({},{},{});
}
function getAllResults(){
	return results.find({},{},{});
}
function getAllOpenTests(){
	return openTests.find({},{},{});
}


function addStack(info){
	return stack.save(info);
}
function addRequest(info){
	return request.save(info);
}
function addResults(info){
	return results.save(info);
}
function addOpenTests(info){
	return openTests.save(info);
}


function addStacks(info){
	return stack.create(info);
}
function addOpenTestsArray(info){
	return openTests.create(info);
}
function addRequests(info){
	return request.create(info);
}
function addResultArray(info){
	return results.create(info);
}

function findStack(){
	return stack.find(arguments[0],arguments[1],arguments[2]);
}
function findResults(){
	return results.find(arguments[0],arguments[1],arguments[2]);
}
function findRequest(){
	return request.find(arguments[0],arguments[1],arguments[2]);
}
function findOpenTests(){
	return openTests.find(arguments[0],arguments[1],arguments[2]);
}

function findStackById(){
	return stack.findById(arguments[0],arguments[1],arguments[2]);
}
function findResultsById(){
	return results.findById(arguments[0],arguments[1],arguments[2]);
}
function findRequestById(){
	return request.findById(arguments[0],arguments[1],arguments[2]);
}
function findOpenTestsById(){
	return openTests.findById(arguments[0],arguments[1],arguments[2]);
}

function assignTeacher(data){
		var pr = q.defer();
		var tId = data.teacherId;
		service.find({_id : tId},{'firstName':1,'lastName':1,'email':1},{}).then(function(data1){
			stack.update({userId: data.userId},{$set: { teacherId: data.teacherId, teacherFirstName : data1[0].firstName, teacherLastName: data1[0].lastName, teacherEmail: data1[0].email}},{}).then(function(data){
				pr.resolve(data);
			})
		}).catch(function(err){
			pr.reject(err);
		})
	
	return pr.promise;
}



function updateStackTeacher(id,field){
	return stack.update(id,field);
};

function removeStackCollection(query){
	return stack.remove(query);
}
function removeResultsCollection(query){
	return results.remove(query);
}
function removeRequestCollection(query){
	return request.remove(query);
}
function removeOpenTestsCollection(query){
	return openTests.remove(query);
}


function findOneStack(){
	return stack.findOne(arguments[0],arguments[1],arguments[2]);
}
function findOneResults(){
	return results.findOne(arguments[0],arguments[1],arguments[2]);
}
function findOneRequest(){
	return request.findOne(arguments[0],arguments[1],arguments[2]);
}
function findOneOpenTests(){
	return openTests.findOne(arguments[0],arguments[1],arguments[2]);
}

function stackCount(){
	return stack.count(arguments[0]);
}
function resultsCount(){
	return results.count(arguments[0]);
}
function requestCount(){
	return request.count(arguments[0]);
}
function openTestsCount(){
	return openTests.count(arguments[0]);
}

function stackCountAsync(){
	return stack.countAsync(arguments[0]);
}
function resultCountAsync(){
	return stack.countAsync(arguments[0]);
}


function checkFirstPart(data, id){
	var pr = q.defer();
	var len = data.length;
	var marks = [];
	for (var i =0; i < 5 ;i++){
		marks.push(0);
	}
	stack.findOne({userId: id}).then(function(stackRecord){
			data.forEach(function(element) {
				if(element.badForUser){
					testA.update({_id:element.qId},{ $set: { complaint: true }},{});
				}
				stackRecord.answersAuto.forEach(function(element1) {
					if(element.qId == element1._qId){
						var f = true
						element.answer.forEach(function(element, i, arr) {
							if(element!= element1.answer[i]){
								f = false;
							}
						});
						if(f){
							marks[element1.level-1]+=0.2*element1.level;
						}
					}
				});
			});
			var rez = 0;
			marks.forEach(function(element) {
				rez+=element;
			});
			
			rez/=9;
			var aMark = rez;
			aMark *=100;
			rez = Math.floor(rez*5)+1;
			if(rez == 6) {
				rez = 5;
			}
			stack.update({_id:stackRecord._id},{ $set: { level: rez, autoMark: aMark }},{}).then(function(){
				pr.resolve(rez);
			}).catch(function(err){
				pr.reject(err);
			});
	}).catch(function(err){
		pr.reject(err);
	});

	return pr.promise;

}

function sendTest(sId, tId){
	return stack.findOne({_id : sId, teacherId : tid},{},{});
}



module.exports.getAllStack = getAllStack;
module.exports.addStack = addStack;
module.exports.addStacks = addStacks;
module.exports.findStackById = findStackById;
module.exports.findResultsById = findResultsById;
module.exports.findRequestById = findRequestById;
module.exports.findOpenTestsById = findOpenTestsById;
module.exports.getAllResults = getAllResults;
module.exports.getAllRequest = getAllRequest;
module.exports.getAllOpenTests = getAllOpenTests;
module.exports.addResults = addResults;
module.exports.addRequest = addRequest;
module.exports.addOpenTests = addOpenTests;
module.exports.findStack = findStack;
module.exports.findResults = findResults;
module.exports.findRequest = findRequest;
module.exports.findOpenTests = findOpenTests;
module.exports.addOpenTestsArray = addOpenTestsArray;
module.exports.assignTeacher = assignTeacher;
module.exports.addRequests = addRequests;
module.exports.addResultArray = addResultArray;
module.exports.removeStackCollection = removeStackCollection;
module.exports.removeRequestCollection = removeRequestCollection;
module.exports.removeResultsCollection = removeResultsCollection;
module.exports.removeOpenTestsCollection = removeOpenTestsCollection;
module.exports.findOneRequest = findOneRequest;
module.exports.findOneResults = findOneResults;
module.exports.findOneStack = findOneStack;
module.exports.findOneOpenTests = findOneOpenTests;
module.exports.stackCount =stackCount;
module.exports.resultsCount = resultsCount;
module.exports.openTestsCount = openTestsCount;
module.exports.requestCount = requestCount;
module.exports.checkFirstPart = checkFirstPart;
module.exports.sendTest = sendTest;
module.exports.stackCountAsync = stackCountAsync;
module.exports.resultCountAsync = resultCountAsync;