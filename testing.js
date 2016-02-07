// testing.js

var app = angular.module("googleMap",[]);

	

        

        

        // var newMap = function (center,zoom){

        // 	map = new google.maps.Map(document.getElementById('map'), {
        //        center: center,
        //        zoom: zoom
        //     });



        

app.controller("appController",["$scope",function($scope){

	var s=$scope;

	s.searchCity = "";
        //below I create a new geocoder object
    var geocoder = new google.maps.Geocoder();
    //below I create a new marker obj, that is used to delete the previous person marker
    var oldMarker = new google.maps.Marker({position:google.maps.LatLng(0,0)});

	var map;
    
    function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
               center: {lat:39.7571357, lng: -105.028466},
               zoom: 11
            });
        }

	initMap();

	console.log(map);


	s.newCenter= function(){
	// 	console.log(map);

		// map["center"] = {lat:33, lng: -90};
		// initMap({lat:33, lng: -90});

		var randLat,randLong;

		randLat = Math.random()*180 -90;
		randLong = Math.random()*360 -180;
		map.setCenter({lat:randLat, lng: randLong});
        map.setZoom(11);
		console.log(randLat,randLong);
		

	}	
    

    
	s.consoleCity = function(){
		console.log(s.searchCity);
        
        //make below function an IIFE so it executes when consoleCity does
        (function codeAddress() {
            var address = s.searchCity;
            
            geocoder.geocode( { 'address': address}, function(results, status) {
                
                console.log("Are we in here?");
                
                if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results[0].geometry.location);
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(11);
                    //remove the old marker
                    oldMarker.setMap(null);
                    //put the new position marker in
                     marker = new google.maps.Marker({
                         position: results[0].geometry.location,
                         title:"Hello World!"
                        });
                    //set oldmarker to the current marker
                    oldMarker = marker;
                    console.log(marker);
                // To add the marker to the map, call setMap();
                    marker.setMap(map);
                } else {
                        alert("Could not resolve the address.\n " + status);
                }
                
                marker.addListener('click', toggleBounce);
            });
  }());


        function toggleBounce() {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        }

        
        //reset the field
        s.searchCity="";

	}

   

}]);



