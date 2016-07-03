var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var Event = require('mongoose').model('Event');

exports.modifyTag = function(request,response){
	mkdirp(path.join(__dirname,'../data/'),function(err){
		if(err) return next(err);
		else{
			fs.writeFile(path.join(__dirname,'../data/tags.json'),JSON.stringify(request.body,null,2),function(err){
				if(err) return next(err);		
				else response.send('done');
			});
		}
	});
}


exports.getTags = function(request,response){
	var result = [];
	var data = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/tags.json')));
	data.tags.forEach(function(tag){
		result.push(tag);
	});
	response.send(result);

}

exports.searchTag = function(request,response,next){
        Event.find( { $and : [ {tags: {$in : request.body.keywords }}, {tokenDelete: false} ] },
                function(err,events){
                    if(err) return next(err);
                    else if(events.length==0) response.status(404).send('event not found');
                    else {
                            var fields = ['_id','title','picture','channel'];
                            var info = [];
                            for(var j=0; j<events.length;j++){
                                    info.push({});
                                    for(var i=0; i<fields.length; i++){
                                            info[j][fields[i]] = events[j][fields[i]];
                                    }
                            }
                            response.json(info);
                    }
        });
}