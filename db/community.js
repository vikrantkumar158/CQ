var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communitySchema = Schema({
	name: String,
	membershipRule: String,
	location: String,
	owner: {UID:String,user:String,name:String},
	createDate: String,
	activity: String,
	description: String,
	picId: String,
	members:[{UID:String,user:String,name:String}],
	request:[{UID:String,user:String,name:String}],
	admin:[{UID:String,user:String,name:String}],
    invited:[{UID:String,user:String,name:String}]
});

var communityDetails = mongoose.model("communitydetails",communitySchema);
module.exports=communityDetails;