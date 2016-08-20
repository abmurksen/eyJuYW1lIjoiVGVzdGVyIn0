var mongo = require('../../db/mongo');
var user = require('./users.json');
var service = require('../../services/userService');
var bodyParser = require('body-parser');


function addAll(users){
	service.addNewUsers(users).then(function(data){
		console.log('Users added');
	}).catch(function(err){
		console.log(err);
	});

}

console.log('Default testGen. Please, wait...');
service.removeCollection({}).then(function (data) {
    addAll(user);
}).catch(function (err) {
	console.log(err);
});