var mongoose=require('mongoose');
var communityDetails = require('.././Models/community');
var ObjectId = require('mongodb').ObjectID;

function sendDate()
{
	var mon=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
	var d = new Date();
	var d1=d.getDate();
	d1<10?d1='0'+d1:d1=d1;
	var d2=mon[d.getMonth()];
	var d3=d.getFullYear();
	var x=d1+'-'+d2+'-'+d3;
	return x;
}

exports.getOwnerAndAdmin = (email,cb)=>
{
	communityDetails.find({$or:[{'owner.user':email},{'admin.user':email}]}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getMember = (email,cb)=>
{
	communityDetails.find({'members.user':email}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getRequest = (email,cb)=>
{
	communityDetails.find({'request.user':email}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getInvited = (email,cb)=>
{
	communityDetails.find({'invited.user':email}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getCommunityById =(id,cb)=>
{
	communityDetails.find({
        _id:ObjectId(id)
    }).exec((err,data)=>{
    	if(err)
    		cb(err);
    	cb(null,data);
    });
}

exports.activation = (props,cb)=>
{
	communityDetails.updateOne({_id: ObjectId(props.ID)},
	{
		name: props.newName,
		activity: props.activity
	}).exec((err,data)=>{
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.update = (props,cb)=>
{
	var d={
		name:props.body.communityName,
        membershipRule:props.body.communityMembershipRule,
		description:props.body['trumbowyg-demo']
	}
	if(props.file!=undefined)
		d.picId=props.file.filename;
	communityDetails.updateOne({_id:ObjectId(props.params.id)},d).exec((err,data)=>{
        if(err)
            cb(err);
        cb(null,data);
    });
}

exports.addMember = (id,data,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$push: {members:{UID:data[0]._id,user:data[0].email,name:data[0].name}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.addRequest = (id,data,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$push: {request:{UID:data[0]._id,user:data[0].email,name:data[0].name}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.addInvite = (id,data,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$push: {invited:{UID:data[0]._id,user:data[0].email,name:data[0].name}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeMember = (id,email,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {members:{user:email}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeMemberById = (id,id1,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {members:{UID:id1}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeRequest = (id,email,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {request:{user:email}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeRequestById = (id,id1,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {request:{UID:id1}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeAdmin = (id,id1,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {admin:{UID:id1}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeInvite = (id,email,cb)=>
{	
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {invited:{user:email}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});
}

exports.removeInvitation = (id,id1,cb)=>
{
	communityDetails.updateOne(
	{_id: ObjectId(id)},
	{$pull: {invited:{UID:id1}}}
	).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data)
	});	
}

exports.acceptRequest = (id,data,cb)=>
{
	communityDetails.updateOne({_id:ObjectId(id)},
        {$push: {members:{UID:data[0]._id,user:data[0].email,name:data[0].name}},
        $pull: {request:{UID:data[0]._id}}}
    ).exec(function(err,info){
        if(err)
            cb(err);
        cb(null,info);
    });
}

exports.acceptInvitation = (id,data,cb)=>
{
	communityDetails.updateOne({_id:ObjectId(id)},
        {$push: {members:{UID:data[0]._id,user:data[0].email,name:data[0].name}},
        $pull: {invited:{UID:data[0]._id}}}
    ).exec(function(err,info){
        if(err)
            cb(err);
        cb(null,info);
    });
}

exports.makeAdmin = (id,data,cb)=>
{
	communityDetails.updateOne({_id:ObjectId(id)},
        {$push: {admin:{UID:data[0]._id,user:data[0].email,name:data[0].name}},
        $pull: {members:{UID:data[0]._id}}}
    ).exec(function(err,info){
        if(err)
            cb(err);
        cb(null,info);
    });
}

exports.makeMember = (id,data,cb)=>
{
	communityDetails.updateOne({_id:ObjectId(id)},
        {$push: {members:{UID:data[0]._id,user:data[0].email,name:data[0].name}},
        $pull: {push:{UID:data[0]._id}}}
    ).exec(function(err,info){
        if(err)
            cb(err);
        cb(null,info);
    });
}

exports.showCommunities = (fin,email,skip,limit,cb)=>
{
	communityDetails.find({$and: [fin,{'owner.user':{$ne:email}},{'members.user':{$ne:email}},{'admin.user':{$ne:email}},{'request.user':{$ne:email}}]})
	.skip(skip).limit(limit).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.getCount = (fin,cb)=>
{
	communityDetails.countDocuments(fin).exec(function(err,totalCount)
	{
		if(err)
			cb(err);
		cb(null,totalCount);
	});
}

exports.getCommunityByDemand = (fin,start,obj,size,cb)=>
{
	communityDetails.find(fin).skip(start).sort(obj).limit(size).exec(function(err,data){
		if(err)
			cb(err);
		cb(null,data);
	});
}

exports.addCommunity = (props,data,cb)=>
{
	var newCommunityDetails=new communityDetails({
		name: props.body.name,
		membershipRule: props.body.method,
		location: "Not Added",
		owner: {UID:data[0]._id,user:data[0].email,name:data[0].name},
		createDate: sendDate(),
		activity: "Active",
		description: props.body.trumbowyg,
		picId: (props.file==undefined) ? "defaultCommunity" : props.file.filename,
		members:[],
		request:[],
		admin:[],
	    invited:[]
	});
	newCommunityDetails.save()
	.then(savedData=>{
		cb(null,savedData);
	})
	.catch(err=>{
		cb(err);
	});
}