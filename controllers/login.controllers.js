

exports.login = function(request,response){
	if(request.body.username  === 'SGCU' && request.body.password === '534bede66')
		response.send('Valid');
	else
		response.send('Invalid');

}