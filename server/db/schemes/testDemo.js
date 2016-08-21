var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestAScheme = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ['oneOfMany','manyOfMany','listeningWithOneOfMany','listeningWithManyOfMany'],
			default: 'oneOfMany'
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
		},
		options: [],
		answers: []

	});
	
var testDemo = mongoose.model('testDemo', TestAScheme);
module.exports = testDemo;
