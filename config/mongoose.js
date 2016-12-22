var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){
	mongoose.set('debug',config.debug);			// mode
	var db = mongoose.connect(config.mongoUri); // connect to database
	
	// create collection
	require('../models/event.model'); 
	require('../models/channel.model');
	require('../models/user.model');

	return db; // database with setting
}