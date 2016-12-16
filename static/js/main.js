$(document).ready(function() {
  console.log("DOM ready")
  $('select').material_select()
  languages()
  initMap()
  $('.modal-trigger').leanModal()
//  $('#modal1').modal('open')
  $('#modal1').closeModal();
})

var globalmarkers = []

var deleteMarkers = function () {
        clearMarkers();
        markers = [];
      }

var setMapOnAll = function (map) {
  for (var i = 0; i < globalmarkers.length; i++) {
    globalmarkers[i].setMap(map);
  }
  if(!map) {
//    console.log("Clear global array")
    globalmarkers = []
  }
}

function languages () {
  $.get("/getLanguage", function (data, stat) {
    var select = document.getElementById('pickLanguage')
    var options = data
    for(var i = 0; i < options.length; i++) {
      var opt = options[i]
      var el = document.createElement("option")
      el.textContent = opt
      el.value = opt
      select.append(el)
    }
    $('select').material_select()
  })
}

function initMap() {
  var Amsterdam = {lat: 52.3702157, lng: 4.895167899999933};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: Amsterdam,
    styles: [
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
  });


function placeMarker(results, i) {
  var infowindow = new google.maps.InfoWindow()

  var coords = results.data[i].latlong;
  var name = results.data[i].name
  var id = results.data[i].id
  var address = results.data[i].address
  var internet = results.data[i].internet

  var reviewArr = []
  var iconLang = '/../css/png/nl.png'


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

      var comment = ""
      if (results.data[i].reviews[x].comment !== undefined) {
        comment = results.data[i].reviews[x].comment
      }

      var langStr = results.data[i].reviews[x].language

      createStars(results.data[i].reviews[x].rating)

      if (results.data[i].reviews[x].language == 'English') {
        iconLang = '/../css/png/gb.png'
      } else if (results.data[i].reviews[x].language == 'French') {
        iconLang = '/css/png/fr.png'
      }
      else {
        iconLang = '/../css/png/nl.png'
      }

      var ehic = "N/A"

      if (results.data[i].reviews[x].ehic == "1") {
        ehic = "accepted"
      } else if (results.data[i].reviews[x].ehic == "2") {
        ehic = "accepted, but only reimbursed afterwards"
      } else if (results.data[i].reviews[x].ehic == "3") {
        ehic = "not accepted"
      } else if (results.data[i].reviews[x].ehic == "4") {
        ehic = "N/A"
      }      
      reviewArr.push("<div class='box'><div align='right' style='font-size:20px'>" + rating + "</div><p>Language: " + langStr + "</p><p>EHIC: " + ehic + "</p><br>" + comment + "</div>")
   }

  } else {
    var reviewArr = "<p>There are no reviews for this practice yet!</p>"
  }
  var latLng = new google.maps.LatLng(coords[1],coords[0]);


  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: iconLang
  })
  globalmarkers.push(marker);


  marker.reviewArr = reviewArr
  google.maps.event.addListener(marker, 'click', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent( "<div id='infowindow'><div id='iw-container'><div class='iw-title'>"+ name + "</div><div class='info'>" + address + "<br>" + internet + "<br><br><br><p><b>User Reviews</b></p><a href='/review/new?id=" + id + "'>Write a Review </a><br><br>" + this.reviewArr + "<br><br><br> </div></div></div>"  );
        infowindow.open(map, marker);
      }) 

  setMapOnAll(map)
}

  $.get('/gpData', function (results) {
//      console.log(results)
    for (var i = 0; i < results.data.length; i++) {
//      console.log(results[i].id)
//      console.log(results.data[i])
      placeMarker(results, i)
    }
  })

  $("#submitLang").click(function(event) {
    event.preventDefault()
    var searchedLang = { language: document.getElementById('pickLanguage').value}
    setMapOnAll(null)

    $.post('/searchLang', searchedLang, function (results, status) {
      for (var i = 0; i < results.data.length; i++) {
//          console.log(results.data)
          placeMarker(results, i)
        }
      })
  })
}

// function that checks if the password was repeated correctly on the registration website
function passwordCheck () {
    let pass1 = document.getElementById("pass1").value;
    let pass2 = document.getElementById("pass2").value;
    let passCheck = document.getElementById("passCheck")
    let ok = true;
    if (pass1 !== pass2) {
        document.getElementById("pass1").style.borderColor = "#E34234";
        document.getElementById("pass2").style.borderColor = "#E34234";
        ok = false;
        passCheck.append(': the password was not entered correctly!')
        passCheck.style.color = "#E34234"
    }
    return ok;
}

function validate_radios() {
            if (document.getElementById("point1").value == true || document.getElementById("point2").value == true || document.getElementById("point3").value == true || document.getElementById("point4").value == true || document.getElementById("point5").value == true ) {

                return true;
            }
            else {
                alert("Please give a rating");
                return false;
            }
        }

function validate_radiosEhic() {
            if (document.getElementById("accept").value == true || document.getElementById("reimbursed").value == true || document.getElementById("notAccepted").value == true || document.getElementById("na").value == true ) {

                return true;
            }
            else {
                alert("Please give a rating");
                return false;
            }
        }