var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  	service: 'gmail',
  	auth:{
    	user: 'vikrantkumar158@gmail.com',
    	pass: '************************'
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
