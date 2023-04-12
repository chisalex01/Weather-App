const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const placeOutput = document.querySelector(".place");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const empty = document.querySelector(".empty");
const days = document.querySelectorAll(".day");
var check = document.getElementById("check");
let cityInput;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
        .then((response) => response.json())
        .then((data) => {
          const city = data.locality;
          cityInput = city;
          fetchWeatherData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    (error) => {
      console.log(error);
      cityInput = "Oradea";
      fetchWeatherData();
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type in a city name!");
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
  }
  e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

function fetchWeatherData() {
  if (cityInput)
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=259ec0ebdaa24e6991b185543230404&q=${cityInput}&days=7&aqi=no&alerts=no`
    )
      .then((response) => response.json())
      .then((data) => {
        if (favoriteCities.includes(cityInput))
          document.getElementById("check").checked = true;
        else document.getElementById("check").checked = false;
        temp.innerHTML = data.current.temp_c + "&#176;";

        conditionOutput.innerHTML = data.current.condition.text;
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const d = parseInt(date.substr(5, 2));
        const m = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${m}/${d}/${y}`;
        timeOutput.innerHTML = time;
        nameOutput.innerHTML = data.location.name;
        placeOutput.innerHTML =
          data.location.region + " " + data.location.country;

        const iconId = data.current.condition.icon.substr(
          "//cdn.weatherapi.com/weather/64x64/".length
        );
        icon.src = "./icons/" + iconId;
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        const forecast = data.forecast.forecastday;
        const daysList = document.getElementById("days");
        const hoursList = document.getElementById("hours");
        daysList.innerHTML = "";
        hoursList.innerHTML = "";

        for (let i = 0; i < forecast.length; i++) {
          const dayForecast = forecast[i];
          const date = dayForecast.date;
          const y = parseInt(date.substr(0, 4));
          const d = parseInt(date.substr(5, 2));
          const m = parseInt(date.substr(8, 2));
          const iconId = dayForecast.day.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64/".length
          );

          var newDay = document.createElement("li");
          newDay.classList.add("day");
          newDay.innerHTML = ` <span>${dayOfTheWeek(d, m, y)}</span>
          <img class="icon mx-auto" src="./icons/${iconId}"/>
          <span>${dayForecast.day.condition.text}</span>
          <div>
            <i class="bi bi-thermometer-half"></i>
            <span>${dayForecast.day.avgtemp_c}&#176;</span>
          </div>
         `;
          daysList.appendChild(newDay);
        }

        for (let i = 0; i < forecast[0].hour.length; i++) {
          const hourForecast = forecast[0].hour[i];
          const iconId = hourForecast.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64/".length
          );

          var newDay = document.createElement("li");
          newDay.classList.add(
            "hour",
            "d-flex",
            "flex-row",
            "align-items-center",
            "justify-content-around"
          );
          newDay.innerHTML = ` 
          <div>
            <i class="bi bi-clock"></i>
            <span>${hourForecast.time.slice(10, 16)}</span>
          </div>
          <div class="d-flex flex-column w-25">
            <img class="icon mx-auto" src="./icons/${iconId}"/>
            <span>${hourForecast.condition.text}</span>
          </div>
          <div>
            <i class="bi bi-thermometer-half"></i>
            <span>${hourForecast.feelslike_c}&#176;</span>
          </div>
          <div>
            <i class="bi bi-droplet"></i>
            <span>${hourForecast.humidity}%</span>
          </div>
         `;
          hoursList.appendChild(newDay);
        }

        let timeOfDay = "day";
        const code = data.current.condition.code;
        if (!data.current.is_day) {
          timeOfDay = "night";
        }

        if (code == 1000) {
          app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        } else if (
          code == 1003 ||
          code == 1006 ||
          code == 1009 ||
          code == 1030 ||
          code == 1069 ||
          code == 1087 ||
          code == 1135 ||
          code == 1273 ||
          code == 1276 ||
          code == 1279 ||
          code == 1282
        ) {
          app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        } else if (
          code == 1063 ||
          code == 1069 ||
          code == 1072 ||
          code == 1150 ||
          code == 1153 ||
          code == 1180 ||
          code == 1183 ||
          code == 1186 ||
          code == 1189 ||
          code == 1192 ||
          code == 1195 ||
          code == 1204 ||
          code == 1207 ||
          code == 1240 ||
          code == 1243 ||
          code == 1246 ||
          code == 1249 ||
          code == 1252
        ) {
          app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        } else
          app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        app.style.opacity = "1";
      })
      .catch((error) => {
        alert(`City not found, please try again!`);
        console.log(error);
        app.style.opacity = "1";
      });
}

function addCity() {
  const checkbox = document.getElementById("check");
  const cityName = cityInput;
  const favoriteCities =
    JSON.parse(localStorage.getItem("favoriteCities")) || [];
  const isFavoriteCity = favoriteCities.includes(cityName);

  if (checkbox.checked) {
    if (!isFavoriteCity) {
      favoriteCities.push(cityName);
    }
  } else {
    const cityIndex = favoriteCities.indexOf(cityName);
    if (cityIndex > -1) {
      favoriteCities.splice(cityIndex, 1);
    }
  }

  localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));

  const favoriteCitiesList = document.getElementById("cities");
  favoriteCitiesList.innerHTML = "";
  for (const city of favoriteCities) {
    const li = document.createElement("li");
    li.classList.add("city");
    li.textContent = city;
    li.addEventListener("click", function (e) {
      cityInput = e.target.innerHTML;
      fetchWeatherData();
      app.style.opacity = "0";
    });
    favoriteCitiesList.appendChild(li);
  }

  if (favoriteCities.length === 0) empty.style.display = "block";
  else empty.style.display = "none";
}

const favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];
const favoriteCitiesList = document.getElementById("cities");
favoriteCitiesList.innerHTML = "";

for (const city of favoriteCities) {
  const li = document.createElement("li");
  li.textContent = city;
  li.classList.add("city");
  li.addEventListener("click", function (e) {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    app.style.opacity = "0";
  });
  favoriteCitiesList.appendChild(li);
}
if (favoriteCities.length === 0) empty.style.display = "block";
else empty.style.display = "none";

fetchWeatherData();

app.style.opacity = "1";

// localStorage.clear();
