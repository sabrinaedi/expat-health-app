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
      for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1],coords[0]);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        })
      }
      console.log(results)
    })

  }
