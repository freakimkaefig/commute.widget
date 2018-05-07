command: "./commute.widget/lib/node/bin/node ./commute.widget/lib/efa.js",

refreshFrequency: "10min",

render: function () {
	return "<div class=\"container\">\
		<table>\
			<tr><td>Start:</td><td class=\"origin\"></td></tr>\
			<tr><td>Ziel:</td><td class=\"destination\"></td></tr>\
			<tr><td>Datum:</td><td class=\"date\"></td></tr>\
		</table>\
		<ul class=\"list\"></ul>\
	</div>";
},

update: function(output, domEl) {
	// Clear output list
	$(domEl).find(".list").html("");

	var data = JSON.parse(output);
	console.log(data);
	var journeys = data.journeys;
	var first = journeys[0];

	// Retrieve origin
	var origin = first.legs[0].origin.name;
	$(domEl).find(".origin").html(origin);

	// Retrieve destination
	var destination = first.legs[first.legs.length - 1].destination.name;
	$(domEl).find(".destination").html(destination);

	// Set current date and time
	var nowObj = new Date();
	var now_YYYY = nowObj.getFullYear();
	var now_MM = nowObj.getMonth() + 1;
	var now_DD = nowObj.getDate();
	var now_hh = nowObj.getHours();
	var now_mm = nowObj.getMinutes();
	if (now_MM < 10) now_MM = "0" + now_MM;
	if (now_DD < 10) now_DD = "0" + now_DD;
	if (now_hh < 10) now_hh = "0" + now_hh;
	if (now_mm < 10) now_mm = "0" + now_mm;
	var now = now_DD + "." + now_MM + "." + now_YYYY + " " + now_hh + ":" + now_mm;
	$(domEl).find(".date").html(now)

	for (var j = 0; j < journeys.length; j++) {
		var legs = journeys[j].legs;

		// Calculate and format time for journey
		var departureObj = new Date(Date.parse(legs[0].origin.departureTimeEstimated));
		var arrivalObj = new Date(Date.parse(legs[legs.length - 1].destination.arrivalTimeEstimated));
		var durationObj = Math.abs(arrivalObj - departureObj);
		var dep_hh = departureObj.getHours();
		var dep_mm = departureObj.getMinutes();
		var arr_hh = arrivalObj.getHours();
		var arr_mm = arrivalObj.getMinutes();
		var dur_hh = parseInt((durationObj/(1000*60*60))%24);
		var dur_mm = parseInt((durationObj/(1000*60))%60);
		if (dep_hh < 10) dep_hh = "0" + dep_hh;
		if (dep_mm < 10) dep_mm = "0" + dep_mm;
		if (arr_hh < 10) arr_hh = "0" + arr_hh;
		if (arr_mm < 10) arr_mm = "0" + arr_mm;
		if (dur_hh < 10) dur_hh = "0" + dur_hh;
		if (dur_mm < 10) dur_mm = "0" + dur_mm;
		var departure = dep_hh + ":" + dep_mm;
		var arrival = arr_hh + ":" + arr_mm;
		var duration = dur_hh + ":" + dur_mm;

		// Create list item for journey
		var li = "<li id=\"item-" + j + "\" class=\"item\">";
		li += "<div class=\"wrapper\">";
		li += "<div class=\"head\">";
		li += "<div class=\"times\">" + departure + " - " + arrival + "</div>";
		li += "<div class=\"duration\">" + duration +  "</div>";
		li += "</div>";

		// Create line with transportation products
		li += "<div class=\"line\">";

		var detail = "";

		for (var l = 0; l < legs.length; l++) {
			var leg = legs[l];
			var transportation = leg.transportation;
			var iconId = transportation.product.iconId;
			var name;
			if (transportation.hasOwnProperty("number")) {
				name = transportation.number;
			} else if (transportation.product.iconId === 99 || transportation.product.iconId === 100) {
				name = "";
			}

			var legDuration = leg.duration,
				legDuration_hh = parseInt((legDuration / (60 * 60)) % 24)
				legDuration_mm = parseInt((legDuration / 60) % 60),
				legDuration_ss = parseInt(legDuration % 60);
			if (legDuration_hh < 10) legDuration_hh = "0" + legDuration_hh;
			if (legDuration_mm < 10) legDuration_mm = "0" + legDuration_mm;
			if (legDuration_ss < 10) legDuration_ss = "0" + legDuration_ss;

			var legDepartureObj = new Date(Date.parse(leg.origin.departureTimeEstimated));
			var legArrivalObj = new Date(Date.parse(leg.destination.arrivalTimeEstimated));
			var legDep_hh = legDepartureObj.getHours();
			var legDep_mm = legDepartureObj.getMinutes();
			var legArr_hh = legArrivalObj.getHours();
			var legArr_mm = legArrivalObj.getMinutes();
			if (legDep_hh < 10) legDep_hh = "0" + legDep_hh;
			if (legDep_mm < 10) legDep_mm = "0" + legDep_mm;
			if (legArr_hh < 10) legArr_hh = "0" + legArr_hh;
			if (legArr_mm < 10) legArr_mm = "0" + legArr_mm;

			detail += "<div class=\"leg\">";
			detail += "<div class=\"icon\">" + this.getIcon(iconId, true) + "</div>";
			detail += "<div class=\"info\">";
			detail += "<div class=\"start\"><span class=\"time\">" + legDep_hh + ":" + legDep_mm + "</span><span class=\"station\">" + leg.origin.name + "</span></div>";
			detail += "<div class=\"end\"><span class=\"time\">" + legArr_hh + ":" + legArr_mm + "</span><span class=\"station\">" + leg.destination.name + "</span></div>";
			detail += "</div>";
			detail += "</div>";

			// Set icon for transportation product
			li += this.getIcon(iconId, false);

			// Set name of transportation product
			li += "<div class=\"number\">";
			li += name;
			li += "</div>";
		}
		li += "</div>"; // Close line

		li += "</div>"; // Close wrapper

		// Print connection details
		li += "<div class=\"detail\">" + detail + "</div>";

		li += "</li>"; // Close journey

		// Append journey to list
		$(domEl).find(".list").append(li);

	}

	$(domEl).find(".item").on("click", function(event) {
		var target = "#" + event.currentTarget.id;
		var detail = $(target).find(".detail");
		if (detail.hasClass("open")) {
			detail.removeClass("open");
			detail.hide(300);
		} else {
			$(domEl).find(".detail").hide(300);
			detail.addClass("open");
			detail.show(300);

		}
	});

},

