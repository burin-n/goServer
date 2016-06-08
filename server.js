process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express= require('./config/express');
var mongoose = require('./config/mongoose'); 
var updateCj = require('./config/updateCronjob');
var hotCj = require('./config/hotCronjob');



var db = mongoose();
var app = express();
var updateCronJob = updateCj();
var hotCronJob = hotCj();


app.listen(1111);

console.log("Server is running at port 1111")



