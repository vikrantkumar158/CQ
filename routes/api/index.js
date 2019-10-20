var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');

router.use(session({
	secret: "xYzUCAchitkara",
	resave: true,
	saveUninitialized: true
}));

var auth=require('../.././Middlewares/auth');
var user=require('../.././Controllers/user');
var multer=require('../.././Middlewares/multer');
var mail=require('../.././Middlewares/nodemailer');
var community=require('../.././Controllers/community');
var reply=require('../.././Controllers/reply');
var tag=require('../.././Controllers/tag');
var comment=require('../.././Controllers/comment');

router.get('/logout',(req,res,next)=>{
	req.session.destroy();
	res.redirect('/');
});

router.get('/',(req,res,next)=>{
	if(req.session.isLogin)
	{
		if(req.session.role=='Admin'||req.session.role=='Superadmin')
			res.redirect('/admin/profile');
		else
			res.redirect('/community/communitypanel');
	}
	else
	{
		res.redirect('/login.html');
	}
});

router.get('/profile',auth,(req,res,next)=>{
	if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
	{
		user.getUserByEmail(req.session.userName,(err,updata)=>{
			if(err)
				res.send({'msg':err});
			res.render('Profile',{role:req.session.role,pId:updata[0].picId,name:updata[0].name,data:updata});
		});
	}
	else if(req.session.role=='Admin'||req.session.role=='Superadmin')
		res.redirect('/admin/profile');
});

router.get('/editProfile',auth,(req,res,next)=>{
	if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
	{
		user.getUserByEmail(req.session.userName,(err,updata)=>{
			if(err)
				res.send(err);
			res.render('EditProfile',{role:req.session.role,pId:updata[0].picId,name:updata[0].name,data:updata});
		});
	}
	else
		res.redirect('/');
});

router.get('/editInformation',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
			res.send(err);
		res.render('EditInformation',{pId:updata[0].picId,name:updata[0].name,data : updata});
	});
});

router.get('/tag/tagslist',auth,(req,res,next)=>{
	tag.getTags((err,data)=>{
		if(err)
		{
			res.send(err);
		}
		user.getUserByEmail(req.session.userName,(err,updata)=>{
			if(err)
				res.send(err);
			if(req.session.role=='Superadmin')
				res.render('TagList',{pId:updata[0].picId,name:updata[0].name,tag : data});
			else
				res.redirect('/');
		});
	});
});

router.get('/viewprofile/:id',auth,(req,res,next)=>{
	user.getUserById(req.params.id,(err,updata)=>{
        if(req.session.role=='UAdmin'||req.session.role=='USuperadmin'||req.session.role=='User'||req.session.role=='Community Builder')
        {
            if(updata[0].email==req.session.userName)
                res.render('ViewProfile',{role:req.session.role,x:'1',pId:updata[0].picId,name:updata[0].name,data:updata})
            else
                res.render('ViewProfile',{role:req.session.role,x:'0',pId:updata[0].picId,name:updata[0].name,data:updata})
        }
        else
            res.redirect('/')
    }); 
});

router.get('/tag',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
			res.send(err);
		res.render('Tag',{pId:updata[0].picId,name:updata[0].name});
	});
});

router.get('/changePassword',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		res.render('ChangePassword',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
	});
});

router.get('/getUsers',(req,res,next)=>{
	user.getUsers((err,data)=>{
		if(err)
			res.status(400).send(err);
		res.send(data);
	})
});

router.get('/getComments/:id',(req,res,next)=>{
	reply.getReplyById(req.params.id,(err,data)=>{
		if(err)
			res.status(400).send(err);
		else
			res.send(data);
	});
});

router.get('/img/:id',(req,res,next)=>{
	user.getUserById(req.params.id,(err,data)=>{
		res.set("Content-Type","multipart/form-data");
		res.redirect("/image/"+data[0].picId);
	});
});

