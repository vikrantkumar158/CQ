var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  	service: 'gmail',
  	auth:{
    	user: 'vikrantkumar158@gmail.com',
    	pass: 'windowsvista8986761191$'
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