getIcon: function(iconId, detail) {
	var returnObj = "";

	switch (iconId) {
		case 1:
			returnObj += "<div class=\"icon icon-1\">";
			returnObj += '<svg id="icon-ubahn" viewBox="0 0 20 20" width="16px" height="16px">\
    				<title>Stadt/Zahnradbahn</title>\
   					<g>\
        				<path style="fill:#0ba1e2;" d="M0,0v20h20V0H0z M16,11c0,8-12,8-12,0V3h3v8c0,4,6,4,6,0V3h3V11z"></path>\
        				<path style="fill:#ffffff;" d="M13,11c0,4-6,4-6,0V3H4v8c0,8,12,8,12,0V3h-3V11z"></path>\
    				</g>\
					</svg>';
			returnObj += "</div>";
			break;

		case 2:
			returnObj += "<div class=\"icon icon-2\">";
			returnObj += '<svg id="icon-sbahn" viewBox="0 0 20 20" width="16px" height="16px">\
    				<title>S-Bahn</title>\
      				<g>\
        				<path style="fill:#fff;" d="M0.51,13.139c1.009,3.052,3.442,5.455,6.517,6.411C3.952,18.594,1.519,16.19,0.51,13.139z"></path>\
        				<path style="fill:#fff;" d="M15.484,15.117c1.366-2.055,0.441-4.941-1.299-5.914C11.123,7.491,9.45,8.294,7.771,6.674 C6.763,5.701,7.326,3.936,9.533,4.008c2.987,0.097,5.613,2.675,5.613,2.675V3.95c-4.098-2.724-7.498-2.098-9.215-0.836 C3.257,5.079,2.62,9.459,6.822,11.227c2.035,0.856,3.739,0.961,4.71,1.38c1.124,0.487,1.776,2.714-1.066,3.212 c-2.229,0.388-4.593-0.935-6.474-3.251c0.021,0.039,0,3.154,0,3.154C7.132,18.347,12.617,19.437,15.484,15.117z"></path>\
    					<path style="fill:#fff;" d="M10.001,0c4.831,0,8.863,3.428,9.796,7.985C18.865,3.428,14.833,0,10,0C4.477,0,0,4.477,0,10 c0,0.691,0.07,1.365,0.203,2.016C0.07,11.365,0,10.691,0,10.001C0,4.478,4.478,0,10.001,0z"></path>\
    					<path style="fill:#fff;" d="M0.45,12.974c-0.074-0.236-0.13-0.48-0.186-0.723C0.32,12.494,0.376,12.738,0.45,12.974z"></path>\
        				<path style="fill:#53b330;" d="M19.797,7.985C18.864,3.428,14.833,0,10.001,0C4.478,0,0,4.478,0,10.001c0,0.69,0.07,1.364,0.203,2.015 c0.016,0.08,0.042,0.156,0.06,0.235c0.056,0.244,0.112,0.487,0.186,0.723c0.017,0.056,0.042,0.109,0.06,0.165 c1.009,3.051,3.442,5.455,6.517,6.411C7.967,19.843,8.966,20,10.001,20C15.523,20,20,15.524,20,10.001 C20,9.311,19.93,8.636,19.797,7.985z M3.992,12.568c1.881,2.316,4.245,3.639,6.474,3.251c2.842-0.498,2.19-2.725,1.066-3.212 c-0.971-0.419-2.675-0.524-4.71-1.38C2.62,9.459,3.257,5.079,5.931,3.114c1.717-1.262,5.117-1.888,9.215,0.836v2.733 c0,0-2.626-2.578-5.613-2.675c-2.207-0.072-2.77,1.693-1.762,2.666c1.679,1.62,3.352,0.817,6.414,2.529 c1.74,0.973,2.665,3.859,1.299,5.914c-2.867,4.32-8.352,3.23-11.492,0.605C3.992,15.722,4.013,12.607,3.992,12.568z"></path>\
    				</g>\
				  	</svg>';
			returnObj += "</div>";
			break;

		case 3:
			returnObj += "<div class=\"icon icon-3\">";
			returnObj += '<svg id="icon-bus" viewBox="0 0 22 20" width="16px" height="16px">\
    				<title>Bus</title>\
    				<path style="fill:#C31924;" d="M0,9v2l5,9h12l5-9V9l-5-9H5L0,9z"></path>\
					<g>\
        				<path style="fill:#ffffff;" d="M4,6h2c0.5,0,2,0,2,2c0,1-1,1.5-1,1.5S8,10,8,11c0,2-1.484,1.989-2,2H4V6z M5,9h1c0,0,1,0,1-1S6,7,6,7H5V9z M5,12h1c0,0,1,0,1-1s-1-1-1-1H5V12z"></path>\
    				</g>\
    				<path style="fill:#ffffff;" d="M13,11c0,2-2,2-2,2s-2,0-2-2V6h1v5c0,1,1,1,1,1s1,0,1-1V6h1V11z"></path>\
    				<path style="fill:#ffffff;" d="M17.943,8.031h-1.15V7.809c0-0.75-0.945-1.172-1.436-0.555c-0.456,0.572-0.08,1.331,0.501,1.531l0.879,0.299 c1.323,0.435,1.697,2.423,0.686,3.41C16.413,13.478,14,12.991,14,11.353v-0.367h1.149v0.308c0,0.808,1.18,0.942,1.55,0.357 c0.388-0.614,0.034-1.5-0.569-1.719l-0.822-0.29c-1.29-0.452-1.753-2.204-0.673-3.178c0.971-0.876,3.309-0.515,3.309,1.082 L17.943,8.031L17.943,8.031z"></path>\
				  	</svg>';
			returnObj += "</div>";
			break;

		case 6:
			returnObj += "<div class=\"icon icon-6\">";
			returnObj += '<svg id="icon-rbahn" viewBox="0 0 20 20" width="16px" height="16px">\
    				<title>R-Bahn</title>\
       				<rect style="fill:#8F908F;" width="20" height="20"></rect>\
        			<g>\
            			<path style="fill:#ffffff;" d="M4,17V3h7c2,0,4,1,4,4s-2,4-3,4l4,6h-3l-4-6H7v6H4z M7,9h3c1,0,2-1,2-2s-1-2-2-2H7V9z"></path>\
        			</g>\
				  	</svg>';
			returnObj += "</div>";
			break;

		case 99:
			// do nothing
			if (!detail) {
				break;
			}

		default:
			returnObj += "<div class=\"icon icon-x\">";
			returnObj += '<svg id="icon-fussweg" viewBox="0 0 19 31" width="16px" height="16px">\
    				<title>Fussweg</title>\
					<g>\
						<circle style="fill:#888;" class="st1" cx="11.1" cy="2.6" r="2.6"></circle>\
					</g>\
					<g>\
						<path style="fill:#888;" class="st1" d="M18.1,13.7L14.4,12l-2.7-5.5c-0.3-0.6-0.6-1-1.6-1.1c-0.2,0-0.9-0.1-1.2,0C8.6,5.6,2.3,9,2.2,9.1 C1.9,9.3,1.7,9.5,1.6,9.8l-0.9,4.6c0,0.6,0.3,1.2,0.9,1.3c0.6,0.1,1.1-0.3,1.2-0.8l0.8-4.3l3-1.6L4.3,21.6l-4,6.1 c-0.5,0.8-0.4,1.7,0.2,2.1s1.5,0.1,2-0.7l3.9-6c0.4-0.5,1.1-5.5,1.1-5.5c0.1,0,0.9,0.2,1.1,0.4l4.1,4.9l1.3,6 c0.2,0.8,0.9,1.3,1.6,1.1c0.7-0.2,1.1-0.9,1-1.7l-1.3-6.1c-0.1-0.7-4.7-6-4.7-6l1.2-5.3c0,0,1.1,2.2,1.1,2.3 c0.1,0.3,0.3,0.5,0.5,0.7l3.9,1.7c0.5,0.2,1.1,0,1.3-0.6C18.8,14.5,18.6,13.9,18.1,13.7z"></path>\
					</g>\
					</svg>';
			returnObj += "</div>";
			break;
	}

	return returnObj;
},

