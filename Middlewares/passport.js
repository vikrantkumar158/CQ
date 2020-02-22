var express=require('express');
var path = require('path');
var bcrypt = require('bcrypt');
var router=express.Router();

var mail=require('.././Middlewares/nodemailer');

var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

router.use(passport.initialize());
router.use(passport.session());

var mongoose = require('mongoose')
var userDetails = mongoose.model("userdetails");

passport.use(new GitHubStrategy({
		clientID: process.env.clientID,
		clientSecret: process.env.clientSecret,
		callbackURL: "https://code-quotient.herokuapp.com/auth/github/callback"
	},
	function(accessToken, refreshToken, profile, cb) {
		console.log("1");
		userDetails.find({ email: profile._json.email },
		function (err, user) {
			console.log("2");
			if(err)
				cb(err);
		if(user.length==0)
		{
			var newUserDetails=new userDetails({
				name: profile._json.name,
				email: profile._json.email,
				password: bcrypt.hashSync(profile._json.node_id.substring(0,8),10),
				city: profile._json.location,
				phoneno: "",
				gender: "Male",
				dob: "",
				role: "User",
				status: "Pending",
				activity: "Active",
				PI1: "",
				PI2: "",
				PI3: "",
				delob: "-1",
				picId: "defaultProfilePic"
			});
			newUserDetails.save()
			.then(savedData => {
				var mailOptions={
					from: process.env.user,
					to: savedData.email,
					subject: 'Invitation to CQ',
					text: 'Welcome to CQ. Username: '+savedData.email+' Password: '+profile._json.node_id.substring(0,8)+'. Please update your password on login.'
				};
				mail.sendMail(mailOptions, function(error, info){
					if (error){
						cb(error);
					}
					else {
						console.log('Email sent: '+info.response);
					}
				});
				user.push(newUserDetails);
				return cb(null,user);
			})
			.catch(err => {
				cb(err);
			});
		}
		else
			return cb(null,user);
	});
}));

passport.serializeUser((user,done)=>{
 	done(null, user);
});

passport.deserializeUser((user, done)=>{
  	done(null, user);
});

router.get('/github',passport.authenticate('github'));

router.get('/github/callback',passport.authenticate('github',{failureRedirect:'/'}),(req, res)=>{
	if(req.user.length!=0)
	{
		if((req.user[0].delob=='1'||req.user[0].activity=='Inactive')&&req.user[0].role!='Superadmin')
		{
			req.session.isLogin=2;
			req.session.userName=req.user[0].email;
			req.session.role=req.user[0].role;
		}
		else if(req.user[0].delob=='-1')
		{
			req.session.isLogin=3;
			req.session.userName=req.user[0].email;
			req.session.role=req.user[0].role;
		}
		else
		{
			req.session.isLogin=1;
			req.session.userName=req.user[0].email;
			req.session.role=req.user[0].role;
		}
	}
    res.redirect('/');
});

module.exports=router;
