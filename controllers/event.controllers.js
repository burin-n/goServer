var Event = require('mongoose').model('Event'); // collections
var Channel = require('mongoose').model('Channel');
var fs = require('fs');
var path = require('path');
var time = require('time');
var mkdirp = require('mkdirp');

//route /
exports.hi = function(request,response,next){
	response.send('hi');
}

//route /listall
exports.listAll = function(request,response,next){
	Event.find({},function(err,events){
		if(err) return next(err);
		else response.json(events);
	});
}

//route /event?id=...&stat=bool
exports.getEvent = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findById(id,function(err,event){
		if(err) return next(err);
		else if(!event){
			info.msg = "event not found";
			response.status(404).json(info);
		}
		else{
			var fields = ['title','about','video','channel','location','date_start','expire',
			'date_end','picture','picture_large','year_require','faculty_require','tags'];
			if(request.query.stat) fields.push(['visit']);
			for(var i=0; i<fields.length; i++){
				if(event[fields[i]] || fields[i]=='expire'){ // whreturn {msg:"done"/"error"}y ? field expire?
					
					if((fields[i]==='year_require'||fields[i]==='faculty_require')){
						if(event[fields[i]].length>0){
							info[fields[i]] = event[fields[i]];
						}
					}
					else{
						info[fields[i]] = event[fields[i]];
					}
				}
				if(i+1==fields.length) response.json(info);
			}
		}
	});
}

//route POST /event with req body
exports.postEvent = function(request,response,next){
	var d = new time.Date().setTimezone('Asia/Bangkok');
	var date = d.getMonth()+1 +'/'+d.getDate()+'/'+d.getFullYear();	
	var newEvent = new Event(request.body);
	var info = {};
	newEvent.visit_per_day.push({});	// keep stat visit per day as object
	newEvent.visit_per_day[0][date]=0;	// set defuat of created day as 0
	newEvent.save(function(err){		// save new event
		if(err){
			info.msg = "error";
			console.error("error at postEvent : event.controllers");
			response.json(info);
			return next(err);	
		} 
		else{ 
			var channelId = newEvent.channel;
			var condition = {$push:{}};				// condition for update channel
			condition.$push.events = newEvent._id;	// push newEvent id to channel events field
			Channel.findByIdAndUpdate(channelId,condition,function(err,channel){
				if(err){
					info.msg = "error1";
					console.error("error1 : postEvent - event.controllers");
					response.json(info);
					return next(err);	
				} 
				else if(!channel){
					info.msg = "channel not found";
					console.error("channel not found : postEvent - event.controllers");
					response.status(404).json(info);
				}
				else{
					info.id = newEvent._id;
					console.log("post new Event");
					response.status(201).json(info);
				}
			});
		}
	});
}

// route PUT /event?id=... with req body
exports.putEvent = function(request,response,next){
	var id = request.query.id;
	var info = {msg:"done"};
	Event.findByIdAndUpdate(id,{
		$set:request.body,						// update body
		$currentDate:{lastModified:"Date"}		// update lastModified
	},function(err,updatedEvent){
		if(err){
			info.msg = "error";
			response.json(info);
			console.error("error : putEvent - event.controllers")
			return next(err);
		}
		else if(!updatedEvent){
			info.msg = "event not found";
			console.error("event not found : putEvent - event.controllers");
			response.status(404).json(info);
		}
		else response.json(info);
	});
}

// route DELETE /event?id=...
// call from deleteEvent
var updateDeleteEventToChannel = function(channelId,eventId,response){
	var info = {msg:"done"};
	Channel.findById(channelId,function(err,channel){
		if(err){
			info.msg = 'error1';
			console.error("error1 : updateDeleteEventToChannel - event.controllers");
			response.json(info);
			return next(err);
		}
		else if(!channel){
			info.msg = "channel not found";
			console.error("error2 : updateDeleteEventToChannel - event.controllers");
			response.status(404).json(info);
		}
		else{	// move deleted event to bin array
			channel.events_bin.push(eventId);
			channel.events.splice(channel.events.indexOf(eventId),1);
			channel.update(channel,function(err){
				if(err){
					info.msg = "error3";
					response.json(msg);
					console.error("error3 : updateDeleteEventToChannel - event.controllers");
					return next(err);
				}
				else response.json(info);
			});
		}
	});
}

