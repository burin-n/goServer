module.exports = {
	debug : true,
	mongoUri: (process.env.OPENSHIFT_MONGODB_DB_URL ||'mongodb://localhost/' ) + 'dev',
	PORT : process.env.OPENSHIFT_NODEJS_PORT || 1111,
	IP : process.env.OPENSHIFT_NODEJS_IP || '128.199.207.29'
};
