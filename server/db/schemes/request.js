var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var requestScheme = new Schema(
	{
		date : {
			type: Number,
			default: Date.now()
		},
		
		userId: String,
		firstName: String,
		lastName: String,
		email: String

	});
	
var request = mongoose.model('request', requestScheme);
module.exports = request;
