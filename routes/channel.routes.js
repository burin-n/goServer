
module.exports = function(app){
	var channel = require('../controllers/channel.controllers');

	app.get('/channel/listall',channel.listAll);
	app.delete('/channel/clear',channel.clear);

	app.route('/channel')
		.get(channel.getChannel)
		.post(channel.postChannel)
		.put(channel.putChannel)
		.delete(channel.deleteChannel);

	app.get('/channel/stat',channel.getStat);


	app.get('/channel/search',channel.searchChannel);

}