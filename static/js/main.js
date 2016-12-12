$(document).ready(function() {
  console.log("DOM ready")
})

function initMap() {
  var Amsterdam = {lat: 52.3702157, lng: 4.895167899999933};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: Amsterdam
  });

  var marker = new google.maps.Marker({
    position:Amsterdam,
    animation:google.maps.Animation.BOUNCE,
    map: map
  })

  map.data.setStyle({
    icon: '//example.com/path/to/image.png',
    fillColor: 'green'
  });


  $.post('/gpData', function (results) {
//      console.log(results)
    var infowindow = new google.maps.InfoWindow()

    function placeMarker(results) {
        var coords = results[i].latlong;
//        console.log(results[i].name)
        var name = results[i].name
        console.log(coords)
        var latLng = new google.maps.LatLng(coords[1],coords[0]);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        })
        google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent( "<div id='infowindow'>"+ name + "</br> <a href='/review'> Add review </a> </div>"  );
        infowindow.open(map, marker);
      }) 
    }

    for (var i = 0; i < results.length; i++) {
        placeMarker(results)
    }
    
  })
}