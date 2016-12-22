// select which environment to run
module.exports = require('./env/'+process.env.NODE_ENV+'.js');