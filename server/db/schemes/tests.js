var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestsScheme = new Schema(
	{
		name:{
			type: String
		}

	});
	
var tests = mongoose.model('tests', TestsScheme);
module.exports = tests;
