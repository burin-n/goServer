var request = require('request');
var cronjob = require('cron').CronJob;
var config = require('./config');

// add new day to array field in every day
module.exports = function(){
	var job = new cronjob('00 00 00 * * *', function() {	// repeat request every 24 hours
		request({
			uri:"http://"+config.IP+":"+config.PORT+"/update/perday",
			//uri:"localhost:1111/update/perday",
			method: "get",
		}, function(error, response, body) {
		console.log('perday:'+Date()); 
		});
	}, null, true, 'Asia/Bangkok');
	return job;
}
