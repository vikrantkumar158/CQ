var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = Schema({
	pId: String,
	uId: String,
	details: String,
	name: String,
	date: Date,
	count: {type: Number,default: 0},
	deleted: {type: Boolean,default: false}
});

var reply = mongoose.model("replies",replySchema);
module.exports=reply;