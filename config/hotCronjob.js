var request = require('request');
var cronjob = require('cron').CronJob;

module.exports = function(){
	var job = new cronjob('00 30 * * * *',function(){
		request({
			uri: "http://188.166.190.3:1111/update/hot",
			method: "get"
		},function(error,response,body){
			console.log('hot:'+Date());
			console.log(body);
		});
	},null,true,'asia/bangkok');
	return job;

}
