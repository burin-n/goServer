
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');

exports.searchChannel = function(request,response,next){
	Channel.find({name : { $regex:request.query.keyword,$options:"i" }},
		function(err,channels){
			if(err) return next(err);
			else if(channels.length==0) response.status(404).send('channel not found');
			else {
				var fields = ['_id','name'];
				var info = [];
				var index = 0;
				for(var j=0; j<channels.length;j++){
					if(channels[j].tokenDelete) {continue;}
					info[index]={}
					for(var i=0; i<fields.length; i++){
					 	info[index][fields[i]] = channels[j][fields[i]];
					}
					index++;
				}
				response.json(info);
			}
	});
}

exports.searchEvent = function(request,response,next){
	Event.find( {title: { $regex:request.query.keyword,$options:"i"}} ,
		function(err,events){
			if(err) return next(err);
			else if(events.length==0) response.status(404).send('event not found');
			else {
				var fields = ['_id','title'];
				var info = [];
				var index = 0;
				for(var j=0; j<events.length;j++){
					if(events[j].tokenDelete) {continue;}
					info[index]={}
					for(var i=0; i<fields.length; i++){
					 	info[index][fields[i]] = events[j][fields[i]];
					}
					index++;
				}
				response.json(info);
			}
	});
}
