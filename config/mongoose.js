var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){
	mongoose.set('debug',config.debug);
	var db = mongoose.connect(config.mongoUri); // connect to database
	
	
	require('../models/event.model'); // create collection
	require('../models/channel.model');
	return db;
}