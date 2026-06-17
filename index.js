function getUserLocation() {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(success, error, {
       enableHighAccuracy: true,
       timeout: 10000,
       maximumAge: 0
});
    } else {
        console.log("Geolocation is not supported by this browser.");
        getdate("Dhaka");
    }
}


function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const query = `${lat},${lon}`;

    getdate(query);
}


function error() {
    console.log("User denied location or error occurred.");
    getdate("Dhaka");
}


async function getdate(cityQuery) {


    const baseURL = "https://api.weatherapi.com/v1";
    const method = "/forecast.json";
    const myKey = "8110f4c6c24c4b088b1205416262204";


  const input = document.getElementById("search");
  const city = cityQuery || (input ? input.value : "");

    if (!city.trim()) {

        if (!cityQuery) alert("enter a city");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        success,
        error,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function success(position) {
    const { latitude, longitude } = position.coords;
    getdate(`${latitude},${longitude}`);
}

function error(err) {
    console.log("Location error:", err.message);
    showError("Could not get your location, showing weather for Karachi");
    getdate("Karachi");
}

async function getdate(cityQuery) {
    const baseURL = "https://api.weatherapi.com/v1";
    const myKey = "8110f4c6c24c4b088b1205416262204";

    const input = document.getElementById("search");
    const city = cityQuery || (input ? input.value : "");

    if (!city || !city.trim()) {
        if (!cityQuery) showError("Enter a city");
        return;
    }

    const url = `${baseURL}/forecast.json?key=${myKey}&q=${city}&days=7`;

    hideError();
    showLoader();

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        if (!data || data.error) {

            showError(data?.error?.message || "Invalid data");
            return;
        }

        renderWeatherDashboard(data);

    } catch (err) {
        console.log("Error:", err.message);
        showError(err.message || "Something went wrong while fetching weather data");
    } finally {
        if (input) input.value = "";
        hideLoader();
    }
}

function renderCurrentWeather(data) {
    if (!data) return;

    const {
        location,
        current,
        forecast
    } = data;

    const mintemp_c = forecast?.forecastday?.[0]?.day?.mintemp_c;

    const locationEl = document.querySelector('.location-tag');
    if (locationEl) {
        locationEl.innerHTML = `<i class="ph ph-map-pin"></i> ${location.name}, ${location.country}`;
    }

    const date = new Date(location.localtime);

    const dayEl = document.querySelector('.day');
    const dateEl = document.querySelector('.date');

    if (dayEl) {
        dayEl.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    if (dateEl) {
        dateEl.textContent = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    const degreeEl = document.querySelector('.degree');
    const rangeEl = document.querySelector('.range');
    const rainEl = document.querySelector('.rain');
    const feelsEl = document.querySelector('.feels');
    const imgEl = document.querySelector('.weather-3d');

    if (degreeEl) degreeEl.textContent = `${current.temp_c}°C`;
    if (rangeEl) rangeEl.textContent = `/${mintemp_c}°C`;
    if (rainEl) rainEl.textContent = current.condition.text;
    if (feelsEl) feelsEl.textContent = `Feels like ${current.feelslike_c}°`;
    if (imgEl) imgEl.src = `https:${current.condition.icon}`;
}



function renderHighlights(data) {
    if (!data) return;

    const { wind_kph, humidity, uv, vis_km } = data.current;
    const astro = data.forecast?.forecastday?.[0]?.astro;

    const items = document.querySelectorAll('.h-item h4');

    if (items.length >= 4) {
        items[0].innerHTML = `${wind_kph} <span>km/h</span>`;
        items[1].innerHTML = `${humidity}<span>%</span>`;
        items[2].innerHTML = `${uv}<span> UV</span>`;
        items[3].innerHTML = `${vis_km}<span> Km</span>`;
    }

    const sun = document.querySelectorAll('.sunrise h3');

    if (astro && sun.length >= 2) {
        sun[0].textContent = astro.sunrise;
        sun[1].textContent = astro.sunset;
    }
} function renderForecast(data) {
    if (!data) return;

    const forecastList = document.querySelector('.forecast-list');
    if (!forecastList) return;

    forecastList.innerHTML = '';

    data.forecast.forecastday.forEach((forecast, index) => {

        const dayName = index === 0
            ? 'Today'
            : new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' });

        forecastList.insertAdjacentHTML('beforeend', `
            <div class="f-day">
                <p>${dayName}</p>
                <img src="https:${forecast.day.condition.icon}" width="40" height="40">
                <h4>${forecast.day.maxtemp_c}°C</h4>
            </div>
        `);
    });
}
function renderWeatherDashboard(data) {
    renderCurrentWeather(data);
    renderHighlights(data);
    renderForecast(data);


}
const otherCitiesList = ["London", "New York", "Tokyo", "Paris", "Dubai"];

async function fetchOtherCountries(limit = 2) {
    const container = document.getElementById("others-container");
    const myKey = "8110f4c6c24c4b088b1205416262204";
    const citiesToFetch = otherCitiesList.slice(0, limit);


    container.innerHTML = "";

    showLoader();

    for (const city of citiesToFetch) {
        try {
           const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${city}&days=1`);

          if (!res.ok) {
           throw new Error(`API Error: ${res.status}`);
          }

        const data = await res.json();

      if (!data?.current) {
        console.log("Invalid data for:", city);
         return;
      }

            if (!data || data.error) {
                showError(data?.error?.message || `Could not load weather for ${city}`);
                continue;
            }

            const rowHTML = `
                <div class="location-row">
                    <div class="loc-info">
                        <p>${data.location.country}</p>
                        <h4>${data.location.name}</h4>
                        <span>${data.current.condition.text}</span>
                    </div>
                    <img src="https:${data.current.condition.icon}" alt="weather icon" width="60px" height="60px">
                    <div class="loc-temp">
                        ${Math.round(data.current.temp_c)}°<span>/${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°</span>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', rowHTML);

        } catch (err) {
            console.error("Error:", err);
            showError(`Failed to fetch weather for ${city}`);
        }
    }

    hideLoader();
}

function showAllCities() {
    let otherContainer = document.getElementById("cardother").classList.add("others-card")
    fetchOtherCountries(otherCitiesList.length);
    const seeAllBtn = document.querySelector('.seeall');
    seeAllBtn.innerHTML = 'Showing All <i class="ph ph-check"></i>';
    seeAllBtn.style.pointerEvents = 'none';
}


fetchOtherCountries(2);

document.addEventListener("DOMContentLoaded", () => {
    getUserLocation();
    getGreeting();
});


function getGreeting() {
    const hours = new Date().getHours();
    const el = document.getElementById("greeting");

    let greeting = "";

    if (hours < 4) greeting = "Good Night 🌙";
    else if (hours < 12) greeting = "Good Morning ☀️";
    else if (hours < 17) greeting = "Good Afternoon 🌤️";
    else greeting = "Good Evening 🌙";

    if (el) el.textContent = greeting;

    return greeting;
}



function showLoader() {
    document.getElementById("loader")?.classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader")?.classList.add("hidden");
}

function showError(msg) {
    const el = document.getElementById("error-box");
    if (!el) return;

    const msgEl = el.querySelector(".alert-message");
    if (msgEl) msgEl.textContent = msg;

    el.classList.remove("hidden");
}

function hideError() {
    const el = document.getElementById("error-box");
    if (!el) return;

    el.classList.add("hidden");
}