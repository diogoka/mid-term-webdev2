const key = '7986c02714e4efe92ca1c09ef5031f3f';
let forecast = [];
let currentPosition = [];

let weather = document.querySelector('.current-weather');

const getWeather = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    forecast.push(data.name);
    forecast.push(data.weather[0].main);
    forecast.push(data.weather[0].description);
    forecast.push(Math.floor(data.main.temp));
    forecast.push(Math.floor(data.main.temp_min));
    forecast.push(Math.floor(data.main.temp_max));
    return forecast;
}

const renderWeather = async (lat, lon) => {
    const data = await getWeather(lat, lon);
    weather.innerHTML = data[0];
    weather.innerHTML += `<br>${data[1]}`;
    weather.innerHTML += `<br>${data[2]}`;
    weather.innerHTML += `<br>Temp ${data[3]}°C`;
    weather.innerHTML += `<br>Temp_min ${data[4]}°C`;
    weather.innerHTML += `<br>Temp_max ${data[5]}°C`;
}


const getBrowserLocation = (location) => {
    lat = location.coords.latitude;
    lon = location.coords.longitude;
    currentPosition.push(lat);
    currentPosition.push(lon);
    loadBrowserPosition();
}

const getBrowserLocationError = (err) => {
    window.alert(`Failed to get current location (${err.code}): ${err.message}. Default location loaded: Vancouver`);
    defaultLat = 49.28
    defaultLon = -123.12
    renderWeather(defaultLat, defaultLon);
}

window.addEventListener('load', () => {
    console.log('Current Weather Loaded');
    navigator.geolocation.getCurrentPosition(getBrowserLocation, getBrowserLocationError)
});

const loadBrowserPosition = () => {
    return new Promise((resolve) => {
        resolve(
            console.log(currentPosition[0], currentPosition[1]),
            // getWeather(currentPosition[0], currentPosition[1]),
            renderWeather(currentPosition[0], currentPosition[1])
        );
    })
}


// favoriteButton

const favoriteButton = document.querySelector('#favoriteButton')

favoriteButton.addEventListener('click', () => {
    console.log('Favorite Button Clicked');
    localStorage.setItem(forecast[0], currentPosition);
})


