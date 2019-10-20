var mongoose=require('mongoose');
var tagDetails = require('.././Models/tag');
var ObjectId = require('mongodb').ObjectID;

exports.getTags = (cb)=>
{
	tagDetails.find({}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getTagByName = (name,cb)=>{
	tagDetails.find({tagName:name}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.removeTag = (name,cb)=>
{
	tagDetails.remove({tagName: name}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.addTag = (props,role,cb)=>
{
	var newTagDetails=new tagDetails({
		tagName: props.tagName,
		createdBy: role,
		createDate: props.createDate
	});
	newTagDetails.save()
	.then(data=>{
		cb(null,data);
	})
	.catch(err=>{
		cb(err);
	});
}