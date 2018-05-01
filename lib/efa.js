var http = require("http");

var options = {};
options.host = "proxy";
options.port = 8080;

var origin = "de:08111:6118"; // Stuttgart Hauptbahnhof
var destination = "de:08111:6019"; // Stuttgart Marienplatz

var date = new Date(),
	YYYY = date.getFullYear(),
	MM = date.getMonth() + 1,
	DD = date.getDate();
	hh = date.getHours();
	mm = date.getMinutes();
if (MM < 10) MM = "0" + MM;
if (DD < 10) DD = "0" + DD;
if (hh < 10) hh = "0" + hh;
if (mm < 10) mm = "0" + mm;

var url = "http://www3.vvs.de/mngvvs/XML_TRIP_REQUEST2?SpEncId=0\
&changeSpeed=normal\
&computationType=sequence\
&coordOutputFormat=EPSG:4326\
&cycleSpeed=14\
&deleteAssignedStops=0\
&deleteITPTWalk=0\
&descWithElev=1\
&itOptionsActive=1\
&itdDate=" + YYYY + MM + DD + "\
&itdTime=" + hh + mm + "\
&name_destination=" + destination + "\
&name_origin=" + origin + "\
&noElevationProfile=1\
&outputFormat=rapidJSON\
&outputOptionsActive=1\
&ptOptionsActive=1\
&routeType=leasttime\
&searchLimitMinutes=360\
&serverInfo=1\
&trITArrMOT=100\
&trITArrMOTvalue=15\
&trITDepMOT=100\
&trITDepMOTvalue=15\
&type_destination=any\
&type_origin=any\
&useElevationData=1\
&useLocalityMainStop=0\
&useRealtime=1\
&useUT=1\
&version=10.2.2.48";

function runQuery(_options) {
	http.get(_options, function(response) {
		var data = "";

		response.on("data", function(chunk) {
			data += chunk;
		});

		response.on("end", function() {
			console.log(data);
		});
	}).on("error", function(err) {
		console.log("Error: " + err.message);
	});
}

options.path = "http://www3.vvs.de/mngvvs/XML_TRIP_REQUEST2?SpEncId=0\
&coordOutputFormat=EPSG:4326\
&outputFormat=rapidJSON";
http.get(options, function(response) {
	var data = "";

	response.on("data", function(chunk) {
		data += chunk;
	});

	response.on("end", function() {
		options.path = url;
		runQuery(options);
	});
}).on("error", function(err) {
	runQuery(url);
});