router.post('/getInviteList/:id',(req,res,next)=>{
	var fin={email :new RegExp('^'+req.body.search+'.*$', "i")};
	community.getCommunityById(req.params.id,(err,data)=>{
		if(err)
			res.status(400).send(err);
		else
		{
			var arr=[];
			arr.push(data[0].owner.user);
			data[0].members.forEach((obj)=>{
				arr.push(obj.user)
			});
			data[0].request.forEach((obj)=>{
				arr.push(obj.user)
			});
			data[0].admin.forEach((obj)=>{
				arr.push(obj.user)
			});
			data[0].invited.forEach((obj)=>{
				arr.push(obj.user)
			});
			user.getInvitees(fin,arr,(err,data)=>{
				if(err)
					res.status(400).send(err);
				else
					res.send(data);
			});
		}
	});
});

router.put('/changePass',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
		if(err)
			res.status(400).send(err);
		if(data.length!=0&&bcrypt.compareSync(req.body.oldPassword,data[0].password))
		{
			user.changePassword(req.session.userName,req.body.newPassword,(err,data)=>{
				if(err)
					res.send(err);
				req.session.destroy();
				res.send(data);
			});
		}
		else
			res.send("[]");
	})
});

router.put('/deleteUser',(req,res,next)=>{
	user.deleteUser(req.session.userName,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		req.session.destroy();
		res.send(data);
	});
});

router.put('/activation',(req,res,next)=>{
	if(req.body.email==req.session.userName&&req.body.activity=='Inactive')
		req.session.destroy();
	user.activation(req.body.email,req.body.activity,(err,data)=>{
		if(err)
			res.send(err);
		res.send(data);
	});
});

router.put('/updateCommunity',(req,res,next)=>{
	community.activation(req.body,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		res.send(data);
	});
});

router.put('/updateUser',(req,res,next)=>{
	if(req.body.email==req.body.oldUser)
	{
		user.update(req.body,(err,data)=>{
			if(err)
			{
				res.send(err);
			}
			res.send(data);
		});
	}
	else
	{
		user.getUserByEmail((req.body.email),(err,data)=>{
			if(data.length==0)
			{
				if(req.body.oldUser==req.session.userName)
					req.session.destroy();
				user.update(req.body,(err,udata)=>{
					if(err)
						res.send(err);
					res.send(udata);
				});
			}
			else
			{
				res.send("[]");
			}
		});
	}
});

router.put('/deleteChat/:id',(req,res,next)=>{
	comment.delete(req.params.id,(err,data)=>{
		if(err)	
			res.send(err);
		res.send(data);
	});
});

router.post('/updateByOwner/:id',(req,res,next)=>{
    multer.upload(req,res,(err)=>{
        if (err){ 
            res.send({ 'msg': err});
        }else{
        	community.update(req,(err,data)=>{
        		if(err)
        			res.send(err);
        		res.redirect('/community/communityprofile/'+req.params.id);
        	});
        }
    });
});

router.put('/directJoin',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
		if(err)
			res.send(err);
		community.addMember(req.body.cname,data,(err,udata)=>{
			if(err)
				res.send(err);
			res.send(udata)
		});
	});
});

router.put('/indirectJoin',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
		if(err)
			res.send(err);
		community.addRequest(req.body.cname,data,(err,udata)=>{
			if(err)
				res.send(err);
			res.send(udata)
		});
	});
});

router.put('/invite/:cid/:id',(req,res,next)=>{
	user.getUserById(req.params.id,(err,data)=>{
		if(err)
			res.send(err);
		community.addInvite(req.params.cid,data,(err,udata)=>{
			if(err)
				res.send(err);
			res.send(udata)
		});
	});
});

router.put('/CSVInvite/:cid/:id',(req,res,next)=>{
	var newUserDetails=new userDetails({
		name: "N/A",
		email: req.params.id,
		password: bcrypt.hashSync("qwerty", 10),
		city: "N/A",
		phoneno: "N/A", 
		gender: "Male",
		dob: "01/01/1970",
		role: "User",
		status: "Pending",
		activity: "Active",
		PI1: "",
		PI2: "",
		PI3: "",
		delob: "-1",
        picId: "defaultProfilePic"
	});
	user.getUserByEmail(req.params.id,(err,data)=>{
		if(err)
			res.send(err);
		if(data.length==0)
		{
			newUserDetails.save()
			.then(savedData => {
				var mailOptions={
				 	from: 'vikrantkumar158@gmail.com',
				  	to: req.body.email,
				  	subject: 'Invitation to CQ',
				  	text: 'You are invited to join our new platform CQ. Username: '+req.params.id+' Password: qwerty'
				};
				communityDetails.updateOne(
				{_id: ObjectId(req.params.cid)},
				{$push: {invited:{UID:savedData._id,user:savedData.email,name:savedData.name}}}
				).exec(function(err,udata){
					if(err)
						res.send(err);
					transporter.sendMail(mailOptions, function(error, info){
						if (error){
							res.send(error);
						}
						else {
							console.log('Email sent: '+info.response);
							res.send(udata);
					  	}
					});
				});
			})
			.catch(err => {
				res.status(400).send(error);
			});
		}
		else
		{
			community.addInvite(req.params.cid,data,(err,udata)=>{
				if(err)
					res.send(err);
				res.send(udata)
			});
		}
	});
});

