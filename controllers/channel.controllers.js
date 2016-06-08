var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');

exports.listAll = function(request,response,next){
	Channel.find({},function(err,channel){
		if(err) return next(err);
		else response.json(channel);
	});
}

exports.getChannel = function(request,response){
	var id = request.query.id;
	Channel.findById(id,function(err,channel){
		if(err) return next(err);
		else if(!channel) response.status(404).send('channel not found');
		else{
			var info = {};
			var fields = ['name','verified','picture','picture_large','admins','events'];
			for(var i=0;i<fields.length;i++){
				if(channel[fields[i]]){
					if(fields[i]==='admins'||fields[i]==='events'){
						if(channel[fields[i]].length>0)
							info[fields[i]]=channel[fields[i]];
					}
					else
						info[fields[i]]=channel[fields[i]];						
				}
			}
			response.json(info);
		}
	});
}

exports.postChannel = function(request,response,next){
	var newChannel = new Channel(request.body);
	newChannel.save(function(err){
		if(err) return next(err);
		else response.status(201).send(newChannel._id);
	});
}

exports.putChannel = function(request,response,next){
	var id = request.query.id;
	Channel.findByIdAndUpdate(id,{
		$set:request.body,
		$currentDate:{lastModified:"Date"}
	},function(err,channel){
		if(err) return next(err);
		else if(!channel) response.status(404).send('channel not found');
		else response.send("done");
	});
}

exports.deleteChannel = function(request,response,next){
	var id = request.query.id;
	Channel.findByIdAndUpdate(id,{
		tokenDelete:true,
		lastModified:Date()
	},function(err,channel){
		if (err) return next(err);
		else {
			console.log(channel.events[0]);
			for(var i=0;i<channel.events.length;i++){
				Event.findByIdAndUpdate(channel.events[i],{
					tokenDelete:true,
					lastModified:Date()
				},function(err,event){
					if(err) return next(err);
					else if(!event) console.error('deleteChannel: event not found:'+channel.events[i]);
				});
			}
		}
		response.send('done');
	});
}

var calStat = function(channel,callback){
    var info={visited:0};
        Event.find({_id: {$in:channel.events}},function(err,events){
            if(err) return next(err);
            else if(events){
               	console.log(events);
                events.forEach(function(event){
                    info.visited += event.visited;
                	console.log('event.visited:'+event.visited);
                	console.log(info.visited);             
                });
                
                console.log(info);
                callback(info);
            }
        });
}


exports.getStat = function(request,response,next){
	var id = request.query.id;
	Channel.findById(id,function(err,channel){
		if(err) return next(err);
		else if(!channel) response.status(404).send('channel not found');
		else{
			 	calStat(channel,function(info){
				response.json(info);
			});
		}
	});
}

exports.clear = function(request,response,next){
	var id = request.query.id;
	Channel.findByIdAndRemove(id,function(err){
		if(err) return next(err);
		else response.send('removed:'+id);
		
	});
}

