//route DELETE /event?id=...
exports.deleteEvent = function(request,response,next){
	var id = request.query.id;
	var info = {msg:"done"};
	Event.findByIdAndUpdate(id,{
		tokenDelete:true,		// set tokenDelete
		lastModified:Date()		// update lastModified
	},function(err,event){
		if (err){
			info.msg = "error";
			console.error("error : deleteEvent - event.controllers");
			response.json(info);
			return next(err);
		}
		else if(!event){
			info.msg = 'event not found';
			console.error("event not found : deleteEvent - event.controllers");
			response.json(info);
		}
		else updateDeleteEventToChannel(event.channel,id,response);
	});
}

//route GET /event/stat?id=...
exports.getStat = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findById(id,function(err,event){
		if(err){
			info.msg = "error";
			console.error("error find event: getStat - event.controllers");
			response.json(info);
			return next(err);
		}
		else{
			if(!event){
				info.msg = "event not found";
				response.status(404).json(info);
			}
			else{
				var fields = ['visit','visit_per_day'];
				for(var i=0;i<fields.length;i++){
					info[fields[i]]=event[fields[i]];
				}
				response.json(info);
			}
		}
	});
}

//route PUT /event/stat?id=...
exports.putStat = function(request,response,next){
	var id = request.query.id;
	var d = new time.Date().setTimezone('Asia/Bangkok');
	var date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	var info={};
	Event.findById(id,function(err,event){
		if(err){
			info.msg = "error";
			response.json(info);
			console.error("error find event : putStat - event.controllers");
			return next(err);
		}
		else if(!event){
			info.msg = "event not found";
			response.status(404).json(info);
		}
		else{
			event.lastModified = d;
			event.visit+=1;								//add visit
			if(event.visit_per_day.length==0){			//add object to empty array
				event.visit_per_day.push({});
				event.visit_per_day[0][date]=1;
			}
			// add date for the first visit for the day
			else if(!event.visit_per_day[event.visit_per_day.length-1].hasOwnProperty(date)){
				event.visit_per_day.push({});
				event.visit_per_day[event.visit_per_day.length-1][date]=1;
			}
			// add visit_per_day
			else event.visit_per_day[event.visit_per_day.length-1][date]+=1;
			
			event.update(event,function(err){
				if(err){
					info.msg = "error1";
					response.json(info);
					console.error("error1 update event : putStat - event.controllers");
					return next(err);
				}
				else{
					info.msg = "done";
					resposne.json(info);
				}
			});
		}
	});
}

//route DELETE /event/clear?id=...
//use in test, delte event from database
exports.clear = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findByIdAndRemove(id,function(err,event){
		if(err) {
			info.msg = "error";
			response.json(info);
			console.error("error find&removed event : clear - event.controllers");
			return next(err);
		}
		else { // callback hell oh no!
			Channel.findById(event.channel,function(err,channel){
				if(err) {
					info.msg = "error1";
					response.json(info);
					console.error("error find channel : clear - event.controllers");
					return next(err);
				}
				else if(!channel){
					info.msg = "channel not found";
					response.json(info);
					console.error("channel not found : clear - event.controllers");
				}
				else{
					channel.events.splice(channel.events.indexOf(id),1);
					channel.update(channel,function(err){
						if(err) {
							info.msg = "error2";
							response.json(info);
							console.error("error update channel : clear - event.controllers");
							return next(err);
						}
						else{
							info.removed = id;
							response.json(info);
						}
					});
				}
			});
		}
	});
}

//route GET /event/new(optional)?top=...
exports.newEvent = function(request,response,next){
	//tokenDelete must not be true
	var info={};
	Event.find({tokenDelete:{$ne:true}},function(err,events){
		if(err){
			info.msg = "error";
			console.error("error find event : newEvent - event.controllers");
			return next(err);
		}
		else {
			var info.events = [];
			var fields = ['_id','title','picture','location','date_time'] ;
			var index = 0;
			var terminator = (request.query.top) ? (Math.max(0,events.length-request.query.top)) : 0;
			for(var j=events.length-1; j>=terminator;j--){
				info.events[index] = {};
				for(var i=0; i<fields.length; i++){
					info[index][fields[i]] = events[j][fields[i]];
				}
				index++;
			}
			response.json(info);
		}
	});
}

//route GET /update/perday
//set expire if it's out of active date
exports.updateStatperDay = function(request,response,next){
 	var d = new time.Date().setTimezone('Asia/Bangkok');
 	var cnt=0;
 	var info={};
 	Event.find({$and :[ {tokenDelete:{$ne:true}}, {expire:{$ne:true}} ]},function(err,events){
 		events.forEach(function(event){
			if(event.date_end.getTime()<d.getTime()){
				event.expire=true;
				event.update(event,function(err){
					if(err){
						info.msg = "error";
						response.json(info);
						console.error("error update event : updateStatperDay : event.controllers");
						return next(err);
					}
				});
			}
			if(++cnt===events.length){
				info.msg = "done";
				response.json(msg);
			}
		});	
	});
}

