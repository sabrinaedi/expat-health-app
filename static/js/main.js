$(document).ready(function() {
  console.log("DOM ready")
  $('select').material_select()
  languages()
  initMap()
  $('.modal-trigger').leanModal()
//  $('#modal1').modal('open')
  $('#modal1').closeModal();

})

function languages () {
//  console.log('something is happening')
  $.get("/getLanguage", function (data, stat) {

//    console.log("the ajax requests works as it should")

    var select = document.getElementById('pickLanguage')
    var options = data

//    console.log(options)

    for(var i = 0; i < options.length; i++) {
      var opt = options[i]
      var el = document.createElement("option")
      el.textContent = opt
//      console.log(opt)
      el.value = opt
      select.appendChild(el)
//      console.log(el)
    }

    $('select').material_select()
  })
}

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


  $.get('/gpData', function (results) {
//      console.log(results)
    var infowindow = new google.maps.InfoWindow()

    function placeMarker(results, i) {
        var coords = results.data[i].latlong;
//        console.log(results[i].name)
        var name = results.data[i].name
        var id = results.data[i].id
        var address = results.data[i].address
        var internet = results.data[i].internet

        var reviewArr = []


        if (results.data[i].reviews.length > 0) {
          for (var x = 0; x < results.data[i].reviews.length; x++) {
            var rating = []
              function createStars ( y ) {
                var star = " "
                for ( var x = 0; x < y ; x++) {
                  star += "*" 
                }
                  rating.push( star )
              }
            createStars(results.data[i].reviews[x].rating)
            reviewArr.push("<div class='box'><div align='right'>Rating: <p style='font-size:20px'>" + rating + "</p></div><br>" + results.data[i].reviews[x].comment + "</div>")

//            console.log(results.data[i].reviews)

//            var reviewStr = "<div class='box'><div align='right'>Rating: <p style='font-size:20px'>" + rating + "</p></div><br>" + results.data[i].reviews[x].comment + "</div>"
//          console.log(results.data[i].reviews[x])
//           console.log(reviewArr)
          }
        } else {
          var reviewArr = "<p>There are no reviews for this practice yet!</p>"
        }

//      var reviewStr = (results.data[i].reviews.length > 0) ? results.data[i].reviews[x].rating + "<br>" + results.data[i].reviews[x].comment : "No review"
//      console.log(results.data[i].reviews[i].comment)
//        if (results.data[i].reviews.length > 0) console.log(results.data[i].name)

//        console.log(coords)
        var latLng = new google.maps.LatLng(coords[1],coords[0]);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        })

        marker.reviewArr = reviewArr
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.close(); // Close previously opened infowindow
          infowindow.setContent( "<div id='infowindow'><div id='iw-container'><div class='iw-title'>"+ name + "</div><div class='info'>" + address + "<br>" + internet + "<br><br><br><br><p>User Reviews</p><a href='/review/new?id=" + id + "'>Write a Review </a><br><br>" + this.reviewArr + "<br><br><br> </div></div></div>"  );
          infowindow.open(map, marker);
      }) 
    }

    for (var i = 0; i < results.data.length; i++) {
//      console.log(results[i].id)
//      console.log(results.data[i])
      placeMarker(results, i)
    }
  })
}