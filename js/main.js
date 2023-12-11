"use strict";

const apiKey = "7a59fe6190ab561bde1d83cab7affb01";
const locButton = document.querySelector(".loc-button");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTepm = document.querySelector(".weather-temp");
const daysList = document.querySelector(".days-list");

const weatherIconMap = {
  "01d": "sun",
  "01n": "moon",
  "02d": "cloud-sun",
  "02n": "cloud-moon",
  "03d": "cloud",
  "03n": "cloud",
  "04d": "clouds",
  "04n": "clouds",
  "09d": "cloud-showers-heavy",
  "09n": "cloud-showers-heavy",
  "10d": "cloud-sun-rain-alt",
  "10n": "cloud-sun-rain-alt",
  "11d": "thunderstorm-sun",
  "11n": "thunderstorm-moon",
  "13d": "snowflake-alt",
  "13n": "snowflake-alt",
  "50d": "water",
  "50n": "water",
};

function fetcWeatherData(location) {
  // Location and API Key
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  // Fetch weather data from api
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Update today info
      const todayWeather = data.list[0].weather[0].description;
      const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
      const todayWeatherIconCode = data.list[0].weather[0].icon;

      todayInfo.querySelector("h2").textContent = new Date().toLocaleDateString(
        "en-US",
        { weekday: "long" }
      );
      todayInfo.querySelector("span").textContent =
        new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      todayWeatherIcon.className = `uil uil-${weatherIconMap[todayWeatherIconCode]}`;
      todayTepm.textContent = todayTemperature;

      const locationElement = document.querySelector(
        ".today-info > div > span"
      );
      locationElement.textContent = `${data.city.name}, ${data.city.country}`;

      const weatherDescriptionElement = document.querySelector(
        ".today-weather > h3"
      );
      weatherDescriptionElement.textContent = todayWeather;

      const todayPrecipitation = `${data.list[0].pop}%`;
      const todayHumidity = `${data.list[0].main.humidity}%`;
      const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

      const dayInfoContainer = document.querySelector(".day-info");
      dayInfoContainer.innerHTML = `
      
        <div> 
            <span class="title">PRECIPITATION</span>
            <span class="value">${todayPrecipitation}</span>
        </div>
        <div> 
            <span class="title">HUMIDITY</span>
            <span class="value">${todayHumidity}</span>
        </div>
        <div> 
            <span class="title">WIND SPEED</span>
            <span class="value">${todayWindSpeed}</span>
        </div>
  
      `;

      const today = new Date();
      const nextDaysData = data.list.slice(1);

      const uniqueDays = new Set();
      let count = 0;
      daysList.innerHTML = "";
      for (const dayData of nextDaysData) {
        const forecastDate = new Date(dayData.dt_txt);
        const dayAbbreviation = forecastDate.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const dayTemp = `${Math.round(dayData.main.temp)}°C`;
        const iconCode = dayData.weather[0].icon;

        if (
          !uniqueDays.has(dayAbbreviation) &&
          forecastDate.getDate() !== today.getDate()
        ) {
          uniqueDays.add(dayAbbreviation);
          daysList.innerHTML += `
          
            <li>
              <i class="uil uil-${weatherIconMap[iconCode]}"></i>
              <span>${dayAbbreviation}</span>
              <span class="day-temp">${dayTemp}</span>
            </li>

          `;
          count++;
        }
        if (count === 4) break;
      }
    })
    .catch((error) => {
      alert(`Error fetching weather data: ${error}(Api Error)`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "Turkey";
  fetcWeatherData(defaultLocation);
});

locButton.addEventListener("click", () => {
  const location = prompt("Enter a Location: ");
  if (!location) return;

  fetcWeatherData(location);
});
