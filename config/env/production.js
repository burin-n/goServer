module.exports = {
	debug : false,
	mongoUri: (process.env.MONGODB_DB_URL ||'mongodb://localhost/' ) + 'product',
	PORT : process.env.PORT || 1111,
	IP : process.env.IP || 'localhost'
}