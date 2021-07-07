const API_KEY = "412fa27fcbeb4a506b397b90dd6302e1"

function handleFormSubmit(event) {
  event.preventDefault();
  event.stopPropagation && event.stopPropagation();
  const city = document.getElementById("city").value.replace(/ /g, "+");
  fetchCurrentWeather(city);
  fetchFiveDayForecast(city);
}

function fetchCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`)
    .then(r=>r.json())
    .then(r=>displayCurrentWeather(r))
    .catch(e=>console.log(e));
}

function displayCurrentWeather(json) {
  document.getElementById("temp").innerHTML = json.main && json.main.temp;
  document.getElementById("low").innerHTML = json.main && json.main.temp_min;
  document.getElementById("high").innerHTML = json.main && json.main.temp_max;
  document.getElementById("humidity").innerHTML = json.main && json.main.humidity;
  document.getElementById("cloudCover").innerHTML = json.clouds && json.clouds.all;
}


function fetchFiveDayForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}&units=metric`)
    .then(r=>r.json())
    .then(r=>{
      displayFiveDayForecast(r);
      createChart(r);
    })
    .catch(e=>console.log(e));
}

function displayFiveDayForecast(json) {
  const aside = document.getElementsByTagName("aside")[0];
  while (aside.firstChild) aside.removeChild(aside.firstChild);
  json.list.forEach(forecast => aside.innerHTML += `<div>${forecast.dt_txt}: ${forecast.main && forecast.main.temp} - ${forecast.main && forecast.main.humidity}</div>`);
}

const colourByRange=(min, max, value)=>{
  const range = max - min;
  return `${(value - min) / range * 255}, ${255 - (value - min) / range * 255}, 128`;
}

function createChart(json) {
  const ctx = document.getElementById("WeatherChart").getContext('2d');
  const tempMinMax = json.list.reduce((acc,e)=>!e.main ? acc : {
    min: Math.min(acc.min, e.main.temp),
    max: Math.max(acc.min, e.main.temp)
  },
    {min: +Infinity, max: -Infinity}
  );
  const range = tempMinMax.max - tempMinMax.min;
  console.log(tempMinMax, range);
  const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: json.list.map(e=>e.dt_txt),
          datasets: [{
              label: 'Average Temperature',
              data: json.list.map(e=>e.main && e.main.temp),
              backgroundColor: json.list.map(e=>e.main && `rgba(${colourByRange(tempMinMax.min, tempMinMax.max, e.main.temp)}, 0.2)`),
              borderColor: json.list.map(e=>e.main && `rgba(${colourByRange(tempMinMax.min, tempMinMax.max, e.main.temp)}, 1)`),
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("submit").addEventListener("click", handleFormSubmit);
  createChart({list: []});
})
