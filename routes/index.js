var express=require('express');
var router=express.Router();
var path = require('path');

router.use(express.static(path.join(__dirname,'.././public')));

router.use('/',require('./api/index'));
router.use('/admin',require('./api/admin'));
router.use('/community',require('./api/community'));
router.use('/auth',require('.././Middlewares/passport'));

module.exports=router;