var express = require('express')
const router = express.Router();

var auth=require('../.././Middlewares/auth');
var user=require('../.././Controllers/user');

router.get('/profile',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		else
		{
			if(req.session.role=='Superadmin'||req.session.role=='Admin')
				res.render('AdminProfile',{role:req.session.role,pId:updata[0].picId,name:updata[0].name,data : updata});
			else
				res.redirect('/');
		}
	});
});

router.get('/switchAsUser',auth,(req,res,next)=>{
	if(req.session.role=='Admin'||req.session.role=='Superadmin')
	{
		req.session.role='U'+req.session.role;
		res.sendFile('loading.html',{root: './public'});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/switchAsAdmin',auth,(req,res,next)=>{
	if(req.session.role=='UAdmin'||req.session.role=='USuperadmin')
	{
		req.session.role=req.session.role.substring(1);
		res.sendFile('loading1.html',{root: './public'});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/userlist',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		if(req.session.role=='Superadmin'||req.session.role=='Admin')
			res.render('UserList',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
		else
			res.redirect('/');
	});
});

router.get('/adduser',auth,(req,res,next)=>{
	user.getUserByEmail(req.session.userName,(err,updata)=>{
		if(err)
		{
			res.send(err);
		}
		if(req.session.role=='Superadmin'||req.session.role=='Admin')
			res.render('AddUser',{role:req.session.role,pId:updata[0].picId,name:updata[0].name});
		else
			res.redirect('/');
	});
});

router.get('/getUsers',auth,(req,res)=>{
	user.getUsers((err,data)=>{
		if(err)
			res.status(400).send(err);
		res.send(data);
	})
});

module.exports=router;
