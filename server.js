process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // default mode as development

var express= require('./config/express');
var mongoose = require('./config/mongoose'); 
var updateCj = require('./config/updateCronjob');
var hotCj = require('./config/hotCronjob');
var config = require('./config/config');


var db = mongoose();	// run database
var app = express();	// run server
var updateCronJob = updateCj();	// update stat per day
var hotCronJob = hotCj();		// update hot event per day 



app.listen(config.PORT,config.IP); // listen for server access
console.log("Server is running at port "+config.PORT);



