
var Feature=require("./Feature");
var country=require("./countries").countries;
var getCountryItem =function(){
	var countryItem={};
	country.forEach(function(item){
		countryItem[item.English.substring(1)]=[];
		countryItem[item.English.substring(1)].push(item.ISO3);
		countryItem[item.English.substring(1)].push(item.China);
	});
	
	return countryItem;
}
var items=getCountryItem();
exports.proData=function(feature){
	if(feature.properties.mag){
	delete feature.properties.updated;
	delete feature.properties.detail;
	delete feature.properties.felt;
	delete feature.properties.cdi;
	delete feature.properties.mmi;
	delete feature.properties.tsunami;
	delete feature.properties.status;
	delete feature.properties.sig;
	delete feature.properties.net;
	delete feature.properties.code;
	delete feature.properties.sources;
	delete feature.properties.types;
	delete feature.properties.nst;
	delete feature.properties.dmin;
	delete feature.properties.rms;
	delete feature.properties.gap;
	delete feature.properties.type;
	delete feature.properties.title;
	feature._id=feature.id;
	delete feature.id;
	
	feature.properties.country=getCountry(feature.properties.place);
	feature.properties.iso3= items[feature.properties.country]?items[feature.properties.country][0]:null;
	feature.properties.zh= items[feature.properties.country]?items[feature.properties.country][1]:null;
	var ids= feature.properties.ids;
	
	feature.properties.ids=[];
	var arrayOfIds= ids.split(",");
	for(var i=0; i < arrayOfIds.length; i++){
	  if(arrayOfIds[i]!="")
		feature.properties.ids.push(arrayOfIds[i]);
	}

	var f=new Feature(feature);
	f.save(function(err){
		return;
	})
	}else{
	return;
}

};

var getCountry=function(place){
	var arrayOfPlace= place.split(", ");
	
	
	var states=["Alabama", "Alaska","Arizona","Arkansas", "California","Northern California","Colorado",
		"Connecticut", "Delaware", "Florida", "Georgia", "Hawaii","Idaho", 
		"Illinois","Indiana","Iowa", "Kansas","Kentucky","Louisiana","Maine",
		"Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri",
		"Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
		"New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
 		"Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
		"Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin",
		"Wyoming","AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL",
		"IN","IA","KS","KY","LA","ME","MD","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
		"NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA",
		"WA","WV","WI","WY"];
	if(states.indexOf(arrayOfPlace[arrayOfPlace.length-1])>-1)
		return "United States";
	if(arrayOfPlace.length >1)
		return arrayOfPlace[arrayOfPlace.length-1];
	return null;

};
