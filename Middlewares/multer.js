var multer=require('multer');

function sanitizeFile(file, cb) {
    let fileExts = ['png', 'jpg', 'jpeg', 'gif'];
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    let isAllowedMimeType = file.mimetype.startsWith("image/");
    if(isAllowedExt && isAllowedMimeType){
        return cb(null ,true);
    }
    else{
        cb('Error: File type not allowed!');
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/image')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ file.fieldname+'.'+file.originalname.split('.')[1].toLowerCase())
    }
});
   
exports.upload = multer({ storage: storage ,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }
}).single('profilePic');