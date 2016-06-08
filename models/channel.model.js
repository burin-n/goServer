var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
	name :{
		type:String,
//		index:true,
		required:true
	},
	verified :{
		type:Boolean,
		default:false
	},
	created_date:{
		type: Date,
		default: Date.now
	},
	picture: String,
	picture_large: String,
	events : [Schema.Types.ObjectId],
	events_bin : [Schema.Types.ObjectId],
	admins : [Schema.Types.ObjectId],
	tokenDelete: {
		type:Boolean,
		default:false
	},
	lastModified:{
		type: Date,
		default: Date.now
	},

	//stat--------------
	visit:Number
	//stat--------------


});

mongoose.model('Channel',channelSchema);
