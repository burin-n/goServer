
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title : {
		type:String,
		required:true
//		index:true
	},
	about : String,
	channel : {
		type:Schema.Types.ObjectId,
		required : true
	},
	picture : String,
	picture_large:[],	
	video : String,
	faculty_require: [],
	year_require:[],
	agreement :String,
	location:String,
	date_time: String,
	contact_information: String,
	tags:[],
	
	//stat-----------------------------------------------
	rating:{
		type:Number,
		default:0
	},
	rating_voter:{
		type:Number,
		default:0
	},


	visited:{
		type:Number,
		default:0
	},
	visited_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	visited_year:{}, // { '1':10 , '2':30  }
	
	interested:{
		type:Number,
		default:0
	},
	interested_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	interested_year:{}, // { '1':10 , '2':30  }
	
	joined:{
		type:Number,
		default:0
	},
	joined_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	joined_year:{}, // { '1':10 , '2':30  }
	join_per_day:[], // {month/day/year,number}
	visit_per_day:[], // {month/day/year,number}
	momentum:{type:Number,default:0},

	//stat-------------------------------------------------
	
	tokenDelete:{
		type:Boolean,
		default: false
	},
	who_join: [String],
	created_date:{
		type: Date,
		default: Date.now
	},
	lastModified:{
		type:Date,
		default: Date.now
	}
 });


mongoose.model('Event',eventSchema);

