const API_KEY = "314730d255fa1dffba8148ad3661cfde"

function handleFormSubmit(event) {
    event.preventDefault();
    let cityName=document.getElementById("city").value;
    fetchCurrentWeather(cityName);
    fetchFiveDayForecast(cityName);
}

function fetchCurrentWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`)
    .then(res=>res.json())
    .then(data=>displayCurrentWeather(data))
    .catch(error=>console.log(error))
}

function displayCurrentWeather(json) {
  //render current weather data to the DOM using provided IDs and json from API
  console.log(json);
  document.getElementById("temp").innerHTML=json["main"]["temp"];
  document.getElementById("low").innerHTML=json["main"]["temp_min"];
  document.getElementById("high").innerHTML=json["main"]["temp_max"];
  document.getElementById("humidity").innerHTML=json["main"]["humidity"];
  document.getElementById("cloudCover").innerHTML=json["clouds"]["all"];
  document.getElementById("sunrise").innerHTML=json["sys"]["sunrise"];
  document.getElementById("sunset").innerHTML=json["sys"]["sunset"];
}


function fetchFiveDayForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}`)
  .then(res=>res.json())
  .then(json=>displayFiveDayForecast(json))
  .catch(error=>console.log(error))
}

function displayFiveDayForecast(json) {
  //render five day forecast data to the DOM using provided IDs and json from API
  let aside=document.getElementById("fiveDayForecast");
  aside.innerHTML="";
  for(let i=7;i<=39;i+=8){
    let temp_child=document.createElement("div");
    temp_child.innerHTML=`Time: ${json["list"][i]["dt_txt"]}`;
    temp_child.innerHTML+=` Temperature: ${json["list"][i]["main"]["temp"]}`
    temp_child.innerHTML+=` Humidity: ${json["list"][i]["main"]["humidity"]}`
    aside.appendChild(temp_child);
  }
}

function createChart(json) {
  //Bonus: render temperature chart using five day forecast data and ChartJS
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("submit1").addEventListener("click", handleFormSubmit);
});

