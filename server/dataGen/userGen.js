var mongo = require('../db/mongo');
var prompt = require('prompt');
var service = require('../services/userService');
var bodyParser = require('body-parser');
var q = require('q');
var faker = require('faker');


var addUsers = function(_adminCount,_userCount,_teacherCount,_guestCount){
	
	var userArray = [];
	
	for(var i=0; i<_adminCount; i++){
		
			var fn = faker.fake("{{name.firstName}}");
			var ln = faker.fake("{{name.lastName}}");
			var full = fn + ' '+ln+ ' '+'admin'+(i+1)+"@exadel.com";
			
			var user ={
				firstName: fn,
				lastName: ln,
				fullName : full,
				email: 'admin'+(i+1)+"@exadel.com",
				password : 'apass'+(i+1),
				role: 'admin'
			};
			userArray.push(user);
		}

	for(var i=0; i<_userCount; i++){
		
			var fn = faker.fake("{{name.firstName}}");
			var ln = faker.fake("{{name.lastName}}");
			var full = fn + ' '+ln+' '+'user'+(i+1)+"@exadel.com";
			
			var user ={
				firstName: fn,
				lastName: ln,
				fullName : full,
				email: 'user'+(i+1)+"@exadel.com",
				password : 'upass'+(i+1),
				role: 'user'
			};
			userArray.push(user);
		}	
	
	for(var i=0; i<_teacherCount; i++){
		
			var fn = faker.fake("{{name.firstName}}");
			var ln = faker.fake("{{name.lastName}}");
			var full = fn + ' '+ln+' '+'teacher'+(i+1)+"@exadel.com";
			
			var user ={
				firstName: fn,
				lastName: ln,
				fullName : full,
				email: 'teacher'+(i+1)+"@exadel.com",
				password : 'tpass'+(i+1),
				role: 'teacher'
			};
			userArray.push(user);
		}

	for(var i=0; i<_guestCount; i++){
		
			var fn = faker.fake("{{name.firstName}}");
			var ln = faker.fake("{{name.lastName}}");
			var full = fn + ' '+ln+ ' '+'guest'+(i+1)+"@exadel.com";
			
			var user ={
				firstName: fn,
				lastName: ln,
				fullName : full,
				email: 'guest'+(i+1)+"@exadel.com",
				password : 'gpass'+(i+1),
				role: 'guest'
			};
			userArray.push(user);
		}

	service.addNewUsers(userArray).then(function(data){
		console.log('users added');
	}).catch(function (err){
		console.log(err);
	});

}



var args = process.argv.slice(2);
if(args == '-d'){
	console.log('Default dataGen. Please, wait...');
	service.removeCollection().then(function(data){
		addUsers(5,20,10,10);
		  }).catch(function (err) {
			 console.log(err);
	});
}
else {
	prompt.start();
	console.log("Input numbers of roles: ");
	prompt.get(['Admin', 'User','Teacher','Guest'], function (err, result) {
	  	console.log('Please, wait...');
	   service.removeCollection({}).then(function(data){
	   		addUsers(result.Admin,result.User,result.Teacher,result.Guest);
		  }).catch(function (err) {
			 console.log(err);
		});
	
		
	});
}