router.put('/removeRequest',(req,res,next)=>{
	community.removeRequest(req.body.id,req.session.userName,(err,data)=>{
        if(err)
            res.send(err);
        res.send(data);
    });
});

router.put('/removeInviteRequest',(req,res,next)=>{
	community.removeInvite(req.body.id,req.session.userName,(err,data)=>{
        if(err)
            res.send(err);
        res.send(data);
    });
});

router.put('/removeInvitation',(req,res,next)=>{
	community.removeInvitation(req.body.cid,req.body.id,(err,data)=>{
        if(err)
            res.send(err);
        res.send(data);
    });
});

router.put('/leaveCommunity',(req,res,next)=>{
	community.removeMember(req.body.cname,req.session.userName,(err,data)=>{
        if(err)
            res.send(err);
        res.send(data);
    });
});

router.put("/acceptRequest",(req,res,next)=>{
	user.getUserById(req.body.id,(err,data)=>{
        if(err)
            res.send(err);
        community.acceptRequest(req.body.cid,data,(err,info)=>{
            if(err)
                res.send(err);
            res.send(info);
        });
    });
});

router.put("/acceptInvitation",(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
        if(err)
            res.send(err);
        community.acceptInvitation(req.body.cid,data,(err,info)=>{
            if(err)
                res.send(err);
            res.send(info);
        });
    });
});

router.put("/upgradeUser",(req,res,next)=>{
	user.getUserById(req.body.ID,(err,data)=>{
        if(err)
            res.send(err);
        community.makeAdmin(req.body.cid,data,(err,info)=>{
            if(err)
                res.send(err);
            res.send(info);
        });
    });
});

router.put("/removeUser",(req,res,next)=>{
	community.removeMemberById(req.body.cid,req.body.ID,(err,info)=>{
        if(err)
            res.send(err);
        res.send(info);
    });
});

router.put("/downgradeAdmin",(req,res,next)=>{
	user.getUserById(req.body.ID,(err,data)=>{
        if(err)
            res.send(err);
        community.makeMember(req.body.cid,data,(err,info)=>{
            if(err)
                res.send(err);
            res.send(info);
        });
    });
});

router.put("/removeAdmin",(req,res,next)=>{
	community.removeAdmin(req.body.cid,req.body.ID,(err,info)=>{
        if(err)
            res.send(err);
        res.send(info);
    });
});

router.put("/rejectRequest",(req,res,next)=>{
	user.getUserById(req.body.id,(err,data)=>{
        if(err)
            res.send(err);
        community.removeRequestById(req.body.cid,req.body.id,(err,info)=>{
            if(err)
                res.send(err);
            res.send(info);
        });
    });
});

router.put("/deleteReply/:id",(req,res,next)=>{
	reply.deleteReply(req.params.id,(err,info)=>{
		if(err)
			res.send(err);
		comment.increaseCount(info[0].pId,-1,(err,info)=>{
			if(err)
				res.send(err);
			res.send(info);
		});	
	});
});

router.put("/deleteReplyReply/:id",(req,res,next)=>{
	reply.deleteReply(req.params.id,(err,info)=>{
		if(err)
			res.send(err);
		reply.increaseCount(info[0].pId,-1,(err,info)=>{
			if(err)
				res.send(err);
			res.send(info);
		});	
	});
});

