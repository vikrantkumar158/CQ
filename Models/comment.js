var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = Schema({
	pId: String,
	uId: String,
	title: String,
	details: String,
	tag: String,
	pics: String,
	name: String,
	date: Date,
	count: {type: Number,default: 0},
	featured: {type: Boolean,default: false},
	global: {type: Boolean,default: false},
	deleted: {type: Boolean,default: false}
});

var comment = mongoose.model("comments",commentSchema);
module.exports=comment;