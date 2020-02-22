var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  	service: 'gmail',
  	auth:{
    	user: process.env.user,
    	pass: process.env.pass
  	}
});

exports.sendMail = (mailOptions,cb)=>
{
	transporter.sendMail(mailOptions, function(error, info){
		if (error)
			cb(error);
		cb(null,info);
	});
}