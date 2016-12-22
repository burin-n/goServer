var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');
module.exports = function(){ // return this function when require this file
	
	var app = express();	// create main express application
	
	// setting environment ---------------------------------------

	if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));
	else if(process.env.NODE_ENV ==='common') app.use(morgan('common'));
	else app.use(compression);

	app.use(bodyParser.urlencoded({	//*
		extended: true				//* probably format of output on debug on console ??
	}));							//* I'll figure out later
	app.use(bodyParser.json());		//* 	 
	app.use(cors());				// wtf is this
	// setting environment ---------------------------------------

	// require and run every route function
	require('../routes/picture.routes')(app);
	require('../routes/event.routes')(app);
	require('../routes/channel.routes')(app);
	require('../routes/tag.routes')(app);
	require('../routes/login.routes')(app);
	require('../routes/user.routes')(app);

	return app; // return express application with setting
}	