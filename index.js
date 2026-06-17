function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
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


    const city = cityQuery || document.getElementById("search").value;

    if (!city.trim()) {

        if (!cityQuery) alert("enter a city");
        return;
    }

    const finalURL = `${baseURL}${method}?key=${myKey}&q=${city}&days=7`;

    try {
        let response = await fetch(finalURL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data = await response.json();


        if (data.error) {
            alert(data.error.message);
            return;
        }

        renderWeatherDashboard(data);

    } catch (err) {
        console.log("Error:", err.message);
    } finally {
        document.getElementById("search").value = "";
    }
}


function renderCurrentWeather(data) {
    const {
        location: { name, country, localtime },
        current: {
            temp_c,
            feelslike_c,
            condition: { text, icon }
        },
        forecast: {
            forecastday: [{ day: { mintemp_c } }]
        }
    } = data;

    document.querySelector('.location-tag').innerHTML = `<i class="ph ph-map-pin"></i> ${name}, ${country}`;

    const date = new Date(localtime);
    document.querySelector('.day').textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector('.date').textContent = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    document.querySelector('.degree').textContent = `${temp_c}°C`;
    document.querySelector('.range').textContent = `/${mintemp_c}°C`;
    document.querySelector('.rain').textContent = text;
    document.querySelector('.feels').textContent = `Feels like ${feelslike_c}°`;
    document.querySelector('.weather-3d').src = `https:${icon}`;
}

function renderHighlights(data) {
    const {
        current: {
            wind_kph,
            humidity,
            uv,
            vis_km
        },
        forecast: {
            forecastday: [{ astro: { sunrise, sunset } }]
        }
    } = data;

    const items = document.querySelectorAll('.h-item h4');
    items[0].innerHTML = `${wind_kph} <span>km/h</span>`;
    items[1].innerHTML = `${humidity}<span> %</span>`;
    items[2].innerHTML = `${uv}<span> UV</span>`;
    items[3].innerHTML = `${vis_km}<span> Km</span>`;

    document.querySelectorAll('.sunrise h3')[0].textContent = sunrise;
    document.querySelectorAll('.sunrise h3')[1].textContent = sunset;
}

function renderForecast(data) {


    const { forecast: { forecastday } } = data;

    const forecastList = document.querySelector('.forecast-list');
    forecastList.innerHTML = '';

    forecastday.forEach((forecast, index) => {
        const {
            date,
            day: {
                maxtemp_c,
                condition: { icon }
            }
        } = forecast;

        const dayName = index === 0
            ? 'Today'
            : new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

        forecastList.innerHTML += `
      <div class="f-day">
        <p>${dayName}</p>
        <img src="https:${icon}" width="40" height="40" alt="weather icon">
        <h4>${maxtemp_c}°C</h4>
      </div>
    `;
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

    for (const city of citiesToFetch) {
        try {
            const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${city}&days=1`);
            const data = await res.json();

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
        }
    }
}

function showAllCities() {
    let otherContainer = document.getElementById("cardother").classList.add("others-card")
    fetchOtherCountries(otherCitiesList.length);
    const seeAllBtn = document.querySelector('.seeall');
    seeAllBtn.innerHTML = 'Showing All <i class="ph ph-check"></i>';
    seeAllBtn.style.pointerEvents = 'none';
}


fetchOtherCountries(2);

document.addEventListener("DOMContentLoaded", getUserLocation, getGreeting())


function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let showGreeting = document.getElementById("greeting");
    let greeting = "";
    if (hours >= 23 || hours < 4) {
        greeting = "Good Night ";
    }
    else if (hours >= 4 && hours < 12) {
        greeting = "Good Morning ";
    }
    else if (hours >= 12 && hours < 17) {
        greeting = "Good Afternoon ";
    }
    else {
        greeting = "Good Evening ";
    }


    if (showGreeting) {
        showGreeting.textContent = greeting;
    }

    return greeting;
}

