var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

//personal infomation
	name:String,
	picture:String,
	gender:String,
	phone:String,
	shirt_size:String,
	regId:String,
	facebookId:String,
	facebookData:{},
	
	own_channels:[],
	join_events:[],
	interest_events:[],
	subscribe_channels:[],

//stat
	tag_visit:{},
	event_visit:{},
	channel_visit:{},


	tokenDelete:{
		type:Boolean,
		default: false
	},
	created_date:{
		type: Date,
		default: Date.now
	},
	lastModified:{
		type:Date,
		default: Date.now
	},
	lastOnline:{
		type:Date,
		default: Date.now
	}
});

mongoose.model('User',userSchema);