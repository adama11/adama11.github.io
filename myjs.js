jQuery(document).ready(function($){
	//WEB USB IMPLEMENTATION (NOT WORKING)
	// document.addEventListener('DOMContentLoaded', event => {
	// 	const filters = [
	//       { 'vendorId': 0x239a, 'productId': 0x800b },
	//     ];
	// 	navigator.usb.requestDevice({ 'filters': filters }).then(function(device){
	// 	   console.log(device);
	// 	});
	// });

	// const filters = [
 //      { 'vendorId': 0x239a, 'productId': 0x800b },
 //    ];
	// navigator.usb.requestDevice({ 'filters': filters }).then(function(device){
	//    console.log(device);
	// });




	


	$(function() {
		options1 = {
			placement: "right",
			title: "Click to open",
			delay: { "show": 300, "hide": 0 },
			offset: '0, 5px, 0, 0',
			trigger: 'hover'
		};
		options2 = {
			placement: "Top",
			title: "Enable data to graph",
			delay: { "show": 0, "hide": 100 },
			offset: '5px, 0, 0, 0'
		};
		$('#liveGraphToggle').tooltip(options1);
		$('#tableGraphIcon').tooltip(options2);
		
	});



	$('#CurrentExperimentButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "";
		document.getElementById("PastExperiments").className = "hidden";
		document.getElementById("DeviceConfig").className = "hidden";
		document.getElementById("AlertSettings").className = "hidden";

		document.getElementById("CurrentExperimentButton").className = "nav-item active";
		document.getElementById("PastExperimentsButton").className = "nav-item";
		document.getElementById("DeviceConfigButton").className = "nav-item";
		document.getElementById("AlertSettingsButton").className = "nav-item";
	});

	$('#PastExperimentsButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "hidden";
		document.getElementById("PastExperiments").className = "";
		document.getElementById("DeviceConfig").className = "hidden";
		document.getElementById("AlertSettings").className = "hidden";

		document.getElementById("CurrentExperimentButton").className = "nav-item";
		document.getElementById("PastExperimentsButton").className = "nav-item active";
		document.getElementById("DeviceConfigButton").className = "nav-item";
		document.getElementById("AlertSettingsButton").className = "nav-item";
	}); 

	$('#DeviceConfigButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "hidden";
		document.getElementById("PastExperiments").className = "hidden";
		document.getElementById("DeviceConfig").className = "";
		document.getElementById("AlertSettings").className = "hidden";

		document.getElementById("CurrentExperimentButton").className = "nav-item";
		document.getElementById("PastExperimentsButton").className = "nav-item";
		document.getElementById("DeviceConfigButton").className = "nav-item active";
		document.getElementById("AlertSettingsButton").className = "nav-item";
	});

	$('#AlertSettingsButton').on('click', function(e){
		document.getElementById("CurrentExperiment").className = "hidden";
		document.getElementById("PastExperiments").className = "hidden";
		document.getElementById("DeviceConfig").className = "hidden";
		document.getElementById("AlertSettings").className = "";

		document.getElementById("CurrentExperimentButton").className = "nav-item";
		document.getElementById("PastExperimentsButton").className = "nav-item";
		document.getElementById("DeviceConfigButton").className = "nav-item";
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
	var scheduledReadTime1 = 0;
	var scheduledReadTime2 = 0;
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

		scheduledReadTime1 = $("#scheduledReadInput1").val();
		scheduledReadTime2 = $("#scheduledReadInput2").val();
		if (scheduledReadTime1>0 && scheduledReadTime2>0) {
			document.getElementById("ScheduledReadButton").className = "btn btn-primary";
		}

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

	var scheduledReadInterval;
	var scheduledReadTimeout;
	//var running = false;
	$('#ScheduledReadButton').on('click', newSchedule);
	function newSchedule(e) {
		if (scheduledReadTime1==0 || scheduledReadTime1<0 || scheduledReadTime1=='' || scheduledReadTime2<0 || scheduledReadTime2==0 || scheduledReadTime2=='') {
			$('#scheduleErrorModal').modal('show');
		} else {
			document.getElementById("scheduledReadInfo").className = "";
			$('#scheduledReadInfoTimes').text("Scheduled read running once every " + scheduledReadTime1 + " minutes, for " + scheduledReadTime2 + " minutes.");
			newRead("Scheduled Read");
			scheduledReadInterval = setInterval(function() {newRead("Scheduled Read");}, scheduledReadTime1*60000);
			scheduledReadTimeout = setTimeout(function() {
				clearTimeout(scheduledReadInterval);
				document.getElementById("scheduledReadInfo").className = "hidden";
			}, scheduledReadTime2*60000 - 100);
		};
	};

	$('#StopReadButton').on('click', function () {
		$('#confirmCancelModal').modal('show');
	});

	$('#confirmCancelModalButton').on('click', cancelRead);
	function cancelRead(e) {
		clearTimeout(scheduledReadInterval);
		clearTimeout(scheduledReadTimeout);
		document.getElementById("scheduledReadInfo").className = "hidden";
	};

	$('#QuickReadButton').on('click', function() {newRead("Quick Read");});

	var tubeAlertEnable = [false,false,false,false];
	var phoneAlertEnable = false;
	var emailAlertEnable = false;
	var notificationsConfigured = false;
	function newRead(typeIn) {
		var type = typeIn;
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
		experiment.startTimeUnformatted = moment();
		experiment.tube1 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube2 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube3 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.tube4 = Math.floor(Math.random() * 100)/100; //Import data from Arduino
		experiment.type = type;
		experiment.notes = "";

		var n = "exp" + experimentCount; //console.log("n=" + n);
		if (localStorage != null) {
			localStorage.setItem(n, JSON.stringify(experiment)); //console.log("stringify= " + JSON.stringify(experiment));
		};
		$('#od1').text((experiment.tube1) ? experiment.tube1 : 'N/A');
		$('#od2').text((experiment.tube2) ? experiment.tube2 : 'N/A');
		$('#od3').text((experiment.tube3) ? experiment.tube3 : 'N/A');
		$('#od4').text((experiment.tube4) ? experiment.tube4 : 'N/A');

		if (notificationsConfigured) {
			var target = localStorage.getItem("alertTargetOD");
			tube1cur = Math.abs(experiment.tube1 - target);
			tube2cur = Math.abs(experiment.tube2 - target);
			tube3cur = Math.abs(experiment.tube3 - target);
			tube4cur = Math.abs(experiment.tube4 - target);

			var tolerance = 0.1;
			if (tube1cur < tolerance && tubeAlertEnable[0]) {
				if (emailAlertEnable) {sendEmail(1, experiment.tube1, 'approach');}
				if (phoneAlertEnable) {sendText(1, experiment.tube1, 'approach');}
			};
			if (tube2cur < tolerance && tubeAlertEnable[1]) {
				if (emailAlertEnable) {sendEmail(2, experiment.tube2, 'approach');}
				if (phoneAlertEnable) {sendText(2, experiment.tube2, 'approach');}
			};
			if (tube3cur < tolerance && tubeAlertEnable[2]) {
				if (emailAlertEnable) {sendEmail(3, experiment.tube3, 'approach');}
				if (phoneAlertEnable) {sendText(3, experiment.tube3, 'approach');}
			};
			if (tube4cur < tolerance && tubeAlertEnable[3]) {
				if (emailAlertEnable) {sendEmail(4, experiment.tube4, 'approach');}
				if (phoneAlertEnable) {sendText(4, experiment.tube4, 'approach');}
			};
			if (tube1cur >= 0 && tubeAlertEnable[0]) {
				if (emailAlertEnable) {sendEmail(1, target, 'target');}
				if (phoneAlertEnable) {sendText(1, target, 'target');}
			};
			if (tube2cur >= 0 && tubeAlertEnable[1]) {
				if (emailAlertEnable) {sendEmail(2, target, 'target');}
				if (phoneAlertEnable) {sendText(2, target, 'target');}
			};
			if (tube3cur >= 0 && tubeAlertEnable[2]) {
				if (emailAlertEnable) {sendEmail(3, target, 'target');}
				if (phoneAlertEnable) {sendText(3, target, 'target');}
			};
			if (tube4cur >= 0 && tubeAlertEnable[3]) {
				if (emailAlertEnable) {sendEmail(4, target, 'target');}
				if (phoneAlertEnable) {sendText(4, target, 'target');}
			};
		};

		setTimeout(function () {document.getElementById("experimentIcon").className = "fas fa-angle-right";}, 500);
		liveGraph();
	};

	$('#ClearLiveGraphButton').on('click', function () {
		$('#confirmClearLiveGraphModal').modal('show');
	});

	$('#confirmClearLiveGraphModalButton').on('click', function () {
		startingDataPoint = experimentCount+1;
		liveGraph();
	});


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
				<td >\
				<label class="custom-control custom-checkbox" >\
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
				<td>\
				<span class="hidden" id="hiddennotes'+i+'"></span>\
				<textarea class="form-control" id="notes'+i+'" rows="1" placeholder="Type to add notes"></textarea>\
				</td>\
				</tr>');
			
		};

		$('textarea').each(function(){    
			var id = $(this).attr('id');
			var data = JSON.parse(localStorage.getItem("exp"+id.slice(5)));
			var notesInput = data.notes;
			if (notesInput !== null) {
				$(String('#'+id)).val(notesInput);
			};
		});	
		
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
		setInterval(continuousUpdates, 5000);
	});

	function continuousUpdates(e) {
		if (hasRun) {
			// var retrievedObject = localStorage.getItem("exp"+experimentCount);
			// var e = JSON.parse(retrievedObject);
			$('#LastRun').text(moment(recentRun).fromNow());
		};
	};


	$('#ExportHistoryButton').on('click', exportHistory);
	function exportHistory(e) {
		$('textarea').each(function(){    
			var id = $(this).attr('id');
			var value = $(this).val();
			$(String('#hidden'+id)).text(value);
		});


		var exportTable = document.getElementById("tableToExport");
		var tableExportObject = new TableExport(exportTable, {
			formats: ['csv'], 
			exportButtons: false
		});
		var exportString = "jentube_export (" + moment().format("YYYY-MM-DD h.mm.ssA") + ")";
		var exportData = tableExportObject.getExportData()['tableToExport']['csv'];
		tableExportObject.export2file(exportData.data, exportData.mimeType, exportString, exportData.fileExtension);

	};

	var scatterChartLive;
	var livectx;
	function liveGraph(e) {
		if (scatterChartLive) { 
			scatterChartLive.destroy(); 
			livectx=undefined;
		}
		Chart.defaults.global.responsive = true;
		Chart.defaults.global.defaultFontColor = '#34495e';
		Chart.defaults.global.defaultFontStyle = 'bold';
		Chart.defaults.global.tooltips.bodyFontStyle = 'normal';
		Chart.defaults.global.tooltips.footerFontStyle = 'normal';
		Chart.defaults.global.animation.duration = 200;
		livectx = document.getElementById("liveChart");
		var color=["#D2B4DE","#3498DB","#2ECC71","#F8C471", "#000"];
		scatterChartLive = new Chart(livectx, {
			type: 'line',
			data: 
			{
				datasets: [{
					label: 'Tube 1',
					backgroundColor: "transparent",
					borderColor: color[0],
					pointBackgroundColor: color[0],
					pointBorderColor: color[0],
					pointHoverBackgroundColor:color[0],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(1, true))
				},
				{
					label: 'Tube 2',
					backgroundColor: "transparent",
					borderColor: color[1],
					pointBackgroundColor: color[1],
					pointBorderColor: color[1],
					pointHoverBackgroundColor:color[1],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(2, true))
				},
				{
					label: 'Tube 3',
					backgroundColor: "transparent",
					borderColor: color[2],
					pointBackgroundColor: color[2],
					pointBorderColor: color[2],
					pointHoverBackgroundColor:color[2],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(3, true))
				},
				{
					label: 'Tube 4',
					backgroundColor: "transparent",
					borderColor: color[3],
					pointBackgroundColor: color[3],
					pointBorderColor: color[3],
					pointHoverBackgroundColor:color[3],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(4, true))
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Optical Density vs. Time',
					fontSize: 18
				},
				legend: {
					display: true,
					position: "bottom",

				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							displayFormats: {
								'millisecond': 'h:mm:ssA',
								'second': 'h:mm:ssA',
								'minute': 'h:mm:ssA',
								'hour': 'h:mm:ssA',
								'day': 'h:mm:ssA',
								'week': 'h:mm:ssA',
								'month': 'h:mm:ssA',
								'quarter': 'h:mm:ssA',
								'year': 'h:mm:ssA',
							},
							tooltipFormat: "MM/DD h:mm:ssA",
						},
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'OD'
						}
					}]
				}, 
				tooltips: {
					enabled: true,
					mode: 'single',
					callbacks: {
						label: function(tooltipItems, data) { 
							return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel;
						}
					}
				}
			}	
		});
	};

	var ctx;
	var scatterChart;
	$('#GraphButton').on('click', graphHistory);

	function graphHistory(e) {
		if (scatterChart) { 
			scatterChart.destroy();
			ctx=undefined;
		}
		Chart.defaults.global.defaultFontColor = '#34495e';
		Chart.defaults.global.defaultFontStyle = 'bold';
		Chart.defaults.global.tooltips.bodyFontStyle = 'normal';
		Chart.defaults.global.tooltips.footerFontStyle = 'normal';
		ctx = document.getElementById("myChart");
		var color=["#D2B4DE","#3498DB","#2ECC71","#F8C471", "#000"];
		scatterChart = new Chart(ctx, {
			type: 'line',
			data: 
			{
				datasets: [{
					label: 'Tube 1',
					backgroundColor: "transparent",
					borderColor: color[0],
					pointBackgroundColor: color[0],
					pointBorderColor: color[0],
					pointHoverBackgroundColor:color[0],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(1, false))
				},
				{
					label: 'Tube 2',
					backgroundColor: "transparent",
					borderColor: color[1],
					pointBackgroundColor: color[1],
					pointBorderColor: color[1],
					pointHoverBackgroundColor:color[1],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(2, false))
				},
				{
					label: 'Tube 3',
					backgroundColor: "transparent",
					borderColor: color[2],
					pointBackgroundColor: color[2],
					pointBorderColor: color[2],
					pointHoverBackgroundColor:color[2],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(3, false))
				},
				{
					label: 'Tube 4',
					backgroundColor: "transparent",
					borderColor: color[3],
					pointBackgroundColor: color[3],
					pointBorderColor: color[3],
					pointHoverBackgroundColor:color[3],
					pointHoverBorderColor: color[4],
					data: eval(parseGraphData(4, false))
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Optical Density vs. Time',
					fontSize: 18
				},
				legend: {
					display: true,
					position: "bottom",

				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							displayFormats: {
								'millisecond': 'h:mm:ssA',
								'second': 'h:mm:ssA',
								'minute': 'h:mm:ssA',
								'hour': 'h:mm:ssA',
								'day': 'h:mm:ssA',
								'week': 'h:mm:ssA',
								'month': 'h:mm:ssA',
								'quarter': 'h:mm:ssA',
								'year': 'h:mm:ssA',
							},
							tooltipFormat: "MM/DD h:mm:ssA",
						},
						scaleLabel: {
							display: true,
							labelString: 'Time'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'OD'
						}
					}]
				}, 
				tooltips: {
					enabled: true,
					mode: 'single',
					callbacks: {
						label: function(tooltipItems, data) { 
							var noteString = tipData[tooltipItems.index+1];
							if (noteString == "") noteString = "N/A";
							return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel + ", Notes: " + noteString; 
						}
					}
				}
			}	
		});
	};


	// $('#graphModal').on('shown.bs.modal', updateGraph);
	// function updateGraph(e) {
 //    	// chart.update();

	// };

	var tipData = [];
	var startingDataPoint = experimentCount+1;
	var parseGraphData = function(inputNum, live) {
		var toAddData = "[";
		loadNotesIntoMemory();

		if (live) {
			for (var i=startingDataPoint; i <= experimentCount; i++) {
				var retrievedObject = localStorage.getItem("exp"+i); //console.log("retrievedObject= " + localStorage.getItem("exp"+i));
				var data = JSON.parse(retrievedObject);
				toAddData += "{ x: \"" + data.startTimeUnformatted + "\", y: " + eval("data.tube" + inputNum) + " },";
			};
		} else {
			for (var i=1; i <= experimentCount; i++) {
				if ($("#graphCheckbox"+i).prop("checked")) {
					var retrievedObject = localStorage.getItem("exp"+i); //console.log("retrievedObject= " + localStorage.getItem("exp"+i));
					var data = JSON.parse(retrievedObject);
					toAddData += "{ x: \"" + data.startTimeUnformatted + "\", y: " + eval("data.tube" + inputNum) + " },";
					tipData.push(data.notes);
				};
			};
		};

		toAddData += "]";
		return toAddData;
	};

	$('#AlertSettingsSaveButton').on('click', saveAlertConfig);
	function saveAlertConfig(e) {

		tubeAlertEnable[0] = $("#alertCheckTube1").prop("checked");
		tubeAlertEnable[1] = $("#alertCheckTube2").prop("checked");
		tubeAlertEnable[2] = $("#alertCheckTube3").prop("checked");
		tubeAlertEnable[3] = $("#alertCheckTube4").prop("checked");
		emailAlertEnable = $("#alertCheckEmail").prop("checked");
		phoneAlertEnable = $("#alertCheckPhone").prop("checked");

		targetVal = $('#targetOD').val();
		phoneVal = $('#alertPhoneInput').val();
		emailVal = $('#alertEmailInput').val(); 
		providerVal = $('#cellProviderSelect').val();

		if (
			(providerVal == "Choose..." && phoneAlertEnable) ||
			(phoneVal == "" && phoneAlertEnable) || 
			(emailVal == "" && emailAlertEnable) ||
			(targetVal == "") || 
			(tubeAlertEnable[0] == false && tubeAlertEnable[1] == false && tubeAlertEnable[2] == false && tubeAlertEnable[3] == false) ||
			(emailAlertEnable == false && phoneAlertEnable == false)

			){
			$('#invalidAlertSettingsModal').modal('show');
	} else {
		localStorage.setItem("alertTargetOD", targetVal);
		localStorage.setItem("alertUserEmail", emailVal);
		localStorage.setItem("alertUserPhoneNumber", phoneVal);
		localStorage.setItem("alertUserProvider", providerVal);
		notificationsConfigured = true;
		$('#AlertSettingsSaveAlert').fadeIn(200);
		$('#AlertSettingsSaveAlert').delay(2000).fadeOut(200);
	}
};


