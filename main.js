var curLon = 0;
var curLat = 0;
var url = '';


function setLocation (lat, lon) {
  curLat = lat.toString();
  curLon = lon.toString();
  url = 'http://api.openweathermap.org/data/2.5/weather?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=imperial';
  console.log(curLat);
  console.log(curLon);
  console.log(url);
}

function setWeather (response) {
  $('#location').html(response.name);
  $('#t1').html(response.main.temp);
}

function fetchSuccess (response) {
  //console.log(response);
  setWeather(response);
}

function fetchError () {
  alert('Could nto retreive weather');
}

function fetchWeather () {
  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: url,
      xhrFields: {
        withCredentials: false
      },
      success: fetchSuccess,

      error: fetchError
    });
}

//$.getJSON(url, fetchSuccess)

$(document).ready(function(){

  navigator.geolocation.getCurrentPosition(function(position) {
    setLocation(position.coords.latitude, position.coords.longitude);
    fetchWeather();
  });

  $(document).on('click', function () {

  });
});
