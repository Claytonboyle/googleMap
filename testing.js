// testing.js

var app = angular.module("googleMap",['angularRangeSlider']);

	
app.factory("houseArrays",["$timeout",function($timeout){
        
    
       var angHouses = sampleHouses;
       var usersArray = [];

       var UserModel = function(fname,lname,phone,email,preferences,login,blacklistlogin,password){

            this.fname=fname || "";
            this.lname=lname || "";
            this.phone=phone || "";
            this.email = email || "";
            this.preferences = preferences || {};
            this.login = login || "guest";
            this.password = password || "1234";
       }

       UserModel.prototype.userName = function(){
            return (this.fname+" "+this.lname);
       }


       var Preferences = function(minPrice,maxPrice,minBeds,minBaths,minTotalSF,propertyType,favorites,blacklist){

            this.minPrice = minPrice || 40000;
            this.maxPrice = maxPrice || 40000;
            this.minBeds = minBeds || 0;
            this.minBaths = minBaths || 1;
            this.minTotalSF = minTotalSF || 500;
            this.propertyType = propertyType || "";

            this.favorites = favorites || new Object();
            this.blacklist = blacklist || new Object();
       }
       
//       var Favorites = function (object){
//           object["MLS Number"]:object,
//       }
//       

        return {
            fakeDB:angHouses,
            userClass:UserModel,
//            favoritesClass:Favorites,
            preferences:Preferences,
            factoryGeoCoder:function(map){}
        }
}]);
        



        

