var express = require('express');
const router = express.Router();

var auth=require('../.././Middlewares/auth');
var user=require('../.././Controllers/user');
var community=require('../.././Controllers/community');
var comment=require('../.././Controllers/comment');

router.get('/communitypanel',auth,(req,res,next)=>{

	community.getOwnerAndAdmin(req.session.userName,(err,data1)=>{
		if(err)
			res.send(err);
		community.getMember(req.session.userName,(err,data2)=>{
			if(err)
				res.send(err);
			community.getRequest(req.session.userName,(err,data3)=>{
				if(err)
					res.send(err);
				community.getInvited(req.session.userName,(err,data4)=>{
				if(err)
					res.send(err);
					user.getUserByEmail(req.session.userName,(err,updata)=>{
						if(err)
							res.send(err);
						if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
							res.render('CommunityPanel',{role:req.session.role,pId:updata[0].picId,name:updata[0].name,community1 : data1,community2 : data2,community3 : data3,community4 : data4});
						else
							res.redirect('/');
					});
				});
			});
		});
	});
});

router.get('/communityList',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		if(req.session.role=='Superadmin'||req.session.role=='Admin')
			res.render('CommunityList',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
		else
			res.redirect('/');
	});
});

router.get('/AddCommunity',auth,(req,res,next)=>{
	if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='Community Builder')
	{
		user.getUserByEmail(req.session.userName,(err,updata)=>{
			if(err)
			{
				res.send(err);
			}
			res.render('AddCommunity',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
		});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/list',auth,(req,res,next)=>{
	if(req.session.role=='Admin'||req.session.role=='Superadmin')
		res.redirect('/community/communityList');
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
			res.render('SearchList',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
		else
			res.redirect('/');
	});
});

router.get('/editcommunity/:id',auth,(req,res,next)=>{
    community.getCommunityById(req.params.id,(err,data)=>{
        if(err)
            res.send(err);
        user.getUserByEmail(req.session.userName,(err,updata)=>{
			if(err)
			{
				res.send(err);
			}
            if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
            {
                if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
                    res.render('EditCommunity',{role:req.session.role,pId:updata[0].picId,name:updata[0].name,commdata:data});
                else
                    res.redirect('/');
            }
            else
                res.redirect('/');
        });
    });
});

router.get('/discussion/:id',auth,(req,res,next)=>{
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data[0].activity=='Active')
		{
			user.getUserByEmail(req.session.userName,(err,updata)=>{
				if(err)
				{
					res.send(err);
				}
				comment.getCommentById(data[0]._id,(err,chats)=>{
					if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
					{
						if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
						{
							res.render('CommunityDiscussion',{role1:req.session.role,uId:updata[0]._id,role:'owner',pId:updata[0].picId,name:updata[0].name,community:data,chat:chats});
						}
						else if(data[0].members.some(el=>el.user==req.session.userName))
						{
							res.render('CommunityDiscussion',{role1:req.session.role,uId:updata[0]._id,role:'member',pId:updata[0].picId,name:updata[0].name,community:data,chat:chats});
						}
					}
					else
						res.redirect('/');
				});
			});
		}
		else
		{
			res.sendFile('brokenCommunity.html',{root: './public'});
		}
	});
});

router.get('/managecommunity/:id',auth,(req,res,next)=>{
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data[0].activity=='Active')
		{
			user.getUserByEmail(req.session.userName,(err,updata)=>{
				if(err)
				{
					res.send(err);
				}
				if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
				{
					if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
						res.render('ManageCommunity',{role1:req.session.role,role:'owner',pId:updata[0].picId,name:updata[0].name,community : data});
					else
						res.redirect('/');
				}
				else
					res.redirect('/');
			});
		}
		else
		{
			res.sendFile('brokenCommunity.html',{root: './public'});
		}
	});
});

router.get('/inviteusers/:id',auth,(req,res,next)=>{
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data[0].activity=='Active')
		{
			user.getUserByEmail(req.session.userName,(err,updata)=>{
				if(err)
				{
					res.send(err);
				}
				if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
				{
					if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
						res.render('InviteUsers',{role1:req.session.role,role:'owner',pId:updata[0].picId,name:updata[0].name,community : data});
					else
						res.redirect('/');
				}
				else
					res.redirect('/');
			});
		}
		else
		{
			res.sendFile('brokenCommunity.html',{root: './public'});
		}
	});
});

router.get('/communityprofile/:id',auth,(req,res,next)=>{
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data[0].activity=='Active')
		{
			user.getUserByEmail(req.session.userName,(err,updata)=>{
				if(err)
				{
					res.send(err);
				}
				comment.getGlobalFeatured(req.params.id,(err,com)=>{
					if(err)
						res.send(err);
					if(data[0].members.some(el=>el.user==req.session.userName))
					{
						if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
							res.render('CommunityProfile',{role1:req.session.role,role:'member',pId:updata[0].picId,name:updata[0].name,community : data,chat : com});
						else
							res.redirect('/');
					}
					else if(data[0].request.some(el=>el.user==req.session.userName)||data[0].invited.some(el=>el.user==req.session.userName))
					{
						if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
							res.render('CommunityProfile',{role1:req.session.role,role:'pending',pId:updata[0].picId,name:updata[0].name,community : data,chat : com});
						else
							res.redirect('/');
					}
					else if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
					{
						if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
							res.render('CommunityProfile',{role1:req.session.role,role:'owner',pId:updata[0].picId,name:updata[0].name,community : data,chat : com});
						else
							res.redirect('/');
					}
					else
					{
						if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
							res.render('CommunityProfile',{role1:req.session.role,role:"",pId:updata[0].picId,name:updata[0].name,community : data,chat : com});
						else
							res.redirect('/');
					}
				});
			});
		}
		else
		{
			res.sendFile('brokenCommunity.html',{root: './public'});
		}
	});
});

router.get('/communitymembers/:id',auth,(req,res,next)=>{
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data[0].activity=='Active')
		{
			user.getUserByEmail(req.session.userName,(err,updata)=>{
				if(err)
				{
					res.send(err);
				}
				if(data[0].owner.user==req.session.userName||data[0].admin.some(el=>el.user==req.session.userName))
				{
					if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
						res.render('CommunityMembers',{role1:req.session.role,role:'owner',pId:updata[0].picId,name:updata[0].name,community : data});
					else
						res.redirect('/');
				}
				else if(data[0].members.some(el=>el.user==req.session.userName))
				{
					if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
						res.render('CommunityMembers',{role1:req.session.role,role:'member',pId:updata[0].picId,name:updata[0].name,community : data});
					else
						res.redirect('/');
				}
				else
					res.redirect('/');
			});
		}
		else
		{
			res.sendFile('brokenCommunity.html',{root: './public'});
		}
	});
});

module.exports=router;
