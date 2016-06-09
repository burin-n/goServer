var fs = require('fs');
var multer = require('multer');
var path = require('path');
var Event = require('mongoose').model('Event');
var Channel = require('mongoose').model('Channel');
var mkdirp = require('mkdirp');

exports.postPicture= function(request,response,next){
	
	dest = './pictures/'+request.query.field;
	
	dest += (request.query.size=='large') ? '/large' : '/small'; 
	mkdirp(dest,function(err){
		if(err) return next(err);
		else{
			var storage = multer.diskStorage({
				destination: function(request,file,callback){
					callback(null,dest);
				},
				filename: function(request,file,callback){
					callback(null,(Math.random()+1).toString(36).substring(7)+Date.now()+path.extname(file.originalname));
				}
			});
			var upload = multer({storage:storage}).single('picture');
			if(request.query.field=='event'){
				Event.findById(request.query.id,function(err,event){
					if(err) return next(err);
					else if(!event) response.send('event not found')
					else{
						upload(request,response,function(err){
						 	if(err) return next(err);
						 	else{
								url = 'http://188.166.190.3:1111/picture/'+request.file.filename+'?field='+request.query.field+'&size='+request.query.size;
								if(request.query.size=='small') event.picture = url;
								else event.picture_large.push(url);
								event.update(event,function(err){
									if(err) return next(err);
									else response.status(201).send('done');	
								});
							}
						});
					}
				});
			}
			else{
				Channel.findById(request.query.id,function(err,channel){
					if(err) return next(err);
					else if(!channel) response.send('channel not found');
					else{
						upload(request,response,function(err){
							if(err) return next(err);
							else{
								url = 'http://188.166.190.3:1111/picture/'+request.file.filename+'?field='+request.query.field+'&size='+request.query.size;
								if(request.query.size=='small')	channel['picture']=url
								else channel['picture_large']=url;
								channel.update(channel,function(err){
									if(err) return next(err);
									else response.status(201).send('done');	
								});	
							}
						});
					}
				});
			}
		}
	});
}


exports.getPicture = function(request,response){
	dest = '/../pictures/'+request.query.field+'/'+request.query.size;
	response.sendFile(path.join(__dirname,dest,request.params.name));
}

exports.deletePicture = function(request,response,next){
	var id = request.query.id;
	var tmppath = '/../pictures/'+request.query.field+'/'+request.query.size;
	var oldpath = path.join(__dirname,tmppath,request.params.name);
	var newpath = path.join(__dirname,'/../pictures/bin/',request.params.name);
	mkdirp(path.join(__dirname,'/../pictures/bin'),function(err){ 
		if(err) return next(err);
		else{
			Event.findById(request.query.id,function(err,event){
				if(err) return next(err);
				else if(!event) response.send('event not found');
				else{
					if(request.query.size=='small') event.picture=null;
					else event.picture_large.splice(event.picture_large.indexOf('http://188.166.190.3:1111/picture/'+request.params.name+'?field='+request.query.field+'&size='+request.query.size),1);
					event.update(event,function(err){
						if(err) return next(err);
						else{
							fs.rename(oldpath,newpath,function(err){
								if(err) return next(err);
								else{
									response.send('done');
								}
							});
						}
					});
				}
			});
		}
	});
}
