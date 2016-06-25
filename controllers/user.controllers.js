var User = require('mongoose').model('User');

exports.getUser= function(request,response){
	var id = request.body.id;
	User.findById(id,function(err,user){
		if(err) return next(err);
		else{
			var data={};
			request.body.fields.forEach(function(field){
				data[field] = user.facebookData[field];
			});
			response.json(data);
		}
	});
}

exports.postUser = function(request,response){
	var newUser = new User();
	newUser.facebookData = request.body;
	newUser.name = request.body.first_name+' '+request.body.lastname;	
	newUser.save(function(err,newU){
		if(err) return next(err);
		else response.status(201).send(newU.id);
	});
}