var mongoose=require('mongoose');
var comment = require('.././db/comment');
var ObjectId = require('mongodb').ObjectID;

exports.getCommentById = (id,cb)=>
{
	comment.find({
		pId: id
	}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getGlobalFeatured = (id,cb)=>
{
	comment.find({pId:id,$or:[{featured:true},{global:true}],deleted:false})
	.exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.delete = (id,cb)=>
{
	comment.updateOne({_id : ObjectId(id)},{$set : {deleted : true}})
	.exec((err,data)=>{
		if(err)	
			cb(err);
		cb(null,data);
	})
}

exports.increaseCount = (id,i,cb)=>
{
	comment.updateOne({_id : ObjectId(id)},{$inc:{count : parseInt(i)}})
	.exec((err,info)=>{
		if(err)
			cb(err);
		cb(null,info);
	});	
}

exports.feature = (id,opt,cb)=>
{
	comment.updateOne({_id : ObjectId(id)},{$set : {featured : opt}})
	.exec((err,data)=>{
		if(err)	
			cb(err);
		cb(null,data);
	});
}

exports.global = (id,opt,cb)=>
{
	comment.updateOne({_id : ObjectId(id)},{$set : {global : opt}})
	.exec((err,data)=>{
		if(err)	
			cb(err);
		cb(null,data);
	});
}

exports.addComment = (props,data,cb)=>
{
	var newComment=new comment({
 		pId: props.params.id,
		title: props.body.disctitle,
		details: props.body.discinfo,
		tag: props.body.tags,
		pics: props.file==undefined?"":props.file.filename,
		uId: data[0]._id,
		name: data[0].name,
		date: new Date(),
		featured: false,
		global: false,
		deleted: false
 	});
 	newComment.save()
 	.then(savedData=>{
		cb(null,savedData);
	})
	.catch(err=>{
		cb(err);
	});
}