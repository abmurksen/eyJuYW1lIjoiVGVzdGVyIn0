var mongo = require('../db/mongo');
var prompt = require('prompt');
var service = require('../services/userService');
var bodyParser = require('body-parser');



var addUsers = function(){
	
	var userArray = [];
	
	for(var i=0; i< 1000; i++){
			var full = 'a '+ 'a '+ 'a'+i+'@com';
			var user ={
				firstName: 'a',
				lastName: 'a',
				fullName : full,
				email: 'a'+i+'@com',
				password : (i+1),
				role: 'user'
			};
			userArray.push(user);
		}
	var admin ={
				firstName: 'admin',
				lastName: 'admin',
				fullName : full,
				email: 'admin@com',
				password : 123,
				role: 'admin'
			};	
	userArray.push(admin);	
	console.log(userArray.length);
	

	service.addNewUsers(userArray).then(function(data){
		console.log('users added');
	}).catch(function (err){
		console.log(err);
	});

}




	console.log('Default dataGen-MEGA. Please, wait...');
	service.removeCollection().then(function(data){
			addUsers();
		  }).catch(function (err) {
			 console.log(err);
	});




