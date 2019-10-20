var mongoose = require('mongoose');
var reply = require('.././Models/reply');
var ObjectId = require('mongodb').ObjectID;

exports.getReplyById = (id,cb)=>
{
	reply.find({"pId" : id}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.deleteReply = (id,cb)=>
{
	reply.findOneAndUpdate({_id : ObjectId(id)},{$set:{deleted : true}})
	.exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.increaseCount = (id,i,cb)=>
{
	reply.updateOne({_id : ObjectId(id)},{$inc:{count : parseInt(i)}})
	.exec((err,info)=>{
		if(err)
			res.send(err);
		res.send(info);
	});	
}

exports.addReply = (props,data,cb)=>
{
	var newReply = new reply({
		pId: props.params.id,
		uId: data[0]._id,
		details: props.body.reply,
		name: data[0].name,
		date: new Date()
	});
	newReply.save()
	.then(savedData=>{
		cb(null,savedData);
	})
	.catch(err=>{
		cb(err);
	});
}