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

function setIcon (ID) {
  switch(ID) {
    case 800:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='icons\\clear-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='icons\\clear-night.png'/>");
        }
        break;
    case 801:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='icons\\cloudy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='icons\\cloudy-night.png'/>");
        }
        break;
    case 802:
    case 803:
    case 804:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='icons\\cloudy.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='icons\\cloudy-night.png'/>");
        }
        break;
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    case 511:
    case 520:
    case 521:
    case 522:
    case 531:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='icons\\rainy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='icons\\rainy-night.png'/>");
        }
        break;
    case 600:
    case 601:
    case 602:
    case 611:
    case 612:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='icons\\snowy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='icons\\snowy-night.png'/>");
        }
        break;
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
        $('#weatherIcon').html("<img src='icons\\tstorms.png'/>");
        break;
  }
}

function setWeather (response) {
  var cityName = response.name;
  var curTemp = Math.round(response.main.temp);
  var curCond = response.weather[0].main;
  var curHum = response.main.humidity;
  var curID = response.weather[0].id;

  $('#location').html(cityName);
  $('#t1').html(curTemp+"&#8457;");
  $('#c1').html(curCond);
  $('#hum1').html("Humidity: "+curHum+"%");

  setIcon(curID);

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