router.put('/feature/:id',(req,res,next)=>{
	comment.feature(req.params.id,req.body.type=="Feature",(err,data)=>{
		if(err)
			res.send(err);
		res.send(data);
	});
});

router.put('/publish/:id',(req,res,next)=>{
	comment.global(req.params.id,req.body.type=="PublishtoCQ",(err,data)=>{
		if(err)
			res.send(err);
		res.send(data);
	});
});

router.post('/getComm',(req,res,next)=>
{
	var fin={name :new RegExp('^'+req.body.search_value+'.*$', "i")};
	community.showCommunities(fin,req.session.userName,req.body.skip,req.body.limit,(err,data)=>{
		if(err)
			res.send(err);
		res.send(data);
	});
});

router.post('/addUsers',(req,res,next)=>
{
	user.getUserByEmail(req.body.email,(err,data)=>{
		if(err)
			res.send(err);
		if(data.length==0)
		{
			user.addUser(req.body,bcrypt.hashSync(req.body.password,10),(err,data)=>{
				if(err)
					res.send(err);
				var mailOptions={
		 			from: 'vikrantkumar158@gmail.com',
		  			to: req.body.email,
		  			subject: 'Invitation to CQ',
		  			text: 'You are invited to join our new platform CQ. Username: '+req.body.email+' Password: '+req.body.password
				};
				mail.sendMail(mailOptions,(error, info)=>{
					if (error)
						res.send(error);
					console.log('Email sent: '+info.response);
					res.send(data);
				});
			});
		}
		else
		{
			res.send(data);
		}
    });
});

router.post('/users',(req,res,next)=>{
	var tCount,fCount;
	var size=parseInt(req.body.length);
	var start=parseInt(req.body.start);
	var serby=req.body.columns[parseInt(req.body.order[0].column)].name.toString();
	var ser=req.body.search.value;
	var sRole=req.body.role;
	var sStatus=req.body.status;
	user.getCount({},(err,totalCount)=>{
		if(err)
			res.send(err);
		tCount=totalCount;
	});
	var fin={email :new RegExp('^'+ser+'.*$', "i"),role : new RegExp('^'+sRole+'.*$', "i"),status : new RegExp('^'+sStatus+'.*$', "i")};
	user.getCount(fin,(err,totalCount)=>{
		if(err)
			res.send(err);
		fCount=totalCount;
	});
	if(serby=='email')
	{	
		var obj={'email':req.body.order[0].dir};
	}
	else if(serby=='phoneno')
	{	
		var obj={'phoneno':req.body.order[0].dir};
	}
	else if(serby=='city')
	{	
		var obj={'city':req.body.order[0].dir};
	}
	else if(serby=='status')
	{	
		var obj={'status':req.body.order[0].dir};
	}
	else
	{	
		var obj={'role':req.body.order[0].dir};
	}
	user.getUserByDemand(fin,start,obj,size,(err,data)=>{
		if(err)
			res.send(err);
		var totalPages=Math.ceil(fCount/size);
		res.send({pageLength:size,recordsTotal:tCount,recordsFiltered:fCount,data: data});
	});
});

router.post('/addChat/:id',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
	    multer.upload(req,res,(err)=>{
	        if (err){ 
	            res.send({ 'msg': err});
	        }else{
	        	comment.addComment(req,data,(err,savedData)=>{
	        		if(err)
	        			res.status(400).send(err);
	        		res.send(savedData);
	        	});
	        }
	    });
	});
});

router.post('/addReply/:id',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
		if(err)
			res.status(400).send(err);
		reply.addReply(req,data,(err,savedData)=>{
			if(err)
				res.status(400).send(err);
			comment.increaseCount(req.params.id,1,(err,data)=>{
				if(err)
					res.status(400).send(error);
				res.send(savedData);		
			});
		});
	});
});

router.post('/addReplyReply/:id',(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,data)=>{
		if(err)
			res.status(400).send(err);
		reply.addReply(req,data,(err,savedData)=>{
			if(err)
				res.status(400).send(err);
			reply.increaseCount(req.params.id,1,(err,data)=>{
				if(err)
					res.status(400).send(error);
				res.send(savedData);		
			});
		});
	});
});