$('#SendEmailButton').on('click', sendE);
function sendE(e) {
	sendEmail(1, localStorage.getItem("alertTargetOD"), 'approach');
};
function sendEmail(targetTube, currentOD, type) {
	alertString = String("Tube " + targetTube + " is currently at OD " + currentOD);
	if (type == 'approach') alertString += ", approaching your target OD " + localStorage.getItem("alertTargetOD") + ".";
	if (type == 'target') alertString += ", and has hit your target OD.";

	Email.send("alerts@jensenlab.net",
		String(localStorage.getItem("alertUserEmail")),
		"JenTube Alert!",
		alertString,
		{token: "e61382df-687f-4fb4-9f8b-a92a53c69daf"}
		);
};

$('#SendTextButton').on('click', sendT);
function sendT(e) {
	sendText(1, localStorage.getItem("alertTargetOD"), 'approach');
};

function sendText(targetTube, currentOD, type) {
	alertString = String("Tube " + targetTube + " is currently at OD " + currentOD);
	if (type == 'approach') alertString += ", approaching your target OD " + localStorage.getItem("alertTargetOD") + ".";
	if (type == 'target') alertString += ", and has hit your target OD.";
	var provider = localStorage.getItem("alertUserProvider");
	var addressToString = String(localStorage.getItem("alertUserPhoneNumber")) + "@";
	
	if (provider == "att") {addressToString += "txt.att.net"};
	if (provider == "sprint") {addressToString += "messaging.sprintpcs.com"};
	if (provider == "tmobile") {addressToString += "tmomail.net"};
	if (provider == "verizon") {addressToString += "vtext.com"};
	if (provider == "virgin") {addressToString += "vmobl.com"};
	if (provider == "cricket") {addressToString += "sms.mycricket.com"};
	if (provider == "boost") {addressToString += "sms.myboostmobile.com"};
	if (provider == "alltel") {addressToString += "sms.alltelwireless.com"};
		//alert('Tube ' + targetTube + ' is currently at OD' + target + ' to ' + addressToString);
		Email.send("alerts@jensenlab.net",
			addressToString,
			"JenTube Alert!",
			alertString,
			{token: "e61382df-687f-4fb4-9f8b-a92a53c69daf"}
			);

	};
	liveGraph();
	

});

$('#startConnectionButton').on('click', StartSocket);
function StartSocket(e) {
	var connection = new WebSocket('ws://172.16.0.69:8000');
	connection.onopen = function () {
	  connection.send('Hey!'); // Send the message 'Ping' to the server
};



window.onbeforeunload = function() {
	loadNotesIntoMemory();

	//TO ADD: check if they want to save info
	localStorage.removeItem("alertTargetOD");
	localStorage.removeItem("alertUserEmail");
	localStorage.removeItem("alertUserPhoneNumber");
	localStorage.removeItem("alertUserProvider");
};

function loadNotesIntoMemory() {
	$('textarea').each(function(){    
		var id = $(this).attr('id'); 
		id = "exp"+id.slice(5);
		var retrievedObject = localStorage.getItem(id);
		var data = JSON.parse(retrievedObject); 
		data.notes = $(this).val();
		localStorage.setItem(id, JSON.stringify(data));
	}); 

}

