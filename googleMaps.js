//googlemaps.js


var app = angular.module("googleMap",['uiGmapgoogle-maps']).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key:'AIzaSyD5ylZNoESDoX9aOsHGMwc-91sK-YpfzQg',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

app.controller('appController',['$scope','uiGmapGoogleMapApi',function($scope,uiGmapGoogleMapApi){
    
    var s=$scope;
    
    s.angMap = uiGmapGoogleMapApi.then(function(maps) {
         });
    s.angMap.center = {lat:39, lng: -105} ;
    s.angMap.zoom = 12;                                    
                                       
                                       
    
//    s.angMap = { 
//        
//        center: {lat:39, lng: -105},
//        zoom: 12 };

    
    
    
}]); //end appController