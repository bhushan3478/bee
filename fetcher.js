
var BikesData = []
$(document).ready(function() {

	getBikesData(function(bikes){
		BikesData = bikes
		intitateMap()
		getLowBattery(function(result){
	    	console.log(result)
	    	var lowBatteryElem = document.getElementById('lowBatteryElem')
	      	lowBatteryElem.innerHTML = result
	    })
	})
    

    getBikeReport(function(result){
    	console.log(result)
    	var warningElem = document.getElementById('warningElem')
      	warningElem.innerHTML = result.length
      	populateDoghnutChart(result)
    })

    getAllUsers(function(result){
    	console.log(result)
    	var userElem = document.getElementById('userElem')
      	userElem.innerHTML = result.length
    })

    getAllAppDeviceInfo(function(result){
    	console.log(result)
    	var devicesElem = document.getElementById('devicesElem')
      	devicesElem.innerHTML = result.length
    })
    
})

function getAllUsers(callback){
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'http://54.88.119.46:4231/bee/v1/user/getAllUsers',
		//data: 'mode=stopRide&grno='+grno+'&vehicleno='+vehicleno+'&secret='+getSecret(),
		success: function(data){
			callback(data)
		}
	})
}

function getAllAppDeviceInfo(callback){
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'http://54.88.119.46:4231/bee/v1/user/getAllAppDeviceInfo',
		//data: 'mode=stopRide&grno='+grno+'&vehicleno='+vehicleno+'&secret='+getSecret(),
		success: function(data){
			callback(data)
		}
	})
}

function getBikesData(callback){

	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'http://54.88.119.46:4231/bee/v1/bike/getBikesData', 
		//data: 'mode=stopRide&grno='+grno+'&vehicleno='+vehicleno+'&secret='+getSecret(),
		success: function(data){
			console.log(data)
			callback(data)
		}
	})
}

function getLowBattery(callback){
	
	var lowBatteryCount = 0
	for(var i=0;i<BikesData.length;i++){
		if(BikesData[i]['remainingKm'] <= 40){
			lowBatteryCount++
		}
	}
	callback(lowBatteryCount)
	
}



function getBikeReport(callback){
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'http://54.88.119.46:4231/bee/v1/report/getBikeReport', 
		//data: 'mode=stopRide&grno='+grno+'&vehicleno='+vehicleno+'&secret='+getSecret(),
		success: function(data){
			callback(data);
		}
	})
}

function populateDoghnutChart(reportData){
	var damagedComponentsObject = {}
	console.log(reportData)
	for(var i=0;i<reportData.length;i++){

		for(var j=0;j<reportData[i]['damagedComponents'].length;j++){
			//console.log(reportData[i]['damagedComponents'][j])
			if(damagedComponentsObject.hasOwnProperty(reportData[i]['damagedComponents'][j])){
				damagedComponentsObject[reportData[i]['damagedComponents'][j]]++
			}
			else{
				damagedComponentsObject[reportData[i]['damagedComponents'][j]] = 1
			}
		}
		
	}
 
	var HEXCodes = [
		"#00afff",
		"#CD9575",
		"#76FF7A",
		"#78DBE2",
		"#CC6666",
		"#FFA474",
		"#FAE7B5",
		"#F8D568",
		"#FFBCD9",
		"#000000",
		"#5D76CB"
		
	]
	//console.log(damagedComponentsObject)
	var datasetsData = []
	var dmgDataKeys = Object.keys(damagedComponentsObject)
	for(var i=0;i<dmgDataKeys.length;i++){
		datasetsData.push(damagedComponentsObject[dmgDataKeys[i]])
	}
	//console.log(datasetsData)
	var myDoughnutChart = new Chart(doughnutChart, {
		type: 'doughnut',
		data: {
			datasets: [{
				data: datasetsData,
				backgroundColor: HEXCodes
			}],

			labels: dmgDataKeys
		},
		options: {
			responsive: true, 
			maintainAspectRatio: false,
			legend : {
				position: 'bottom'
			},
			layout: {
				padding: {
					left: 20,
					right: 20,
					top: 20,
					bottom: 20
				}
			}
		}
	});
}

function intitateMap(){
	var mapMarkers = new GMaps({
		div: '#map-markers',
		zoom: 15,
		disableDefaultUI: true,
		lat: 18.455555,//18.488528, , 
		lng: 73.932682,//73.8572803,
	});

	
	/*<div class="info_content" style="padding-left: 15px">
	   <h3 id="vehicleno" style="margin-bottom:0px;padding-top: 17px;">'+result[i]['bikeId'] +'</h3>
	   <div class="row">
	      <div class="column">
	         <p class="infoWindowContent"> <i style="color:#00dc00 !important" class="fa fa-battery-'+Math.ceil((result[i]['remainingKm'])/15)+'"></i> '+(result[i]['remainingKm'])*2+'%</p>
	      </div>
	      <div class="column">
	         <p class="infoWindowContent">'+result[i]['remainingKm']+'kms Range</p>
	      </div>
	   </div>
	   <div class="row">
	      <div class="column">
	         <p class="infoWindowContent"> <i style="color:#00dc00 !important" class="'+isAvailable+'"></i>'+(result[i]['remainingKm'])*2+'%</p>
	      </div>
	      <div class="column">
	         <p class="infoWindowContent">'+result[i]['remainingKm']+'kms Range</p>
	      </div>
	   </div>
	</div>*/

	for (var i = BikesData.length - 1; i >= 0; i--) {
		var isAvailable =""
		var isAvailableText =""
		var isAvailableColor =""
		if(BikesData[i]['isAvailable']){
		 	isAvailable = "fas fa-parking"
		 	isAvailableText = " Parked"
		 	isAvailableColor ="ef5350"
		}
		else{
			isAvailable = "fas fa-bicycle"
			isAvailableText = " Riding"
			isAvailableColor = "8bc34a"
		}

		var date = new Date(BikesData[i]['lastNoGpsSignalTime']*1000)
		console.log(isAvailable)
		mapMarkers.addMarker({
			lat: BikesData[i]['lat'],
			lng: BikesData[i]['lng'],
			title: 'Lima',
			details: {
				database_id: 42,
				author: 'HPNeo'
			},
			infoWindow: {
			  content: '<div class="info_content" style="padding-left: 15px"><h3 id="vehicleno" style="margin-bottom:0px;padding-top: 17px;">'+BikesData[i]['bikeId'] +'</h3><div class="row"><div style="width: 50%"><p class="infoWindowContent"> <i style="color:#00dc00 !important" class="fa fa-battery-'+Math.ceil((BikesData[i]['remainingKm'])/15)+'"></i> '+(BikesData[i]['remainingKm'])*2+'%</p></div><div style="width: 50%"><p class="infoWindowContent"> <i style="color:#673ab7 !important" class="fas fa-gas-pump"></i> '+BikesData[i]['remainingKm']+'kms</p></div></div><div class="row"><div style="width: 50%"><p class="infoWindowContent"> <i style="color:#'+isAvailableColor+' !important" class="'+isAvailable+'"></i> '+isAvailableText+'</p></div><div style="width: 50%"><p class="infoWindowContent"><i style="color:#616161 !important" class="far fa-clock"></i> '+date.getDate()+"/"+date.getMonth()+" "+date.getHours()+":"+date.getMinutes()+'</p></div></div></div>'

			}
		});
	}
	
}

