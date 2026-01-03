
document.addEventListener('DOMContentLoaded', function () {
    // Weather API key and base URL
    const apiKey = 'adcd3ea5a54046a809b153b542384c9f'; 
    const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  
    // DOM Elements
    const searchBtn = document.getElementById('searchBtn');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const cityInput = document.getElementById('cityInput');
    const currentWeather = document.getElementById('currentWeather');
    const forecast = document.getElementById('forecast');
  
    // Event listeners
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
        fetchWeather(city);
        fetchForecast(city);
      }
    });
  
    currentLocationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
          fetchForecastByCoords(latitude, longitude);
        }, () => {
          alert('Unable to retrieve your location.');
        });
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  
    // Fetch weather data for a city
    function fetchWeather(city) {
      fetch(`${baseWeatherUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
          currentWeather.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
    }
  
   
function displayWeather(data) {
  const currentWeather = document.getElementById("currentWeather");
  currentWeather.innerHTML = `
    <h2 class="text-2xl font-semibold mb-2">${data.name}</h2>
    <div class="flex items-center justify-between mb-4">
      <!-- Weather Condition and other data -->
      <div class="text-left">
        <p><strong>Condition:</strong> ${data.weather[0].main}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      </div>
      <!-- Weather Icon -->
      <img 
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
        alt="${data.weather[0].description}" 
        class="w-20 h-20 object-contain"
      />
    </div>
  `;
}

// Fetch 5-day weather forecast for a city
    function fetchForecast(city) {
      fetch(`${baseForecastUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => {
          forecast.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
    }
    const forecastCard = document.createElement('div');
   
    function displayForecast(data) {
      forecast.innerHTML = '';
    
      const uniqueDays = new Set();
      const fiveDayForecast = [];
    
      for (let item of data.list) {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    
        if (!uniqueDays.has(day)) {
          uniqueDays.add(day);
          fiveDayForecast.push(item);
        }
    
        if (fiveDayForecast.length === 5) break;
      }
    
      fiveDayForecast.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const { main, weather, wind } = item;
    
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('bg-gray-400', 'p-4', 'rounded', 'shadow', 'text-center');
        forecastCard.innerHTML = `
          <h4 class="font-semibold">${day}</h4>
          <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto">
          <p>Temp: ${main.temp} °C</p>
          <p>Wind: ${wind.speed} m/s</p>
          <p>Humidity: ${main.humidity}%</p>
        `;
        forecast.appendChild(forecastCard);
      });
    }
    
    // Fetch weather data by coordinates (current location)
    function fetchWeatherByCoords(lat, lon) {
      fetch(`${baseWeatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
          currentWeather.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
    }
  
    // Fetch forecast data by coordinates (current location)
    function fetchForecastByCoords(lat, lon) {
      fetch(`${baseForecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => {
          forecast.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        });
    }
  
  });
  