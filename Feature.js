'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

/*

*/
var feature = new Schema({
	type:String,
	properties:{
		mag: {type:Number},
		place: String,
		time:{type:Number},
		tz:{type:Number},
		url:String,
		alert:String,
		ids:[{type:String}],
		magType:{type:String},
		country:String,
	},
	geometry:{
		type:{type:String,default:"Point"},
		coordinates:[{type:Number}]
	},
        _id:{type:String,required:true, unique:true}
})

var Feature=mongoose.model("Feature",feature);
module.exports=Feature;
