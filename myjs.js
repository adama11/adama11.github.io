jQuery(document).ready(function($){

	$('#CurrentExperimentButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "";
		document.getElementById("PastExperiments").className = "hidden";
		document.getElementById("AlertSettings").className = "hidden";

		document.getElementById("CurrentExperimentButton").className = "nav-item active";
		document.getElementById("PastExperimentsButton").className = "nav-item";
		document.getElementById("AlertSettingsButton").className = "nav-item";
	});

	$('#PastExperimentsButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "hidden";
		document.getElementById("PastExperiments").className = "";
		document.getElementById("AlertSettings").className = "hidden";

		document.getElementById("CurrentExperimentButton").className = "nav-item";
		document.getElementById("PastExperimentsButton").className = "nav-item active";
		document.getElementById("AlertSettingsButton").className = "nav-item";
	});

	$('#AlertSettingsButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "hidden";
		document.getElementById("PastExperiments").className = "hidden";
		document.getElementById("AlertSettings").className = "";

		document.getElementById("CurrentExperimentButton").className = "nav-item";
		document.getElementById("PastExperimentsButton").className = "nav-item";
		document.getElementById("AlertSettingsButton").className = "nav-item active";
	});

	$('#navbar-toggle').on('click', switchToggle);
	function switchToggle(e) {
		$('.fas.fa-chevron-down').toggleClass('rotateToggle');
	};

	var experimentCount = 0;
	if (localStorage != null) {
		experimentCount = Number(localStorage.getItem("experimentCount", experimentCount));
	}
	localStorage.setItem("experimentCount", experimentCount);
	var recentRun;
	var hasRun = false;
	var tube1Enable = false;
	var tube2Enable = false; 
	var tube3Enable = false; 
	var tube4Enable = false; 
	//var expName = "New Run " + 1;


	var tempN = experimentCount + 1;
	$('#experimentName').text('New Run ' + tempN);

	$('#ApplySettingsButton').on('click', saveConfig);
	function saveConfig(e) {

		$('#ExperimentSettingsSaveAlert').fadeIn(200);
		$('#ExperimentSettingsSaveAlert').delay(2000).fadeOut(200);

		expName = $("#experimentNameInput").val();
		tempN = experimentCount + 1;
		if (expName == '') expName = "New Run " + tempN;
		$('#experimentName').text(expName);

		

		tube1Enable = $("#inlineCheckboxTube1").prop("checked");
		tube2Enable = $("#inlineCheckboxTube2").prop("checked");
		tube3Enable = $("#inlineCheckboxTube3").prop("checked");
		tube4Enable = $("#inlineCheckboxTube4").prop("checked");

		if (tube1Enable) {
			document.getElementById("tube1").className = "testtube";
			document.getElementById("tube1box").className = "optical-density-box";
			$('#od1').text("0.00");
		} else {
			document.getElementById("tube1").className = "testtube testtube-inactive";
			document.getElementById("tube1box").className = "optical-density-box od-box-inactive";
			$('#od1').text("N/A");
		}
		if (tube2Enable) {
			document.getElementById("tube2").className = "testtube";
			document.getElementById("tube2box").className = "optical-density-box"; 
			$('#od2').text("0.00");
		} else {
			document.getElementById("tube2").className = "testtube testtube-inactive";
			document.getElementById("tube2box").className = "optical-density-box od-box-inactive";
			$('#od2').text("N/A");
		}
		if (tube3Enable) {
			document.getElementById("tube3").className = "testtube";
			document.getElementById("tube3box").className = "optical-density-box"; 
			$('#od3').text("0.00");
		} else {
			document.getElementById("tube3").className = "testtube testtube-inactive";
			document.getElementById("tube3box").className = "optical-density-box od-box-inactive";
			$('#od3').text("N/A");
		}
		if (tube4Enable) {
			document.getElementById("tube4").className = "testtube";
			document.getElementById("tube4box").className = "optical-density-box"; 
			$('#od4').text("0.00");
		} else {
			document.getElementById("tube4").className = "testtube testtube-inactive";
			document.getElementById("tube4box").className = "optical-density-box od-box-inactive";
			$('#od4').text("N/A");
		}

	};

	$('#QuickReadButton').on('click', newRead);
	function newRead(e) {
		hasRun=true;
		experimentCount++;
		localStorage.setItem("experimentCount", experimentCount);
		recentRun=moment();


		expName = $("#experimentNameInput").val();
		var tempN = experimentCount + 1;
		if (expName == '') expName = "New Run " + tempN;
		$('#experimentName').text(expName);

		document.getElementById("experimentIcon").className = "fas fa-sync fa-spin";

		
		var experiment = new Object();
		experiment.name = ($("#experimentNameInput").val() == '') ? ("New Run " + experimentCount) : expName;
		experiment.startTime = moment().format("MM/DD/YY, h:mm:ssA");
		experiment.startTimeUnformatted = moment().unix();
		experiment.tube1 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube2 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube3 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube4 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.type = "Quick Read";
		experiment.notes = "blah blah blah";

		var n = "exp" + experimentCount; //console.log("n=" + n);
		if (localStorage != null) {
			localStorage.setItem(n, JSON.stringify(experiment)); //console.log("stringify= " + JSON.stringify(experiment));
		};
		
		setTimeout(switchBack, 500);
		function switchBack(e) {
			document.getElementById("experimentIcon").className = "fas fa-angle-right";
		};
	};

	$('#PastExperimentsButton').on('click', displayHistory);
	function displayHistory(e) {
		$("#tableBody").empty();
		if (experimentCount > 0) {$("#noDataInTable").empty();}
		for (var i=experimentCount; i >= 1; i--) {
			var retrievedObject = localStorage.getItem("exp"+i); //console.log("retrievedObject= " + localStorage.getItem("exp"+i));
			var e = JSON.parse(retrievedObject);
			$('#tableBody').append('\
				<tr>\
				<th scope="row">'+i+'</th>\
				<td>\
				<label class="custom-control custom-checkbox">\
				<input type="checkbox" class="custom-control-input" id="graphCheckbox'+i+'">\
				<span class="custom-control-indicator"></span>\
				</label>\
				</td>\
				<td>'+e.name+'</td>\
				<td>'+e.startTime+'</td>\
				<td>'+ ((e.tube1) ? e.tube1 : 'N/A') +'</td>\
				<td>'+ ((e.tube2) ? e.tube2 : 'N/A') +'</td>\
				<td>'+ ((e.tube3) ? e.tube3 : 'N/A') +'</td>\
				<td>'+ ((e.tube4) ? e.tube4 : 'N/A') +'</td>\
				<td>'+e.type+'</td>\
				<td>'+e.notes+'</td>\
				</tr>');
			//<input class="form-check-input" type="checkbox" id="graphCheckbox'+i+'" value="option1">
		};
		
	};

	$('#checkGraphButton').on('click', checkGraphChecks);
	function checkGraphChecks(e) {
		for (var i=1; i <= experimentCount; i++) {
			if ($("#graphCheckbox"+i).prop("checked")) {
				alert("graphCheckbox"+ i + " was checked");
			};
		};
	};

	$('#DeleteHistoryConfirmButton').on('click', confirmDelete);
	function confirmDelete(e) {
		$("#tableBody").empty();
		localStorage.clear();
		experimentCount=0;
		localStorage.setItem("experimentCount", experimentCount);
		$('#noDataInTable').text('No experiments yet.');
		hasRun=false;
	};
	
	$(function () {
		setInterval(updateLastRun, 5000);
	});
	function updateLastRun () {
		if (hasRun) {
			// var retrievedObject = localStorage.getItem("exp"+experimentCount);
			// var e = JSON.parse(retrievedObject);
			$('#LastRun').text(moment(recentRun).fromNow());
		};
	};


	$('#ExportHistoryButton').on('click', exportHistory);
	function exportHistory(e) {
		var exportTable = document.getElementById("tableToExport");
		var tableExportObject = new TableExport(exportTable, {
			formats: ['csv'], 
			exportButtons: false
		});
		var exportString = "jentube_export (" + moment().format("YYYY-MM-DD h.mm.ssA") + ")";
		var exportData = tableExportObject.getExportData()['tableToExport']['csv'];
		tableExportObject.export2file(exportData.data, exportData.mimeType, exportString, exportData.fileExtension);

	};

	// $('#GraphButton').on('click', graph);
	// function graph(e) {
	// 	google.charts.load('current', {packages: ['corechart']});
	// 	google.charts.setOnLoadCallback(drawChart);

	// 	function drawChart() {
	// 		// Define the chart to be drawn.
	// 		var data = new google.visualization.DataTable();
	// 		data.addColumn('number', 'time');
	// 		data.addColumn('number', 'Optical Density tube 1');
	// 		data.addColumn('number', 'Optical Density tube 2');
	// 		data.addColumn('number', 'Optical Density tube 3');
	// 		data.addColumn('number', 'Optical Density tube 4');

	// 		var timeStart = 1000000000000;
	// 		for (var i=1; i <= experimentCount; i++) {
	// 			if ($("#graphCheckbox"+i).prop("checked")) {

	// 				var retrievedObject = localStorage.getItem("exp"+i);
	// 				var e = JSON.parse(retrievedObject);
	// 				if (timeStart > e.startTimeUnformatted) { timeStart = e.startTimeUnformatted };

	// 				data.addRows([[e.startTimeUnformatted - timeStart,e.tube1,e.tube2,e.tube3,e.tube4]]);

	// 			};
	// 		};

	// 	var options = {
	// 		'title':'Optical Density vs. Time',
	// 		'width': 1000,
	// 		'height':400
	// 	};

	//     // Instantiate and draw the chart.
	//     var chart = new google.visualization.LineChart(document.getElementById('myPieChart'));
	//     chart.draw(data, options);
	// 	};


	// };

	$('#GraphButton').on('click', graph);
	function graph(e) {
		//console.log(parseGraphData());
		var data = { 
			series: eval(parseGraphData()) 
		};

		var options = {
			axisX: {
				type: Chartist.FixedScaleAxis,
				divisor: 10,
				labelInterpolationFnc: function(value) {
					return moment(value).format('HH:MM:SSA');
				}
			}
		,
			plugins: [
		    	Chartist.plugins.tooltip()
		  	]

		};

		var chart = new Chartist.Line('.ct-chart', data, options);


		// chart.on('draw', function(data) {
		// 	if(data.type === 'line' || data.type === 'area') {
		// 		data.element.animate({
		// 			d: {
		// 				begin: 200 * data.index,
		// 				dur: 200,
		// 				from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
		// 				to: data.path.clone().stringify(),
		// 				easing: Chartist.Svg.Easing.easeOutQuint
		// 			}
		// 		});
		// 	}
		// });
	};


	var parseGraphData = function() {
		var toAddData1 = "data: [";
		var toAddData2 = "data: [";
		var toAddData3 = "data: [";
		var toAddData4 = "data: [";

		var timeStart = +Infinity;
		for (var i=1; i <= experimentCount; i++) {
			if ($("#graphCheckbox"+i).prop("checked")) {
				var retrievedObject = localStorage.getItem("exp"+i);
				var e = JSON.parse(retrievedObject);
				if (timeStart > e.startTimeUnformatted) { timeStart = e.startTimeUnformatted };
			};
		};

		for (var i=1; i <= experimentCount; i++) {
			if ($("#graphCheckbox"+i).prop("checked")) {
				var retrievedObject = localStorage.getItem("exp"+i); //console.log("retrievedObject= " + localStorage.getItem("exp"+i));
				var data = JSON.parse(retrievedObject);
				toAddData1 += "{ meta: '" + data.notes + "' , x: " + (data.startTimeUnformatted - timeStart) + ", y: " + data.tube1 + "},";
				toAddData2 += "{ meta: '" + data.notes + "' , x: " + (data.startTimeUnformatted - timeStart) + ", y: " + data.tube2 + "},";
				toAddData3 += "{ meta: '" + data.notes + "' , x: " + (data.startTimeUnformatted - timeStart) + ", y: " + data.tube3 + "},";
				toAddData4 += "{ meta: '" + data.notes + "' , x: " + (data.startTimeUnformatted - timeStart) + ", y: " + data.tube4 + "},";

			};

		};

		var output = "[{ name: 'Tube 1'," + toAddData1 + 
					"]}, { name: 'Tube 2'," + toAddData2 + 
					"]}, { name: 'Tube 3'," + toAddData3 + 
					"]}, { name: 'Tube 4'," + toAddData4 + 
					"]}]";

		return output;
	};
});






