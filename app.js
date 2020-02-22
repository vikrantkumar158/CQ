var express = require('express')
var path = require('path');
var http = require('http');
var app = express();
var cors=require('cors')
var cors_proxy=require('cors-anywhere');
var port=8000;

var mongoose=require('mongoose');
var ejs = require('ejs');
var fs = require('fs');

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(require('./routes'));


var mongoDB='mongodb+srv://Vikrant:mongodb@1401@cluster0-qd890.mongodb.net/myDB';

mongoose.connect(mongoDB,{useNewUrlParser:true});

mongoose.connection.on('error',(err)=>{
	console.log('DB connection error');
});

mongoose.connection.on('connected',(err)=>{
	console.log('DB connected');
});

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(process.env.PORT || port,process.env.HOST||'127.0.0.1',()=>{console.log("Listening on port "+port);});