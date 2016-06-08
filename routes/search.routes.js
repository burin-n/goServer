module.exports = function(app){
	
	var search = require('../controllers/search.controllers');
	app.get('/search/channel',search.searchChannel);
	app.get('/search/event',search.searchEvent);

}
