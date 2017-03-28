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

function initMap() {
	navigator.geolocation.getCurrentPosition(function(position) {
    	var currentLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
    	map = new google.maps.Map(document.getElementById('map'), {
	      center: currentLocation,
	      zoom: 13
	    }); //map

	    var service = new google.maps.places.PlacesService(map);
	    var query = {
	      location: currentLocation,
	      keyword: 'coffee',
	      radius: '5000'
	    };   //var query

	    service.nearbySearch(query, searchResults);
	    var currentPosition = new google.maps.Marker({
	      position: currentLocation,
	      map: map,
	      label: 'You are here',
    	}); //currentPosition

    	function searchResults(results, status) {
    		if (status === google.maps.places.PlacesServiceStatus.OK) {
    			$('#wait').addClass('hide');
		        $('#search-results').removeClass('hide');
		        var coffeeShops = results.slice(0, 10);
		        coffeeShops.forEach(createMarker);
	    	} //if status=OK (searchResults)
    	} //searchResults

    	var infoWINDOW;
    	function createMarker(place){
    		var marker = new google.maps.Marker({
		        map: map,
		        position: place.geometry.location,
      		});   //var marker

      		google.maps.event.addListener(marker, 'click', function() {
		        if (infoWINDOW) { infoWINDOW.close(); }
		        var infowindow = new google.maps.InfoWindow();
		        infoWINDOW = infowindow;
		        infowindow.setContent(place.name);
		        infowindow.open(map, this);

		        service.getDetails(place, function(details, status){
	         		if (status === google.maps.places.PlacesServiceStatus.OK) {
	            		infowindow.setContent(details.name);
	            		var $placeDetails = $('<li></li>').appendTo('ul#results-list');
      					var $placeInfo = $('<div></div>').appendTo($placeDetails);
      					var $placeName = $('<p class="name">' + details.name + '</p>').appendTo($placeInfo);
      					var $placeAddress = $('<p class="address">' + details.vicinity + '</p>').appendTo($placeInfo);
      					var $placeNumber = $('<p class="number">' + details.formatted_phone_number + '</p>').appendTo($placeInfo);	
	        		}  //if status=OK (getDetails)
	        	});   //getDetails

		    }); //addListener function
    	} //createMarker function

    }); //getCurrentPosition
} //initMap