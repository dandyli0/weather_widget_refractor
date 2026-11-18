const APIKEY="3f37b86cd96044e3b77233303262710";
const URL="https://api.weatherapi.com/v1/forecast.json";


const cityInput = document.querySelector<HTMLInputElement>(".city_input");
const searchBtn = document.querySelector<HTMLButtonElement>(".btn");
const forecastCards = document.querySelectorAll<HTMLElement>(".forecast");

// I used "any" because i was not sure how to define all the weather data
//This means ts cannot check if im using the correct properties
// This could be improved by using specific types instead
let weatherData: any;

// Search button
searchBtn?.addEventListener("click", () => {
    searchCity();
});

// Search when the user presses enter 
cityInput?.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchCity();
    }
});

function searchCity(): void {
    if (!cityInput) return;
//trim removes extra space 
    const city: string = cityInput.value.trim();

//i used checkWeather so empty searches are not sent to the weather Api
//every new search resets the temperature back to celsius
    if (city !== "") {
        checkWeather(city);
        cityInput.value = "";
        cityInput.blur();
    }
}

// Get weather information from WeatherAPI
async function checkWeather(city: string = "calgary"): Promise<void> {
    try {
        const res = await fetch(
            `${URL}?key=${APIKEY}&q=${encodeURIComponent(city)}&days=3`
        );
//the original javascript did not handle failed API requests 
        if (!res.ok) {
            throw new Error("Unable to find weather information.");
        }

        const data = await res.json();
        weatherData = data;

        // Current weather
        //used html elements so that ts knows which elements im targeting. 
        
        const cityName = document.querySelector<HTMLElement>(".city");
        const temperature = document.querySelector<HTMLElement>(".temp");
        const humidity = document.querySelector<HTMLElement>(".humidity");
        const wind = document.querySelector<HTMLElement>(".wind");
        const weatherIcon = document.querySelector<HTMLImageElement>(".weather-icon");

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
        data.forecast.forecastday.forEach((day: any, index: number) => {
            const card = forecastCards[index];

            if (!card) return;

            const date = card.querySelector<HTMLElement>(".forecast-date");
            const temp = card.querySelector<HTMLElement>(".forecast-temp");
            const icon = card.querySelector<HTMLImageElement>(".forecast-icon");

            if (date) {
                date.textContent = new Date(day.date).toLocaleDateString(
                    "en-US",
                    { weekday: "long", timeZone: "UTC" }
                );
            }

            if (temp) {
                temp.textContent = Math.floor(day.day.avgtemp_c) + "°C";
            }

            if (icon) {
                icon.src = "https:" + day.day.condition.icon;
            }
        });

    } catch (error) {
        console.error("Weather error:", error);
        alert("Could not load weather information. Please try again.");
    }
}

// Celsius button
document.querySelector<HTMLButtonElement>(".celsius")?.addEventListener("click", () => {
    if (weatherData) {
        const temperature = document.querySelector<HTMLElement>(".temp");

        if (temperature) {
            temperature.textContent =
                Math.floor(weatherData.current.temp_c) + "°C";
        }
    }
});

// Fahrenheit button
//
document.querySelector<HTMLButtonElement>(".fahrenheit")?.addEventListener("click", () => {
    if (weatherData) {
        const temperature = document.querySelector<HTMLElement>(".temp");

        if (temperature) {
            temperature.textContent =
                Math.floor(weatherData.current.temp_f) + "°F";
        }
    }
});

// Display Calgary weather when the page loads
checkWeather();
