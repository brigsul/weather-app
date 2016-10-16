var curLon = 0;
var curLat = 0;
var urlWeather = '';
var urlForecast = '';


function setLocation (lat, lon) {
  curLat = lat.toString();
  curLon = lon.toString();
  urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=imperial';
  urlForecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=imperial';
  console.log(curLat);
  console.log(curLon);
  console.log(urlWeather);
  console.log(urlForecast);
}

function setWeather (response) {
  $('#location').html(response.name);
  $('#t1').html(response.main.temp);
  $('#c1').html(response.weather[0].main);
  console.log(response);
}

function setForecast (response) {
  $('#mint1').html(response.list[0].main.temp_min);
  $('#maxt1').html(response.list[0].main.temp_max);
  console.log(response);
}

function weatherSuccess (response) {
  //console.log(response);
  setWeather(response);
}

function forecastSuccess (response) {
  //console.log(response);
  setForecast(response);
}

function fetchError () {
  alert('Could not retreive weather');
}

function fetchWeather () {
  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: urlWeather,
      xhrFields: {
        withCredentials: false
      },
      success: weatherSuccess,

      error: fetchError
    });
}

function fetchForecast () {
  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: urlForecast,
      xhrFields: {
        withCredentials: false
      },
      success: forecastSuccess,

      error: fetchError
    });
}

$(document).ready(function(){

  navigator.geolocation.getCurrentPosition(function(position) {
    setLocation(position.coords.latitude, position.coords.longitude);
    fetchWeather();
  });

  $(document).on('click', function () {
    fetchForecast();
  });
});
