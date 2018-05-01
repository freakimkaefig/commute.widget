var http = require("http");

// var origin = "de:08115:3202"; // Tor 7
var origin = "coord:3498999:763723:NBWT:Sindelfingen,+Daimlerwerk+480%2F1:0"; // 480/1
var destination = "streetID:3112:90B:8111000:51:Urbanstra%C3%9Fe:Stuttgart:Urbanstra%C3%9Fe::Urbanstra%C3%9Fe::ANY:DIVA_SINGLEHOUSE:3514098:754786:NBWT:vvs"; // Urbanstraße 90B
// var destination = "streetID:3190:18:8111000:51:Walter-Heller-Stra%C3%9Fe:Stuttgart:Walter-Heller-Stra%C3%9Fe::Walter-Heller-Stra%C3%9Fe::ANY:DIVA_SINGLEHOUSE:3507392:761443:NBWT:vvs"; // Walter-heller-Straße 18

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

http.get(url, function(response) {
	var data = "";
	var connections = {};

	response.on("data", function(chunk) {
		data += chunk;
	});

	response.on("end", function() {
		console.log(data);
	});
}).on("error", function(err) {
	console.log("Error: " + err.message);
});