app.controller("appController",["$scope","houseArrays",function($scope,houseArrays){

    


	var s=$scope;
    
    //TESTING GROUND
   
    s.TEST = function(string){
        alert("THUMBS "+string+" MOFO");
        if (string=="UP"){
            if(s.myUser.preferences.favorites[s.housePointer["MLS Number"]]==undefined){
                s.myUser.preferences.favorites[s.housePointer["MLS Number"]]=angular.copy(s.housePointer);
                s.myUser.preferences.favorites[s.housePointer["MLS Number"]].addressString = s.createInfoBoxAddressString(s.housePointer);
                console.log(s.myUser.preferences.favorites);}
            }
    } //end thumbs up and down alert test
    
    //clear favorites
    s.clearFavorites =function (){
        s.myUser.preferences.favorites={};
        console.log("Cleared Favorites");
    }

        //create one user that we will use as current user
        s.userCreator = houseArrays["userClass"];
        s.preferencesCreator = houseArrays["preferences"];

        s.myUserPreferences = new s.preferencesCreator (10000,1000000,0,1,300);
        s.myUser = new s.userCreator ("Clayton","Boyle","720-238-9265","clayton.boyle@gmail.com",s.myUserPreferences,"boylec","kittycats");
        console.log(s.myUser);

        //slider values, 
        s.sliderBeds = s.myUser.preferences.minBeds || 0;
        s.sliderBaths = s.myUser.preferences.minBaths || 1;
        s.sliderMinSF = s.myUser.preferences.minTotalSF || 500;

        s.sliderMinPrice = s.myUser.preferences.minPrice || 40000;
        s.sliderMaxPrice = s.myUser.preferences.maxPrice || 40000;





    //create scope alias
    console.log("scope: ",s);
    //create houses array of all houses from fake DB
    s.angHouses = houseArrays["fakeDB"];
    //blank search string for search city/state field
	s.searchCity = "";
    //below I create a new geocoder object
    var geocoder = new google.maps.Geocoder();
    //below I create a new marker obj, that is used to delete the previous person marker
    var oldPersonMarker = new google.maps.Marker({position:google.maps.LatLng(0,0)});
    var personMarker=oldPersonMarker;
    //keep track of last opened window
    openWindow = new google.maps.InfoWindow()
    //infoBox show/hide once more info button is clicked in info window on marker
    s.infoActive = false;
    //create placeholder for map object
	var map;
    //house or apt icon shown, initialize to house
    s.iconPath="home.png";
    //what each map should zoom to
    var standardZoom = 12;
    
    function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
               center: {lat:39.7571357, lng: -105.028466},
               zoom: standardZoom
            });
        }
    

	initMap();

    //adds event so that when a user clicks anywhere on the map, it closes the open info window
    google.maps.event.addListener(map, "click", function(event) {
         openWindow.close();
        });

	console.log(map);

    s.closeInfoWindow = function(){
        openWindow.close();
    }
    s.bodyClick=function(){
        console.log("WE ARE CLICKING");
        s.infoActive=false;}

    //call this when we don't want the click to bubble up to body   
    s.stopPropagation = function(){
            event.stopPropagation();
    }

	s.newCenter= function(){
	// 	console.log(map);
		// map["center"] = {lat:33, lng: -90};
		// initMap({lat:33, lng: -90});
		var randLat,randLong;
		randLat = Math.random()*180 -90;
		randLong = Math.random()*360 -180;
		map.setCenter({lat:randLat, lng: randLong});
        map.setZoom(standardZoom);
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
                       
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(standardZoom);
                    //remove the old marker
                    oldPersonMarker.setMap(null);
                    //put the new position marker in
                     personMarker = new google.maps.Marker({
                         position: results[0].geometry.location,
                         title:"Here I Am!",
                         //set a person marker here!
                         icon:"personMarker.png"
                        });
                    //set oldmarker to the current marker, then log to double check
                    oldPersonMarker = personMarker;
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

    /* Add an array of markers to display for testing
    eventually we need to have some user selected options*/

    var displayHouseMarker = new google.maps.Marker({position:google.maps.LatLng(0,0)});
    var displayMarkerArray = [];

    for (var i=1;i<s.angHouses.length;i++){
        (function(){
            var house = s.angHouses[i];
            var lat = house["Latitude"];
            var lng = house["Longitude"];

            var markerImgUrl="";

            if (house["Type"].includes("Detached" || "detached"))
                markerImgUrl="houseMarker.png";
            else 
                markerImgUrl="townhouseMarker1.png"

            var displayHouseMarker = new google.maps.Marker({
                                position:{lat:lat,
                                          lng:lng},
                                    icon:markerImgUrl,
                                    title:house["MLS Number"],
                                     });
            
                    displayHouseMarker.addListener('click', function(){
                        //close the previous inforwindow if still open
                        openWindow.close();
                        //call the display house marker
                        showMLS(house,displayHouseMarker);
                     });
            // can add info window to the actual marker before pushing to array rather than creating it on click
            var contentString = createContentString(house);
            displayHouseMarker.infowindow = new google.maps.InfoWindow({
                        // content: contentString,
                        content:"",
                       });
            //attempted to have inforwindow create, then push content in to force a resize and eliminate horiz scroll bar
            displayHouseMarker.infowindow.setContent(contentString);

            //just in case saves the index of the house the marker refers to as a field
            displayHouseMarker.angHousesIndex = i;

            //we now have an ititial fake db array of houseMarkers, each with a MLS as the title
            displayMarkerArray.push(displayHouseMarker);
        })();//end IIFE

    }

    // re-enable this function below, just minimizing google marker hits
    for (pos in displayMarkerArray){
        displayMarkerArray[pos].setMap(map);
    }
     //function below just does 15 markers for testing to speed up reloads
//        for (var i=0;i<15;i++){
//            displayMarkerArray[i].setMap(map);
//        }

    //call this when you've updated your array of markers to display
    //have the logic done before calling this - black list & criteria
    function placeMarker(array){
        for (pos in array){
            if (array[pos]!=null)
                array[pos].setMap(map);
            // else
            //     array[pos].setMap(null);
        }
        return ("returning from placeMarkers(array) function")
    }

    //here we can edit what going in the info window box
    function createContentString(house) {
        // var stringContent = "MLS# "+house["MLS Number"]+"\n Price: "+ house["List Price"];
        s.house=house;
        //adds commas to the price, and puts it back into the house object
        priceComma=house["List Price"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
             
        var stringContent = '<div class="infoWindowPrice">'+  
            '<h4><strong>'+
            ' $'+
            priceComma+
            '</strong></h4>'+
            '</div>'+
            '<button class="infoButton" onclick="angular.element(this).scope().moreInfoButton('+ house["MLS Number"] + ')">More Info</button>';

        return stringContent;

    }

    //BUTTON FOR THE INFO POP UP
    s.moreInfoButton = function(){
        event.stopPropagation();
        console.log("Non-ang: THIS SHIT IS WORKING!! "+ arguments[0]);
       
        var mls = arguments[0];
        s.$apply( function(){
            
            s.position = s.positionFind(mls);
            s.housePointer = s.angHouses[s.position];
            //calls createInfoBoxAddressString to concat the address info
            s.addressString = s.createInfoBoxAddressString(s.housePointer);

            if (s.housePointer["Type"].includes("Detached" || "detached"))
                s.iconPath="home.png";
            else 
                s.iconPath="townhome.jpg"
            
            //console.log(s.housePointer);
            //this shows the info box on screen - do all logic before showing it
            s.infoActive = true;

        });

        //this should ideally have a div pop up into the lower half of the screen with more info, and ability to add to favorites list for the client

        //wrap anything, since we're in the  in s.$apply (function(){
               //my stuff  }
    }

    s.positionFind = function(mls){
        for (var i=0;i<s.angHouses.length;i++){
            if (s.angHouses[i]["MLS Number"]==mls){
                return s.angHouses.indexOf(s.angHouses[i])
            }

        }
    }

    s.createInfoBoxAddressString = function (housePointer){
        //for the address
        return (housePointer["Street #"]+" "+
        housePointer["Street Dir"]+" "+
        housePointer["Street Name"]+" "+
        housePointer["Street Type"]+", "+
        housePointer["Unit #"]  +" "+       //only if populated
        housePointer["City"] +" "+
        housePointer["Zip Code"]);

    }

    function showMLS (house,displayHouseMarker){
        console.log("MLS OF SELECTED PIN: ", house["MLS Number"]," ",house["List Price"],"POS IN ARRAY: ",s.angHouses.indexOf(house));
      
        displayHouseMarker.infowindow.open(map,displayHouseMarker);

        //s.$apply();

        openWindow = displayHouseMarker.infowindow;
        //close the window after 10 seconds no matter what
        // setTimeout(function () { openWindow.close(); }, 10000);

    }

    s.addComma =function (num){
        num = parseInt(num);

        if (num!=undefined && isNaN(num)!=true)
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

    //changing criteria logic 

            //prints updated user info, called in criteria modal
        s.printUser = function () {
            console.log(s.myUser);}
        //update current user preferences
        s.changeCriteria = function(){
            s.myUser.preferences.minBeds = s.sliderBeds;
            s.myUser.preferences.minBaths = s.sliderBaths;
            s.myUser.preferences.minTotalSF = s.sliderMinSF;

            s.myUser.preferences.minPrice = s.sliderMinPrice;
            s.myUser.preferences.maxPrice = s.sliderMaxPrice;

            //console logs user object
            // s.printUser();

            //updates the display Markers array to show preferences.
            console.log("Removing all markers from map only.")
            for (pos in displayMarkerArray){
                displayMarkerArray[pos].setMap(null);
            }
            s.updateMarkersDisplayed();
        }

        s.updateMarkersDisplayed = function (){
            //use display marker array to make a new array to pass to the print array function
            //placeMarkers(array)
            var trimArray = [];
            var testHouse = {};

            for (pos in displayMarkerArray){
                    testHouse = s.angHouses[displayMarkerArray[pos].angHousesIndex];
                    // console.log(displayHouseMarker);
                    // console.log("index number ",displayHouseMarker.angHousesIndex);
                    // console.log("TEST HOUSE: ",testHouse)

                    if (s.houseCheck(testHouse)==true){
                        trimArray.push(displayMarkerArray[pos]);
                   
                }
                //call the place marker function;
                placeMarker(trimArray);
            }
        } //end updateMarkersDisplayed

        //must use this function, called by updateMarkersDisplayed, to see if house should be displayed or not
        s.houseCheck = function(testHouse){
            //return true or false
            //use s.myUser.preferences and the blacklist to see if it should be shown
            if (s.myUser.preferences.minBeds>testHouse["Total Bedrooms"])
                return false;
            if (s.myUser.preferences.minBaths>testHouse["Total Baths"])
                return false;
            if (s.myUser.preferences.minTotalSF>testHouse["SqFt Total"])
                return false;

            //previously used .replace(/,/g , "") to remove commas that were formatted into price

            if (s.myUser.preferences.minPrice>testHouse["List Price"])
                return false;
            if (s.myUser.preferences.maxPrice<testHouse["List Price"])
                return false;
            //put blacklist logic here
            return true;
        };

}]);//end controller

