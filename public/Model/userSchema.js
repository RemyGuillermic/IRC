var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstname: {
		type :String,
		required: true
	},
	lastname:{
		type :String,
		required: true
	},
	email:{
		type :String,
		required: true
	},
	date: {
		type : Date,
		default : Date.now
	},
	role: {
		type: String,
		default: "user"
	}
}); 

module.exports = mongoose.model("users",userSchema);;