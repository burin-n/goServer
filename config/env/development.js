module.exports = {
	debug : true,
	mongoUri: (process.env.MONGODB_DB_URL ||'mongodb://localhost/' ) + 'test',
	PORT : process.env.PORT || 1111,
	IP : process.env.IP || 'localhost'
};
