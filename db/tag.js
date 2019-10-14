var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = Schema({
	tagName: String,
	createdBy: String,
	createDate: String
});

var tagDetails = mongoose.model("tagdetails",tagSchema);
module.exports=tagDetails;