
const now=new Date().toString();
var request=require("request-promise");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/earthquake");

var proData=require("./proData").proData;


var options=function(){return{
	uri:'https://earthquake.usgs.gov/fdsnws/event/1/query',
	qs:{
		format:'geojson',
		starttime:(new Date((new Date()).valueOf() - 31*60*1000)).toISOString(),
		eventtype:'earthquake',
		//endtime:end.toISOString(),
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

request(new options()).then(function(data){
	
	for(var i=0;i<data.features.length; i ++){
		proData(data.features[i]);
	}
	
}).catch(function(err){
	
});


}
 run();
setInterval(run,30*60*1000);