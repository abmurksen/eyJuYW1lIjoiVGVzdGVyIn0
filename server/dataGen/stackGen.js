var mongo = require('../db/mongo');
var prompt = require('prompt');
var testService = require('../services/testService');
var userService = require('../services/userService');
var stackService = require('../services/stackService')
var bodyParser = require('body-parser');
var q = require('q');

var fillStack = function (num, skip) {
    var i = 0;
    var res = [];
    var pr = userService.find({role: 'user'},{},{skip : skip, limit : num }); 

    
}

function getRandom(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
var fillCollections = function () {
    // fillStack(3, 0);
    var users = [];
    var teachers = [];
    testService.findB({},{'_id':1},{limit: 4}).then(function(testBdata){
                 var answers =[];
                 testBdata.forEach(function(element){
                        var answer ={};
                        answer.qId = element._id;
                        answer.answer = 'my testGen answer';
                        answers.push(answer);
                 });
                 userService.find({role: 'user'},{},{ limit : 14 }).then(function (data) {
                         users = data;
            
                    userService.find({role: 'teacher'},{},{}).then(function (dataTeach) {
                         teachers = dataTeach;
                        

                        for(var i =0; i<users.length;i++){
                                var id = users[i]._doc._id;
                                var firstName = users[i]._doc.firstName;
                                var lastName = users[i]._doc.lastName;
                                var email = users[i]._doc.email;

                                var tid = teachers[i%teachers.length]._doc._id;
                                var tfirstName = teachers[i%teachers.length]._doc.firstName;
                                var tlastName = teachers[i%teachers.length]._doc.lastName;
                                var temail = teachers[i%teachers.length]._doc.email;
                            
                            if(i == 0){

                                userService.updateStatus(id,'stack');
                                users[i] = {userId: id, teacherId: tid, firstName: firstName, lastName: lastName, email: email, teacherFirstName: tfirstName, teacherLastName: tlastName, teacherEmail: temail,answers : answers};
                            }
                            if (i>=1 && i<5){
                                userService.updateStatus(id,'stack');
                                users[i] = {userId: id,  firstName: firstName, lastName: lastName, email: email,answers : answers};
                            }
                            if(i>=5 && i<8){
                                
                                userService.updateStatus(id,'req');
                                users[i] = {userId: users[i]._doc._id,firstName: firstName, lastName: lastName, email: email};
                            }
                            if(i >= 8 && i< 11){
                                
                                var autoMark = getRandom(1,99);
                                var teacherMark = getRandom(1,99);
                                var level = getRandom(1,5);
                                var totalMark = (level-1)*20 + (teacherMark*0.2);
                                var resultOne ={autoMark: autoMark, teacherMark: teacherMark, level: level, totalMark : totalMark };
                                userService.updateStatus(id,'free');
                                users[i] = {teacherId: tid,teacherEmail: temail,teacherFirstName: tfirstName, teacherLastName: tlastName,userId: users[i]._doc._id,firstName: firstName, lastName: lastName, email: email,result:resultOne };
                            }
                             if (i >=11 && i<14){
                                 
                                 userService.updateStatus(id,'open');
                                 var now = new Date();
                                 now.setSeconds(now.getSeconds()+20000);
                            
                                users[i] = {userId: users[i]._doc._id,firstName: firstName, lastName: lastName, email: email,dateStart: new Date().getTime() , dateEnd: now.getTime()};
                            }}; 
                        
                        stackService.addStacks(users.slice(0, 5)).then(function (data) {
                            console.log('stack filled');
                            stackService.addRequests(users.slice(5, 8)).then(function (data) {
                                console.log('requests filled');
                                stackService.addResultArray(users.slice(8, 11)).then(function (data) {
                                    console.log('results filled');
                                    stackService.addOpenTestsArray(users.slice(11, users.length)).then(function (data) {
                                        console.log('opentest filled');
                                    }).catch(function(err){
                                            console.log(' ERROR');
                                    });
                                });
                            });
                        });
                        
                        
                        
                    });
            
            
            
        });
    

    }).catch(function(err){
         console.log(' ERROR');
    })
   
}

console.log('Default stackGen. Please, wait...');
stackService.removeStackCollection({}).then(function(data){
    stackService.removeRequestCollection({}).then(function(data){
        stackService.removeResultsCollection({}).then(function(data){
            stackService.removeOpenTestsCollection({}).then(function(data){
                  fillCollections(3,3,3,3);
            }).catch(function (err) {
                 console.log(err);
             });
        }).catch(function (err) {
                 console.log(err);
        });
    }).catch(function (err) {
                 console.log(err);
    }); 
}).catch(function (err) {
                 console.log(err);
             });

  

	
