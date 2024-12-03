const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PValue = document.getElementById("PValue"),
  Forecast = document.querySelector(".Forecast");

WEATHER_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather?appid=70be717ddfef6c7dc305b23b40ddf8c5&q=";
WEATHER_DATA_ENDPOINT = "https://api.openweathermap.org/data/3.0/onecall?";

function findUserLocation() {
  document.querySelector(".highlights").style.display="grid";
document.querySelector(".hourly-weather").style.display="grid";
document.querySelector(".Forecast").style.display="grid";
  
  Forecast.innerHTML = "";
  fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod != "" && data.cod != 200) {
        alert(data.message);
        return;
      }
      console.log(data);
      city.innerHTML = data.name + ", " + data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

      fetch(
        WEATHER_DATA_ENDPOINT +
          `lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&units=metric&appid=70be717ddfef6c7dc305b23b40ddf8c5`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          temperature.innerHTML = TemConverter(data.current.temp);
          feelsLike.innerHTML = "Feels Like " + TemConverter(data.current.feels_like);
          description.innerHTML =
            `<i class="fa fa-brands fa-cloudversify"></i> &nbsp;` +
            data.current.weather[0].description;

          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          date.innerHTML = getLongFormatDateTime(
            data.current.dt,
            data.timezone_offset,
            options
          );

          HValue.innerHTML =
            Math.round(data.current.humidity) + "<span>%</span>";
          WValue.innerHTML =
            Math.round(data.current.wind_speed) + "<span>m/s</span>";
          const option1 = {
            hour: "numeric",
            minutes: "numeric",
            hour12: true,
          };
          SRValue.innerHTML = getLongFormatDateTime(
            data.current.sunrise,
            data.timezone_offset,
            option1
          );
          SSValue.innerHTML = getLongFormatDateTime(
            data.current.sunset,
            data.timezone_offset,
            option1
          );

          CValue.innerHTML = data.current.clouds + "<span>%</span>";
          UVValue.innerHTML = data.current.uvi;
          PValue.innerHTML = data.current.pressure + "<span>hPa</span>";

          data.daily.forEach((weather) => {
            let div = document.createElement("div");
            const options = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };
            let daily = getLongFormatDateTime(weather.dt, 0, options).split(
              " at "
            );
            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>`;
            div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}></p>`;
            div.innerHTML += `<span><span>${TemConverter(
              weather.temp.min
            )}</span>&nbsp&nbsp<span>${TemConverter(
              weather.temp.max
            )}</span></span>`;
            Forecast.append(div);
            populateHourlyData(data);
          });
        });
    });
}

function formatUnixTime(dtValue, offSet, options = {}) {
  const date = new Date((dtValue + offSet) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormatDateTime(dtValue, offSet, options) {
  return formatUnixTime(dtValue, offSet, options);
}

function TemConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";
  if (converter.value == "°C") {
    message = tempValue + "<span>" + "\xB0C</span>";
  } else {
    let ctof = (tempValue * 9) / 5 + 32;
    message = ctof + "<span>" + "\xB0f</span>";
  }
  return message;
}


// Function to populate hourly data
function populateHourlyData(data) {
  const hourlyForecast = document.querySelector(".hourly-forecast");
  hourlyForecast.innerHTML = "";
  let count=0;
  data.hourly.forEach((hourlyData) => {
    if(count<12){
      const div = document.createElement("div");
      const options = {
        hour: "numeric",
        minute: "numeric",
      };
      const dateTime = getLongFormatDateTime(hourlyData.dt, 0, options);
      div.innerHTML = `
        <span style="display:flex;align-items:center;">
        <img src="https://openweathermap.org/img/wn/${hourlyData.weather[0].icon}@2x.png"/>
        <p style="align-items:center;">${dateTime}</p>        
        </span>
        <p>Temp: ${TemConverter(hourlyData.temp)}</p>
        <p>Feels Like: ${TemConverter(hourlyData.feels_like)}</p>
        <p>Humidity: ${hourlyData.humidity}%</p>
        <p>Wind Speed: ${hourlyData.wind_speed} m/s</p>
      `;
      hourlyForecast.append(div);
      count++;
    }
  });
}

let highl=1;
function showHigh(){
  
  if(highl===0){
    document.querySelector(".highlights").style.display="grid";
    highl=1;
  }
  else{
    document.querySelector(".highlights").style.display="none";
    highl=0;
  }
  

}

let hours=1;
function showHW(){
  
  if(hours===0){
    document.querySelector(".hourly-weather").style.display="grid";
    hours=1;
  }
  else{
    document.querySelector(".hourly-weather").style.display="none";
    hours=0;
  }
  

}

let week=1;
function showWeek(){
  
  if(week===0){
    document.querySelector(".Forecast").style.display="grid";
    week=1;
  }
  else{
    document.querySelector(".Forecast").style.display="none";
    week=0;
  }
  

}
