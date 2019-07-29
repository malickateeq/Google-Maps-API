var directionsDisplay;  
var directionsService;  
function myMap() 
{
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var geocoder = new google.maps.Geocoder;

    var mapProp= {
      center:new google.maps.LatLng(33.6844 ,73.0479),
      zoom:5,
    };
    var map = new google.maps.Map(document.getElementById("map"),mapProp);

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(function(position) 
        {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        geocoder.geocode({'location': pos}, function(results, status) 
        {
            if (status === 'OK') 
            {
              if (results[0]) {
                map.setZoom(11);

                var marker = new google.maps.Marker({
                  position: pos,
                  map: map
                });
                // infowindow.setContent(results[0].formatted_address);
                document.getElementById('from').value = results[0].formatted_address;
                // infowindow.open(map, marker);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });

        // //Add circle
        // var place = autocomplete_from.getPlace();
        // // infowindow.setContent('<div><strong>' + place.name + 
        // //   '</strong><br>' + address + "<br>" + place.geometry.location);
        // var start = place.geometry.location;
        // var marker = new google.maps.Marker({
        //     position: start,
        //     map: map,
        //     title: 'some location'
        //   });

        // var circle = new google.maps.Circle({
        //     map: map,
        //     radius: 16093,    // 10 miles in metres
        //     fillColor: '#AA0000'
        // });
        // circle.bindTo('center', marker, 'position');
        // end Add Circle

        infoWindow.setPosition(pos);
        infoWindow.setContent('My location.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }

    //Autocomplete
    var input_from = document.getElementById('from');
    var autocomplete_from = new google.maps.places.Autocomplete(input_from);
    autocomplete_from.bindTo('bounds', map);

    
    var input_from = document.getElementById('to');
    var autocomplete_to = new google.maps.places.Autocomplete(input_from);
        autocomplete_to.bindTo('bounds', map);


    google.maps.event.addListener(autocomplete_from, 'place_changed', function() {
    });

    google.maps.event.addListener(autocomplete_to, 'place_changed', function() 
    {
        var place = autocomplete_to.getPlace();
        var end = place.geometry.location;

        var marker = new google.maps.Marker({
            position: end,
            map: map
        });
        var circle = new google.maps.Circle({
            map: map,
            radius: 2000,    // 10 miles in metres
            fillColor: '#eb4444'
        });
        circle.bindTo('center', marker, 'position');

        var circle2 = new google.maps.Circle({
            map: map,
            radius: 5000,    // 10 miles in metres
            fillColor: '#D3D3D3'
        });
        circle2.bindTo('center', marker, 'position');
        marker.setVisible(false);
            
    });

    directionsDisplay.setMap(map);
}

function calcRoute() {
    var start = document.getElementById('from').value;
    var end = document.getElementById('to').value;

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) 
        {
          // console.log(response);
            directionsDisplay.setDirections(response);
            computeTotalDistance(response);
            // calculateDistance();            
            console.log("Overview path length: (km) " + response.routes[0].overview_path.length);
        }
    });
}

function computeTotalDistance(result) 
{
    var total = 0;
    var myroute = result.routes[0];
    for (i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
    }
    total = total / 1000.
    document.getElementById("total").innerHTML = total + " km";

    //Adding circle
    // var circle = new google.maps.Circle({
    //     map: map,
    //     radius: 16093,    // 10 miles in metres
    //     fillColor: '#AA0000'
    // });
    // circle.bindTo('center', marker, 'position');
}

function calculateDistance() 
{
  var bounds = new google.maps.LatLngBounds();
  var path = [];
  var startPoint = document.getElementById('from');
  var endPoint = document.getElementById('to');
  var geocoderStart = new google.maps.Geocoder();
  var geocoderEnd = new google.maps.Geocoder();
  var coordsStart, coordsEnd;

  geocoderStart.geocode({
    'address': startPoint
  }, function(response, status) {
    if (status != google.maps.GeocoderStatus.OK) {
      alert('Geocode of first address failed: ' + status);
    }
    coordsStart = response[0].geometry.location;
    bounds.extend(coordsStart);
    var startMark = new google.maps.Marker({
      position: coordsStart,
      map: map,
      title: "start"
    });
    path.push(coordsStart);
    geocoderEnd.geocode({
      'address': endPoint
    }, function(response, status) {
      if (status != google.maps.GeocoderStatus.OK) {
        alert('Geocode of second address failed: ' + status);
      }
      coordsEnd = response[0].geometry.location;
      bounds.extend(coordsEnd);
      var endMark = new google.maps.Marker({
        position: coordsEnd,
        map: map,
        title: "end"
      });
      path.push(coordsEnd);
      var polyline = new google.maps.Polyline({
        path: path,
        map: map
      });
      var distance = (google.maps.geometry.spherical.computeDistanceBetween(coordsStart, coordsEnd) / 1000).toFixed(2);
      document.getElementById("total").innerHTML = distance + " direct";
      map.fitBounds(bounds);
    });
  });
}