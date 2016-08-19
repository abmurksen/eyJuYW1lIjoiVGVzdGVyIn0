var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestBScheme = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ['questionWithoutChoiceOfAnswers','essay','listeningWithoutChoiceOfAnswers','speaking'],
			default: 'essay'
  		},
		level:{
			type:Number,
			enum: [1, 2, 3, 4, 5],
			required: true
		},
		question:{
			type:String,
			required: true

		},
		complaint:{
			type: Boolean,
			default: false
		},
		bad: {
			type: Boolean,
			default: false
		}
	});
	
var testB = mongoose.model('testB', TestBScheme);
module.exports = testB;
