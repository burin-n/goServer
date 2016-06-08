module.exports  = function(app){
	login = require('../controllers/login.controllers');

	app.post('/login',login.login);
}