router.post('/communities',(req,res,next)=>{
	var tCount,fCount;
	var size=parseInt(req.body.length);
	var start=parseInt(req.body.start);
	var serby=req.body.columns[parseInt(req.body.order[0].column)].name.toString();
	var ser=req.body.search.value;
	var sStatus=req.body.status;

	community.getCount({},(err,totalCount)=>
	{
		if(err)
			res.send(err);
		tCount=totalCount;
	});
	var fin={name :new RegExp('^'+ser+'.*$', "i"),membershipRule : new RegExp('^'+sStatus+'.*$', "i")};
	community.getCount(fin,(err,totalCount)=>
	{
		if(err)
			res.send(err);
		fCount=totalCount;
	});
	if(serby=='name')
	{	
		var obj={'name':req.body.order[0].dir};
	}
	else if(serby=='location')
	{	
		var obj={'location':req.body.order[0].dir};
	}
	else if(serby=='owner')
	{	
		var obj={'owner.name':req.body.order[0].dir};
	}
	else
	{	
		var obj={'createDate':req.body.order[0].dir};
	}
	community.getCommunityByDemand(fin,start,obj,size,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		var totalPages=Math.ceil(fCount/size);
		res.send({pageLength:size,recordsTotal:tCount,recordsFiltered:fCount,data: data});
	});
});

router.post('/sendMail',(req,res,next)=>{
	var mailOptions={
		from: 'vikrantkumar158@gmail.com',
		to: req.body.id,
		subject: req.body.subject,
		html: req.body.text
	};
	mail.sendMail(mailOptions,(error, info)=>{
		if (error)
			res.send(error);
		res.send("success");
	});
});

router.post('/addTag',(req,res,next)=>
{
	tag.getTagByName(req.body.tagName,(err,data)=>{
		if(err)
			res.send(err);
		if(data.length==0)
		{
			tag.addTag(req.body,req.session.role,(err,savedData)=>{
				if(err)
					res.status(400).send(error);
				res.send(data);
			});
		}
		else
		{
			res.send(data);
		}
	});
});

router.post('/getCommMem/:id',(req,res,next)=>{
    community.getCommunityById(req.params.id,(err,data)=>{
        if(err)
            res.send(err);
        else
            res.send(data);
    });
});

router.post('/addComm',(req,res,next)=>
{
	user.getUserByEmail(req.session.userName,(error,data)=>{
    	if(error)
    		res.send(error);
		multer.upload(req,res,(err)=>{
		    if (err){ 
		        res.send({ 'msg': err});
		    }else{
		    	community.addCommunity(req,data,(err,savedData)=>{
		    		if(err)
		    			res.send(err);
		    		res.redirect('/community/addCommunity');
		    	});
		    }
		});
	});
});

router.post('/login',(req,res,next)=>{
	user.getUserByEmail(req.body.userName,(err,data)=>{
		if(err)
		{
			res.send(err);
		}
		if(data.length==0)
			res.send(data);
		else
		{
			if(!bcrypt.compareSync(req.body.passWord,data[0].password))
			{
				res.send([]);
			}
			else
			{
				if((data[0].delob=='1'||data[0].activity=='Inactive')&&data[0].role!='Superadmin')
				{
					req.session.isLogin=2;
					req.session.userName=req.body.userName;
					req.session.role=data[0].role;
					res.send(data);
				}
				else if(data[0].delob=='-1')
				{
					req.session.isLogin=3;
					req.session.userName=req.body.userName;
					req.session.role=data[0].role;
					res.send(data);
				}	
				else
				{
					req.session.isLogin=1;
					req.session.userName=req.body.userName;
					req.session.role=data[0].role;
					res.send(data);
				}
			}
		}
    });
});

router.post('/updateProfile',(req,res,next)=>{
	multer.upload(req,res,(err)=>{
        if (err) 
            res.send({ 'msg': err});
        user.updateUser(req.body,req.file,(err,data)=>{
        	if(err)
				res.send(err);
			if(req.session.isLogin==3)
				req.session.isLogin=1;
			res.redirect('/profile');
        });
    });
});

router.delete('/deleteTag',(req,res,next)=>{
	tag.removeTag(req.body.tagName,(err,data)=>{
		if(err)
			res.send(err);
		res.send(data);
	});
});

module.exports=router;