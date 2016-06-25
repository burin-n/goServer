module.exports = function(app){
	var user = require('../controllers/user.controllers');
	app.get('/user/listall',user.listall);
	app.put('/user',user.getUser);
	app.post('/user',user.postUser);
}