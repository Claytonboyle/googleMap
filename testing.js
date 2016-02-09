// testing.js

var app = angular.module("googleMap",[]);

	
app.factory("houseArrays",["$timeout",function($timeout){
        

        var angHouses = [];

        //we need to add lat and long to each fucking one
       var geocoder = new google.maps.Geocoder();
       

       var address = "";
       var i=0;



       while(i<sampleHouses.length){
        
        if (i>500){
            break;
        }

        (function(i){

            $timeout(function(){
                    var house = sampleHouses[i];
                    delete house['FIELD1'];
                    delete house['FIELD2'];
                 
                    address = house['Address']+" "+house['City']+" "+house['Zip'];

                    geocoder.geocode( { 'address': address}, function(results, status) {
                        
                        console.log("Are we in here?", google.maps.GeocoderStatus);
                        
                        if (status == google.maps.GeocoderStatus.OK) {
                               
                           house["Latitude"]=results[0].geometry.location.lat; //mayber invoke again
                           house["Longitutde"]=results[0].geometry.location.lng;

                           console.log("Lat long entered!");
                           // i++;
                           // console.log(house);

                        } else {
                                
                                    // i++;// alert("Could not resolve the address.\n " + status);
                        }

                        angHouses.push(house);
                        
                        // personMarker.addListener('click', toggleBounce);
                    });

                    console.log("inside: "+ i );
            },1100);

             ;   })(++i)


                console.log("outside: "+ i);


           

        } //end for loop

        console.log("angHouses "+angHouse.length)

        return {
            fakeDB:angHouses,

            factoryGeoCoder:function(map){}
        }

        // var newMap = function (center,zoom){
}]);
        // 	map = new google.maps.Map(document.getElementById('map'), {
        //        center: center,
        //        zoom: zoom
        //     });



        

app.controller("appController",["$scope","houseArrays",function($scope,houseArrays){

    


	var s=$scope;
    s.angHouses = houseArrays["fakeDB"];

    console.log("First house:" + s.angHouses[0]);


	s.searchCity = "";
        //below I create a new geocoder object
    var geocoder = new google.maps.Geocoder();
    //below I create a new marker obj, that is used to delete the previous person marker
    var oldPersonMarker = new google.maps.Marker({position:google.maps.LatLng(0,0)});
    var personMarker=oldPersonMarker;

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
                       
                        console.log("Results[0]"+results[0]);
                        for (attrib in results[0]){
                            console.log(results[0][attrib],attrib);


                        }
                        console.log(results);
                        console.log("item at 0 in results array: "+typeof results);
                       
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(11);
                    //remove the old marker
                    oldPersonMarker.setMap(null);
                    //put the new position marker in
                     personMarker = new google.maps.Marker({
                         position: results[0].geometry.location,
                         title:"Hello World!"
                        });
                    //set oldmarker to the current marker
                    oldPersonMarker = personMarker;
                    console.log(personMarker);
                // To add the marker to the map, call setMap();
                    personMarker.setMap(map);
                } else {
                        if (s.searchCity=="")
                            ;
                        else
                            alert("Could not resolve the address.\n " + status);
                }
                
                personMarker.addListener('click', toggleBounce);
            });
  }());


        function toggleBounce() {
          if (personMarker.getAnimation() !== null) {
            personMarker.setAnimation(null);
          } else {
            personMarker.setAnimation(google.maps.Animation.BOUNCE);
          }
        }

        
        //reset the field
        s.searchCity="";

	}

   

}]);