//add a div around the map and the info window for proper positioning

/*

    use $event.stopPropogation in the infoWindow 

*/

/*

    var tasks=[];
  for (var i=1;i<20;i++)
            {
            
                (function(i){
                    tasks.push(function(cb){

                
                            
                        console.log("i "+i);
                            var house = sampleHouses[i];
                            delete house['FIELD1'];
                            delete house['FIELD2'];

                            address = house['Address']+" "+house['City']+" "+house['Zip'];

                            geocoder.geocode( { 'address': address}, function(results, status) {

                                console.log("Are we in here?", google.maps.GeocoderStatus);

                                if (google.maps.GeocoderStatus.OVER_QUERY_LIMIT != "OVER_QUERY_LIMIT") {

                                   house["Latitude"]=results[0].geometry.location.lat(); //mayber invoke again
                                   house["Longitutde"]=results[0].geometry.location.lng();

                                   console.log("Lat long entered! Success.");


                                } else {

                                            console.log("Failed resolve address.\n " + status);
                                }

                                angHouses.push(house);

                                $timeout(function(){
                                    cb();
                                },1500);

                            });
                 })//total pushed
                                        })(i)

             } //end for loop
    
        async.series(tasks,function(){
            console.log("FINISHED");});

            console.log("taks "+tasks.length,tasks[0]);
            console.log("sampleHouses length: " + sampleHouses.length);
*/












