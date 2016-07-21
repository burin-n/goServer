module.exports = {
	debug : false,
	mongoUri: (process.env.OPENSHIFT_MONGODB_DB_URL ||'mongodb://localhost/' ) + 'dev',
	PORT : process.env.OPENSHIFT_NODEJS_PORT || 1111,
	IP : process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
}