style: "                            				\n\
	bottom: 17px                        			\n\
	left: 30px                     					\n\
	font-family: -apple-system      				\n\
	font-size: 11px                 				\n\
	font-weight: 500                				\n\
	color: #fff                     				\n\
													\n\
													\n\
	.list                           				\n\
		list-style: none            				\n\
		padding: 0 									\n\
		margin: 0 									\n\
													\n\
	.item 											\n\
		border-bottom: 2px solid rgba(#fff, .5) 	\n\
		padding-top: 6px 							\n\
		padding-bottom: 6px 						\n\
		.wrapper 									\n\
			.head 									\n\
				display: flex 						\n\
				justify-content: space-between  	\n\
				align-items: center 				\n\
				font-weight: 700 					\n\
				margin-bottom: 2px					\n\
													\n\
				.times 								\n\
					margin-right: 6px 				\n\
													\n\
			.line									\n\
				display: flex 						\n\
													\n\
				.icon 								\n\
					margin-right: 2px 				\n\
													\n\
				.number								\n\
					margin-right: 6px 				\n\
					line-height: 18px  				\n\
													\n\
		.detail										\n\
			display: none 							\n\
													\n\
			.leg									\n\
				display: flex						\n\
				align-items: center					\n\
				padding-top: 5px					\n\
				padding-bottom: 5px					\n\
													\n\
				.info								\n\
					margin-left: 15px				\n\
													\n\
	.item:nth-child(1)								\n\
		.wrapper									\n\
			border-top: 2px solid rgba(#fff, .5) 	\n\
"