var checkhot = function(hot,event){
	if(!hot['first']) hot['first']=event;
	else if(event.momentum>=hot['first'].momentum){
		if(hot['second'])	hot['third'] = hot['second'];
		hot['second'] = hot['first'];
		hot['first'] = event;
	}
	else if(!hot['second'])	hot['second']=event;
	else if(event.momentum>=hot.second.momentum){
		hot['third'] = hot['second'];
		hot['second'] = event;
	}
	else if(!hot['third'] || event.momentum>=hot.third.momentum)	hot['third']=event;
	return hot;
}

//route /update/hot
exports.updatehotEvent = function(request,response,next){
 	var hot = {};
 	var t = new time.Date().setTimezone('Asia/Bangkok');
 	var d1 = new time.Date(t.getFullYear(),t.getMonth(),t.getDate()).setTimezone('Asia/Bangkok').getTime();
 	var d2 = d1-86400000;
 	var d3 = d2-86400000;

 	// all event that is not delete
 	Event.find({tokenDelete:{$ne:true}},function(err,events){
 		for(var i=0;i<events.length;i++){
 			events[i].momentum = 0;
 			var t = Math.max(0,events[i].visit_per_day.length-3);
 			for(var j=events[i].visit_per_day.length-1;j>=t;j--){
 				for(var key in events[i].visit_per_day[j]){
 					var date = new Date(key).getTime();
 					if( date === d1 || date === d2 || date === d3 )
 						events[i].momentum+=events[i].visit_per_day[j][key];
 					
	 				if(j == t){

			 			events[i].update(events[i],function(err){
			 				if(err) return next(err);
			 			});

			 			hot = checkhot(hot,events[i]);

			 			if(i+1==events.length){
					 		var field = ['_id','title','picture','momentum'];
					 		var result={};
					 		for(var key in hot){
					 			result[key] = {};
					 			for(var k=0;k<field.length;k++){
					 				result[key][field[k]] = hot[key][field[k]];
					 			}
					 		}
					 		mkdirp(path.join(__dirname,'../data/'),function(err){
						 		if(err) return next(err);
						 		else{
							 		fs.writeFile(path.join(__dirname,'../data/hotEvent.json'),
							 			JSON.stringify(result,null,2),function(err,data){
							 			if(err) return next(err);
							 			else response.send('done');
							 		});		
						 		}
					 		});
			 			}
	 				}
 				}
 			}

			if(events[i].visit_per_day.length==0){

 				hot = checkhot(hot,events[i]);
		 		if(i+1==events.length){
					var field = ['_id','title','picture','momentum'];
					var result={};
					for(var key in hot){
			 			result[key] = {};

			 			for(var k=0;k<field.length;k++){
			 				result[key][field[k]] = hot[key][field[k]];

			 			}
			 		}
			 		mkdirp(path.join(__dirname,'../data/'),function(err){
				 		if(err) return next(err);
				 		else{
					 		fs.writeFile(path.join(__dirname,'../data/hotEvent.json'),
					 			JSON.stringify(result,null,2),function(err,data){
					 			if(err) return next(err);
					 			else response.send('done');
					 		});		
				 		}
			 		});
	 			}				

 			} 	
		}

 	});
}


//route /event/hot
exports.gethotEvent = function(request,response,next){
	response.sendFile(path.join(__dirname,'../data/hotEvent.json'));
}



//route /event/search?keyword=...
exports.searchEvent = function(request,response,next){
	//$option i : case insensitive
	var info={};
	Event.find( {$and : [ {title: { $regex:request.query.keyword,$options:"i"}}, {tokenDelete:false}] } ,
		function(err,events){
			if(err){
				info.msg = "error";
				response.json(info);
				return next(err);	
			}
			else if(events.length==0){
				info.msg = "event not found";
				response.status(404).json(info);
			}
			else {
				var fields = ['_id','title','picture','channel','location','date_time'];
				var info.events = [];
				for(var j=0; j<events.length;j++){
					// add found event in array info.events
					info.events.push({});
					for(var i=0; i<fields.length; i++){
					 	info.events[j][fields[i]] = events[j][fields[i]];
					}
				}
				// info is {events:[ {},{},.. ]}
				response.json(info);
			}
	});
}

