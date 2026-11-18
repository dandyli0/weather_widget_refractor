"use strict";
var _a, _b;
const APIKEY = "3f37b86cd96044e3b77233303262710";
const URL = "https://api.weatherapi.com/v1/forecast.json";
const cityInput = document.querySelector(".city_input");
const searchBtn = document.querySelector(".btn");
const forecastCards = document.querySelectorAll(".forecast");
// Store weather information from the API
let weatherData;
// Search button
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", () => {
    searchCity();
});
// Search when Enter is pressed
cityInput === null || cityInput === void 0 ? void 0 : cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchCity();
    }
});
function searchCity() {
    if (!cityInput)
        return;
    const city = cityInput.value.trim();
    if (city !== "") {
        checkWeather(city);
        cityInput.value = "";
        cityInput.blur();
    }
}
// Get weather information from WeatherAPI
async function checkWeather(city = "calgary") {
    try {
        const res = await fetch(`${URL}?key=${APIKEY}&q=${encodeURIComponent(city)}&days=3`);
        if (!res.ok) {
            throw new Error("Unable to find weather information.");
        }
        const data = await res.json();
        weatherData = data;
        // Current weather
        const cityName = document.querySelector(".city");
        const temperature = document.querySelector(".temp");
        const humidity = document.querySelector(".humidity");
        const wind = document.querySelector(".wind");
        const weatherIcon = document.querySelector(".weather-icon");
        if (cityName) {
            cityName.textContent = data.location.name;
        }
        if (temperature) {
            temperature.textContent = Math.floor(data.current.temp_c) + "°C";
        }
        if (humidity) {
            humidity.textContent = data.current.humidity + "%";
        }
        if (wind) {
            wind.textContent = data.current.wind_kph + " km/h";
        }
        if (weatherIcon) {
            weatherIcon.src = "https:" + data.current.condition.icon;
        }
        // Three-day forecast
        data.forecast.forecastday.forEach((day, index) => {
            const card = forecastCards[index];
            if (!card)
                return;
            const date = card.querySelector(".forecast-date");
            const temp = card.querySelector(".forecast-temp");
            const icon = card.querySelector(".forecast-icon");
            if (date) {
                date.textContent = new Date(day.date).toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
            }
            if (temp) {
                temp.textContent = Math.floor(day.day.avgtemp_c) + "°C";
            }
            if (icon) {
                icon.src = "https:" + day.day.condition.icon;
            }
        });
    }
    catch (error) {
        console.error("Weather error:", error);
        alert("Could not load weather information. Please try again.");
    }
}
// Celsius button
(_a = document.querySelector(".celsius")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    if (weatherData) {
        const temperature = document.querySelector(".temp");
        if (temperature) {
            temperature.textContent =
                Math.floor(weatherData.current.temp_c) + "°C";
        }
    }
});
// Fahrenheit button
(_b = document.querySelector(".fahrenheit")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    if (weatherData) {
        const temperature = document.querySelector(".temp");
        if (temperature) {
            temperature.textContent =
                Math.floor(weatherData.current.temp_f) + "°F";
        }
    }
});
// Display Calgary weather when the page loads
checkWeather();
