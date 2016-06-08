var request = require('request');
var cronjob = require('cron').CronJob;

module.exports = function(){
var job = new cronjob('00 00 00 * * *', function() {
		request({
			uri: "http://188.166.190.3:1111/update/perday",
		//	uri: "http://localhost:1111/update/perday",
			method: "get",
		}, function(error, response, body) {
		  console.log('perday:'+Date());
		  console.log(body);
		});
	}, null, true, 'asia/bangkok');
	return job;
}
