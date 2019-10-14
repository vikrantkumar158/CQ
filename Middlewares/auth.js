module.exports=(req,res,next)=>{
	if(req.session.isLogin)
	{
		if(req.session.isLogin==3)
			res.redirect('/editInformation');
		else if(req.session.isLogin==2)
			res.redirect('/broken.html');
		else
			next();
	}
	else
		res.redirect('/');
}