var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var stackScheme = new Schema(
	{
		date : {
			type: Number,
			default: Date.now()
		},
		autoMark : Number,
		level : Number,
		userId: String,
		firstName: String,
		lastName: String,
		email: String,

		answersAuto: [{_qId: String, level: Number, answer: []}],
		answers: [{qId: String, answer: String }],
		
		teacherId: {
			type: String,
			default: 'none'
		},
		teacherFirstName: String,
		teacherLastName: String,
		teacherEmail: String,

	});
	
var stack = mongoose.model('stack', stackScheme);
module.exports = stack;
