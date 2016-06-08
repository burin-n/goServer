var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var multer = require('multer');
module.exports = function(){
	
	var app = express();
	
	// setting environment ---------------------------------------

	if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));
	else if(process.env.NODE_ENV ==='common') app.use(morgan('common'));
	else app.use(compression);

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	// setting environment ---------------------------------------


	require('../routes/picture.routes')(app);
	require('../routes/event.routes')(app);
	require('../routes/channel.routes')(app);
	require('../routes/search.routes')(app);
	require('../routes/login.routes')(app);
	return app;
}	