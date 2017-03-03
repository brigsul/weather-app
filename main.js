var curLon = '';
var curLat = '';
var urlWeather = '';
var urlForecast = '';
var curMin1 = 9999;
var curMax1 = -9999;
var hour = (new Date()).getHours();
var curTemp = 0;
var unitStatus = "1F";

/* Take Latitude and longitute Coords and update API links based on unit*/

function setLocation (lat, lon) {
  curLat = lat.toString();
  curLon = lon.toString();

  if (unitStatus == "1F") {
    urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=imperial';
    urlForecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=imperial';
  }
  else {
    urlWeather = 'http://api.openweathermap.org/data/2.5/weather?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=metric';
    urlForecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='+curLat+'&lon='+curLon+'&APPID=ca658d6c3e2f5efdebb110ead41e152b&callback=?&units=metric';
  }
/*console.log(curLat);
  console.log(curLon);
  console.log(urlWeather);
  console.log(urlForecast);
*/
}

/* Take Open Weather API id and assign weather icon */

function setIcon (ID) {
  switch(ID) {
    case 800:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='clear-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='clear-night.png'/>");
        }
        break;
    case 801:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='cloudy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='cloudy-night.png'/>");
        }
        break;
    case 802:
    case 803:
    case 804:
        if (7 < hour && hour < 19) {
          $('#weatherIcon').html("<img src='cloudy.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='cloudy-night.png'/>");
        }
        break;
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:    
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
          $('#weatherIcon').html("<img src='rainy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='rainy-night.png'/>");
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
          $('#weatherIcon').html("<img src='snowy-day.png'/>");
        }
        else {
          $('#weatherIcon').html("<img src='snowy-night.png'/>");
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
        $('#weatherIcon').html("<img src='tstorms.png'/>");
        break;
  }
}

/* Take Open Weather API data (City/Temp/Cond/Humidity/ID) and assign HTML */

function setWeather (response) {
  var cityName = response.name;
  curTemp = Math.round(response.main.temp);
  var curCond = response.weather[0].main;
  var curHum = response.main.humidity;
  var curID = response.weather[0].id;

  setIcon(curID);

  $('#location').html(cityName);
  $('#c1').html(curCond);
  $('#hum1').html("Humidity: "+curHum+"%");

  if (unitStatus == "1F") {
    $('#t1').html(curTemp+"&#8457;");
  }
  else {
    $('#t1').html(curTemp+"&#8451;");
  }

  /*
  console.log(cityName);
  console.log(curTemp);
  console.log(curCond);
  console.log(curHum);
  console.log(curID);
  console.log(response);
  */
}

/* Set Min/Max Temps and assign Forecast to HTML */

function setForecast (response) {
  setMin (response);
  setMax (response);

  if (unitStatus == "1F") {
    $('#mint1').html(curMin1+"&#8457;");
    $('#maxt1').html(curMax1+"&#8457;");
  }
  else {
    $('#mint1').html(curMin1+"&#8451;");
    $('#maxt1').html(curMax1+"&#8451;");
  }
  //console.log(response);
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

/* Open Weather Current Weather API Call */

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

/* Open Weather Forecast API Call */

function fetchForecast () {
  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: urlForecast,
      xhrFields: {
        withCredentials: true
      },
      success: forecastSuccess,

      error: fetchError
    });
}

/* Iterate through forecast response to find
    min and max temps for next 24 hours */

function setMin (response) {
  curMin1 = 9999;
  for(var i = 0; i < 8; i++) {
    var tempMin1 = response.list[i].main.temp_min;
    //console.log(tempMin1);

    if (tempMin1 < curMin1) {
      curMin1 = Math.round(response.list[i].main.temp_min);
    }
    else if (curMin1 > curTemp) {
      curMin1 = Math.round(curTemp);
    }
  }
}

function setMax (response) {
  curMax1 = -9999;
  for (var j = 0; j < 8; j++) {
    var tempMax1 = response.list[j].main.temp_max;
    //console.log(tempMax1);

    if (tempMax1 > curMax1) {
      curMax1 = Math.round(response.list[j].main.temp_max);
    }
    else if (curMax1 < curTemp) {
      curMax1 = Math.round(curTemp);
    }
  }
}

function googleAPI () {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {

      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var locLat = JSON.parse(xhttp.responseText).location.lat;
        var locLon = JSON.parse(xhttp.responseText).location.lng;
        //var geolocation = JSON.parse(xhttp.responseText).location;
        //var loc = geolocation.lat + ',' + geolocation.lng;
        //console.log(locLat + ", " + locLon);
        //console.log((xhttp.responseText));
        curLon = locLon;
        curLat = locLat;
        setLocation(curLat,curLon);
        fetchWeather();
        fetchForecast();

      }
  };


  xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDCLDBQ2VUm4Jg72ZOr0HJ3mkdfnnhjw9Q", true);
  xhttp.send();

}

$(document).ready(function(){

  googleAPI();

  $('#unitButton').on('click', function () {
    if (unitStatus == "1F") {
      unitStatus = "2C";
      googleAPI();
    }
    else {
      unitStatus = "1F";
      googleAPI();
    }
    console.log(unitStatus);
  });
});
