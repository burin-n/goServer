var request = require('request');
var cronjob = require('cron').CronJob;
var config = require('./config');

// update hot event every 24 hour	
module.exports = function(){ // return this function when this file is required
	var job = new cronjob('00 00 00 * * *',function(){	// repeat request every 24 hour
		request({
			uri:"http://"+config.IP+":"+config.PORT+"/update/hot",
			//uri: "http://188.166.190.3:1111/update/hot",
			method: "get"
		},function(error,response,body){
			console.log('hot:'+Date());
		});
	},null,true,'Asia/Bangkok');
	return job;

}
