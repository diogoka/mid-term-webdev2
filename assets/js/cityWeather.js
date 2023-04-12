const key = '7986c02714e4efe92ca1c09ef5031f3f';
let currentPosition = [];
let forecast = {
    name: '',
    country: '',
    temperature: 0,
    weatherCondition: '',
    temp_max: 0,
    temp_min: 0
}

let cityName = document.querySelector('#cityName');
let cityTemperature = document.querySelector('#cityTemperature');
let cityWeatherCondition = document.querySelector('#cityWeatherCondition');
let cityMaxTemp = document.querySelector('#maxTemp');
let cityMinTemp = document.querySelector('#minTemp');

const getWeather = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    forecast.name = data.name;
    forecast.country = data.sys.country;
    forecast.temperature = Math.floor(data.main.temp);
    forecast.weatherCondition = data.weather[0].main;
    forecast.temp_max = Math.floor(data.main.temp_max);
    forecast.temp_min = Math.floor(data.main.temp_min);
    return forecast;
}

const renderWeather = async (lat, lon) => {
    const data = await getWeather(lat, lon);
    cityName.innerHTML = data.name;
    cityTemperature.innerHTML = `${data.temperature}°C`;
    cityWeatherCondition.innerHTML = data.weatherCondition;
    cityMaxTemp.innerHTML = `Max ${data.temp_max}°C`;
    cityMinTemp.innerHTML = `Min ${data.temp_min}°C`;
    checkFavorite();
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
            console.log("Current Array ", currentPosition[0], currentPosition[1]),
            renderWeather(currentPosition[0], currentPosition[1]),
            console.log("localStorage ", localStorage),
        );
    })
}



const favoriteButton = document.querySelector('#favoriteButton')

const checkFavorite = () => {
    let city = `${forecast.name},${forecast.country}`
    if (localStorage.getItem(city)) {
        favoriteButton.style.color = 'yellow';
    }
}

favoriteButton.addEventListener('click', () => {
    let city = `${forecast.name},${forecast.country}`
    if (localStorage.getItem(city)) {
        localStorage.removeItem(city);
        favoriteButton.style.color = 'black';
        return;
    } else {
        localStorage.setItem(city, currentPosition);
        favoriteButton.style.color = 'yellow';
    }
    console.log('Favorite Button Clicked');
    console.log(localStorage);
})


const logteste = (string) => {
    console.log("teste", string);
}


module.exports = {
    logteste
}
