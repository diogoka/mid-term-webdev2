const key = '7986c02714e4efe92ca1c09ef5031f3f';
let lat = 0;
let lon = 0;
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

const getWeather = async (lat, lon, placeName) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    placeName === undefined ? forecast.name = data.name : forecast.name = placeName;
    forecast.country = data.sys.country;
    forecast.temperature = Math.floor(data.main.temp);
    forecast.weatherCondition = data.weather[0].main;
    forecast.temp_max = Math.floor(data.main.temp_max);
    forecast.temp_min = Math.floor(data.main.temp_min);
    return forecast;
}

const renderWeather = async (lat, lon, placeName) => {
    const data = await getWeather(lat, lon, placeName);
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
    loadFavorite();
}

const getBrowserLocationError = (err) => {
    window.alert(`Failed to get current location (${err.code}): ${err.message}. Default location loaded: Vancouver`);
    defaultLat = 49.28
    defaultLon = -123.12
    renderWeather(defaultLat, defaultLon);
}

window.addEventListener('load', () => {
    navigator.geolocation.getCurrentPosition(getBrowserLocation, getBrowserLocationError)
});

const loadBrowserPosition = () => {
    return new Promise((resolve) => {
        resolve(
            renderWeather(currentPosition[0], currentPosition[1]),
        );
    })
}


const favoriteButton = document.querySelector('#favoriteButton')
const favoriteList = document.querySelector('.favoriteList')


const checkFavorite = () => {
    let city = `${forecast.name}, ${forecast.country}`
    if (localStorage.getItem(city)) {
        favoriteButton.style.color = 'yellow';
    } else {
        favoriteButton.style.color = 'black';
    }
}

const loadFavorite = () => {
    for (let i = 0; i < localStorage.length; i++) {
        let city = localStorage.key(i);
        favoriteList.appendChild(document.createElement('a')).innerHTML = city;
    }
}



favoriteList.addEventListener('click', (e) => {
    let city = e.target.textContent;
    let position = localStorage.getItem(city);
    let lat = Number(position.split(',')[0]);
    let lon = Number(position.split(',')[1]);
    renderWeather(lat, lon, city.split(',')[0]);
})


favoriteButton.addEventListener('click', () => {
    let city = `${forecast.name}, ${forecast.country}`
    let storageValue = "";
    let position = `${autoCompleteObject.latitude}, ${autoCompleteObject.longitude}`
    if (position === "0, 0") {
        position = `${currentPosition[0]}, ${currentPosition[1]}`
    }
    if (localStorage.getItem(city)) {
        localStorage.removeItem(city);
        favoriteButton.style.color = 'black';
        for (const child of favoriteList.children) {
            child.textContent === city ? favoriteList.removeChild(child) : null;
        }
        return;
    } else {
        localStorage.setItem(city, position);
        favoriteButton.style.color = 'yellow';
        favoriteList.appendChild(document.createElement('a')).innerHTML = city;
    }
})

let autocomplete;
let autoCompleteObject = {
    name: '',
    latitude: 0,
    longitude: 0
};

window.initAutocomplete = function () {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('searchInput'),
        {
            types: ['(cities)'],
            fields: ['geometry', 'name'],
        }
    )
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('searchInput').placeholder = 'Enter a place';
    } else {
        autoCompleteObject.name = place.name;
        forecast.name = place.name;
        autoCompleteObject.latitude = place.geometry.location.lat();
        autoCompleteObject.longitude = place.geometry.location.lng();
        renderWeather(autoCompleteObject.latitude, autoCompleteObject.longitude, autoCompleteObject.name);
    }

}


