var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
	name: String,
	email: String,
	password: String,
	city: String,
	phoneno: String, 
	gender: String,
	dob: String,
	role: String,
	status: String,
	activity: String,
	PI1: String,
	PI2: String,
	PI3: String,
	delob: String,
    picId: String
});

var userDetails = mongoose.model("userdetails", userSchema);
module.exports=userDetails;