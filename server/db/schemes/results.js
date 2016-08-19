var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var resultsScheme = new Schema(
	{
		date : {
			type: Number,
			default: Date.now()
		},
		
		userId: String,
		firstName: String,
		lastName: String,
		email: String,

		result: {
			autoMark: Number,
			teacherMark: Number,
			level: Number,
			totalMark: Number
		},
		teacherId: {
			type: String,
			default: 'none'
		},
		teacherFirstName: String,
		teacherLastName: String,
		teacherEmail: String

	});
	
var results = mongoose.model('results', resultsScheme);
module.exports = results;
