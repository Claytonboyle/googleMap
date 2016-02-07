// testing.js

var app = angular.module("googleMap",[]);

	

        

        

        // var newMap = function (center,zoom){

        // 	map = new google.maps.Map(document.getElementById('map'), {
        //        center: center,
        //        zoom: zoom
        //     });



        

app.controller("appController",["$scope",function($scope){

	var s=$scope;

	var map;
         function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
               center: {lat:39.7571357, lng: -105.028466},
               zoom: 12
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
		console.log(randLat,randLong);
		

	}	


}]);



