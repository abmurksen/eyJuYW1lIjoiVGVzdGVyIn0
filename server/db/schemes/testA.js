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
		},
		options: [],
		answers: []

	});
	
var testA = mongoose.model('testA', TestAScheme);
module.exports = testA;
