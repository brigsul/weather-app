var curLon = 0;
var curLat = 0;
var urlWeather = '';
var urlForecast = '';
var curMin1 = 9999;
var curMax1 = -9999;
var hour = (new Date()).getHours();

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
  var cityName = response.name;
  var curTemp = Math.round(response.main.temp);
  var curCond = response.weather[0].main;
  var curHum = response.main.humidity;

  $('#location').html(cityName);
  $('#t1').html(curTemp+"&#8457;");
  $('#c1').html(curCond);
  $('#hum1').html("Humidity: "+curHum+"%");

  console.log(hour);

  if (curCond == "Clear") {
    if (7 < hour && hour < 19) {
      $('#weatherIcon').html("<img src='icons\\clear-day.png'/>");
    }
    else {
      $('#weatherIcon').html("<img src='icons\\clear-night.png'/>");
    }
  }
  else if (curCond == "Cloudy") {

  }
  else if (curCond == "Rain") {

  }
  else if (curCond == "Sonw") {

  }
  else if (curCond == "Storms") {

  }

  console.log(response);
}

function setForecast (response) {
  setMinMax(response);

  $('#mint1').html(curMin1+"&#8457;");
  $('#maxt1').html(curMax1+"&#8457;");

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

/* Iterate through forecast response to find
    min and max temps for next 24 hours */

function setMinMax (response) {
  for(var i = 0; i < 8; i++) {
    console.log(response.list[i].main.temp_min);
    var tempMin1 = response.list[i].main.temp_min;
    var tempMax1 = response.list[i].main.temp_max;

    if (tempMin1 < curMin1) {
      curMin1 = Math.round(tempMin1);
    }
    else if (tempMax1 > curMax1) {
      curMax1 = Math.round(tempMax1);
    }
    else {
      return;
    }
  }
}

$(document).ready(function(){

  navigator.geolocation.getCurrentPosition(function(position) {
    setLocation(position.coords.latitude, position.coords.longitude);
    fetchWeather();
    fetchForecast();
  });

  $(document).on('click', function () {

  });
});
