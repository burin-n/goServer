module.exports = function(app){
	var user = require('../controllers/user.controllers');
	app.get('/user/listall',user.listall);
	app.put('/user',user.getUser);
	app.put('/user/modify/:id',user.updateUser);
	app.post('/user/',user.postUser);
}