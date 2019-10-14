var mongoose=require('mongoose');
var bcrypt = require('bcrypt');
var userDetails = require('.././db/user');
var ObjectId = require('mongodb').ObjectID;

exports.getUsers = (cb)=>
{
	userDetails.find({}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getUserByEmail = (email,cb)=>
{
	userDetails.find({email:email}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	})
}

exports.getUserById = (id,cb)=>
{
	userDetails.find({_id:ObjectId(id)}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	})
}

exports.getInvitees = (fin,arr,cb)=>
{
	userDetails.find({
		$and:[fin,{email:{$nin:arr}}]
	}).sort({email:1}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.changePassword = (email,password,cb)=>
{
	userDetails.updateOne({email: email},
	{
		password: bcrypt.hashSync(password,10)
	}).exec(function(err,data){
		if(err)
			cb(err)
		cb(null,data);
	});
}

exports.deleteUser = (email,cb)=>
{
	userDetails.updateOne({email: email},
	{
		delob: "1"
	}).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.activation = (email,activity,cb)=>
{
	userDetails.updateOne({email: email},
	{
		activity: activity
	}).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.update = (props,cb)=>
{
	userDetails.updateOne({email: props.oldUser},
	{
		email: props.email,
		phoneno: props.phone,
		city: props.city,
		role: props.role,
		status: props.status
	}).exec(function(err,data){
		if(err)
			cb(err)
		cb(null,data);
	});
}

exports.addUser = (props,password,cb)=>
{
	var newUserDetails=new userDetails({
		name: props.name,
		email: props.email,
		password: password,
		city: props.city,
		phoneno: props.phoneno, 
		gender: props.gender,
		dob: props.dob,
		role: props.role,
		status: "Pending",
		activity: "Active",
		PI1: "",
		PI2: "",
		PI3: "",
		delob: "-1",
        picId: "defaultProfilePic"
	});
	newUserDetails.save()
	.then(data=>{
		cb(null,data);
	})
	.catch(err=>{
		cb(err);
	});
}

exports.getCount = (fin,cb)=>
{
	userDetails.countDocuments(fin).exec(function(err,totalCount)
	{
		if(err)
			cb(err);
		cb(null,totalCount);
	});
}

exports.getUserByDemand = (fin,start,obj,size,cb)=>
{
	userDetails.find(fin).skip(start).sort(obj).limit(size).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.updateUser = (data,file,cb)=>
{
	var d={
			name: data.name,
			city: data.city,
			phoneno: data.phone, 
			gender: data.gender,
			dob: data.date,
			status: "Confirmed",
			PI1: data.PI1,
			PI2: data.PI2,
			PI3: data.PI3,
			delob: "0"
		};
	if(file!=undefined)
		d.picId=file.filename;
	userDetails.updateOne({email:data.email},d).exec((err,info)=>{
		if(err)
			cb(err);
		cb(null,info);
	});
}