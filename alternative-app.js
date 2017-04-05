function showUI(){
	$('button').removeClass('hide');
} //showUI

$(document).ready(function(){
	$('button').click(function(event){
		$(this).addClass('hide');
		$('#wait').removeClass('hide');
		initMap();
	}); //click function
}); //document.ready

var map;
var infowindow;
var labels = 'ABCDEFGHIJ';

function initMap() {
	navigator.geolocation.getCurrentPosition(function(position) {
    	var currentLocation = {
    		lat: position.coords.latitude,
    		lng: position.coords.longitude
    	}; //var currentLocation

    	$('#wait').addClass('hide');
    	map = new google.maps.Map(document.getElementById('map'), {
			    	center: currentLocation,
			    	zoom: 13
			    }); //map
	    var service = new google.maps.places.PlacesService(map);
	    var query = {
	    	location: currentLocation,
	    	keyword: 'coffee',
	    	rankBy: google.maps.places.RankBy.DISTANCE
	    };   //var query

	    service.nearbySearch(query, searchResults);
	    var currentPosition = new google.maps.Marker({
			    	position: currentLocation,
			    	map: map,
			    	label: 'You are here',
		    	}); //currentPosition

    	function searchResults(results, status) {
    		if (status === google.maps.places.PlacesServiceStatus.OK) {
		        $('#search-results').show();
		        google.maps.event.trigger(window.map, 'resize');
		        window.map.setCenter(currentLocation);
		        var coffeeShops = results.slice(0, 10);
		        coffeeShops.forEach(createMarker);
	    	} //if status=OK (searchResults)
    	} //searchResults

    	var infoWINDOW;
    	function createMarker(place, index){
    		var marker = new google.maps.Marker({
		        map: map,
		        label: labels[index],
		        position: place.geometry.location,
      		});   //var marker
    		
    		service.getDetails(place, function(details, status){
	            var $placeDetails = $('<li class="flex"></li>').appendTo('ul#results-list');
	            var $label = $('<div class="label"></div>').text(labels[index]).appendTo($placeDetails);
      			var $placeInfo = $('<div class="place"></div>').appendTo($placeDetails);
      			var $placeName = $('<p class="name">' + details.name + '</p>').appendTo($placeInfo);
      			var $placeAddress = $('<p class="address">' + details.vicinity + '</p>').appendTo($placeInfo);
      			var $placeNumber = $('<p class="number">' + details.formatted_phone_number + '</p>').appendTo($placeInfo);	
	        	$placeDetails.css('order', index);
	        	google.maps.event.addListener(marker, 'click', function() {
			        if (infoWINDOW) { infoWINDOW.close(); }
				        var infowindow = new google.maps.InfoWindow();
				        google.maps.event.addListener(infowindow,'closeclick',function(){
				        	$('ul#results-list li').removeClass('highlight');
				        }); //add listener closeclick
				        infoWINDOW = infowindow;
				        infowindow.setContent(place.name);
				        infowindow.open(map, this);
				        $('ul#results-list li').removeClass('highlight');
				        $placeDetails.addClass('highlight');
					}); //addListener function		
	        }); //getDetails
    	} //createMarker
    }); //getCurrentPosition
} //initMap

