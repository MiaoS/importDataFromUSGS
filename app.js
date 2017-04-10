"use strict";

const EXECUTEDURATION=30*60*1000;// 30 mins
const TIMEOUT= 9*1000;//seconds for one request
const LOOPCOUNT=EXECUTEDURATION/TIMEOUT;
const PEROID= 6;// days for each request
const STARTDATE="2017-04-05"; // end date of first request then the request when go backwards

const now=new Date().toString();
var request=require("request-promise");
var mongoose=require("mongoose");
mongoose.connect("localhost");

var fs=require("fs");
var proData=require("./proData").proData;
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson
//https://earthquake.usgs.gov/fdsnws/event/1/application.json
var end=new Date(STARTDATE);
var start= new Date(end.valueOf()-PEROID*24*60*60*1000);

var dir= "log/log_"+now;
//create log directory
fs.mkdirSync(dir);


console.log(end);
console.log(start);




var options=function(){return{
	uri:'https://earthquake.usgs.gov/fdsnws/event/1/query',
	qs:{
		format:'geojson',
		starttime:start.toISOString(),
		eventtype:'earthquake',
		endtime:end.toISOString(),
		minmagnitude:3,
		//maxmagnitude:1

	},
	headers:{
	'User-Agent':'Request-Promise'
	},
	json:true	
};
}

var writeHandler=function(err){
	if(err) throw err;
}

var run=function(num){

var filename=dir+"/"+(num+1)+"-"+Math.floor(LOOPCOUNT)+".txt";
request(new options()).then(function(data){
	//console.log(data);
	fs.appendFile(filename,
		"fetching data from date "+ start +" to "+end+data.features.length+"\n",
		writeHandler);
	console.log(data.features.length);
	for(var i=0;i<data.features.length; i ++){
		
		fs.appendFile(filename,
			i+", "+data.features[i].id+"\n",
			writeHandler);
		proData(data.features[i]);
	}
	console.log("End of request");
	//mongoose.connection.close();
}).catch(function(err){
	console.log(err);
	//mongoose.connection.close()
});
/*
	type:String,
	properties:{
		mag: {type:Number},
		place: String,
		time:{type:Number},
		tz:{type:Number},
		tsunami:{type:Number},
		type:String,
		title:String,
	}
	geometry:{
		type:{type:String,default:"Point"},
		coordinates:[{type:Number}]
	}
*/
//mongoose.connection.close()
	end=start;
	start= new Date(end.valueOf()-PEROID*24*60*60*1000);

}

var runRe=function(num){

	setTimeout(function(){
		run(num);
		num++;
		if(num<LOOPCOUNT){
			setTimeout(runRe(num),TIMEOUT);
		}else{
			setTimeout(function(){mongoose.connection.close();
				console.log("END of Recursion: connection closed");
				console.log(end.toUTCString());},TIMEOUT);
		}
	},TIMEOUT/2);
	console.log(num);
	console.log(new Date().getTime());

}

setTimeout(runRe(0),TIMEOUT);
