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
    temp_min: 0,
    icon: ''
}

let autocomplete;
let autoCompleteObject = {
    name: '',
    latitude: 0,
    longitude: 0
};

let cityName = document.querySelector('#cityName');
let cityCountry = document.querySelector('#cityCountry');
let cityTemperature = document.querySelector('#cityTemperature');
let cityWeatherCondition = document.querySelector('#cityWeatherCondition');
let cityMaxTemp = document.querySelector('#maxTemp');
let cityMinTemp = document.querySelector('#minTemp');
let weatherIcon = document.querySelector('#weatherIcon');
const favoriteButton = document.querySelector('#favoriteButton')
let selectFavorites = document.querySelector('#selectFavorites')
const loader = document.querySelector('#loader');


const getWeather = async (lat, lon, placeName) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    
    placeName === undefined ? forecast.name = data.name : forecast.name = placeName;
    forecast.country = data.sys.country;
    forecast.temperature = Math.floor(data.main.temp);
    forecast.weatherCondition = data.weather[0].main;
    forecast.temp_max = Math.floor(data.main.temp_max);
    forecast.temp_min = Math.floor(data.main.temp_min);
    forecast.icon = data.weather[0].icon;
    return forecast;
}

const renderWeather = async (lat, lon, placeName) => {
    const data = await getWeather(lat, lon, placeName);
    cityName.innerHTML = data.name;
    cityCountry.innerHTML = data.country;
    cityTemperature.innerHTML = `${data.temperature}°`;
    cityTemperature.innerHTML += `<span class="degree">C</span>`;
    cityWeatherCondition.innerHTML = data.weatherCondition;
    cityMaxTemp.innerHTML = `Max ${data.temp_max}°C`;
    cityMinTemp.innerHTML = `Min ${data.temp_min}°C`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    checkFavorite();
    hideLoader();
}


const getHoursDayWeather = (lat, lon) => {
    
    const apiKey = "7986c02714e4efe92ca1c09ef5031f3f";
    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";

    fetch(url)
        .then((data) => { return data.json() })
        .then((data) => {

            const hrlyData = (value) => {

                const dateConvert_First = value.innerText.split("day")[1];
                data.list.forEach((value, index) => {
                    const dateTime = new Date(value.dt * 1000);
                    const month = dateTime.getMonth() + 1;
                    const date = dateTime.getDate();

                    if (date == dateConvert_First) {
                        const dateTime = new Date(value.dt * 1000);
                        const month = dateTime.getMonth() + 1;
                        const date = dateTime.getDate();
                        const hours = dateTime.getHours();
                        const min = String(dateTime.getMinutes()).padStart(2, '0');
                        let convertTo12h = "";

                        if (hours == 12) {
                            convertTo12h = hours + ":" + min + "&nbsp;p.m.";
                        } else if (hours == 24) {
                            convertTo12h = 12 + ":" + min + "&nbsp;a.m.";
                        } else if (hours < 12) {
                            convertTo12h = hours + ":" + min + "&nbsp;a.m.";
                        } else {
                            convertTo12h = hours - 12 + ":" + min + "&nbsp;p.m.";
                        }

                        const m_d = month + "/" + date;
                        const time = convertTo12h + '&nbsp;';
                        const weather = data.list[index]["weather"][0]["main"];
                        const icon = '<img class="weatherIcon' + index + '" alt="aa"/>';
                        const temp = Math.round(value["main"]["temp"]) + "&deg;C";
                        const li = '<li>' + time + '<br/>' + icon + weather + '<br/>' + temp + '</li>';
                        document.querySelector(".hourly div").innerText = m_d;
                        document.querySelector(".hourly ul").insertAdjacentHTML("beforeend", li);
                        const iconImg = value["weather"][0]["icon"];
                        const getImg = document.querySelector(".weatherIcon" + index);
                        getImg.src = `http://openweathermap.org/img/wn/${iconImg}@2x.png`;
                    }//if(date==dateConvert)
                })//forEach
            }//function


            const dailyData_First = document.querySelector(".daily-items");
            hrlyData(dailyData_First);

            const dailyData = document.querySelectorAll(".daily-items");
            dailyData.forEach((value) => {
                value.addEventListener("click", () => {

                    const hourlyLi = document.querySelectorAll(".hourly li");
                    hourlyLi.forEach((vl) => {
                        vl.remove();
                    });

                    hrlyData(value);

                })//addEventListner
            })//forEach
        });
};

const getBrowserLocationSuccess = (location) => {
    lat = location.coords.latitude;
    lon = location.coords.longitude;
    currentPosition.push(lat);
    currentPosition.push(lon);
    loadBrowserPosition();
    loadFavorite();
    hideLoader();
}

const getBrowserLocationError = (err) => {
    window.alert(`Failed to get current location (${err.code}): ${err.message}. Default location loaded: Vancouver`);
    defaultLat = 49.2811465
    defaultLon = -123.1200766
    renderWeather(defaultLat, defaultLon);
    getHoursDayWeather(defaultLat, defaultLon);
    hideLoader();
}

const loadBrowserPosition = () => {
    return new Promise((resolve) => {
        resolve(
            renderWeather(currentPosition[0], currentPosition[1]),
            getHoursDayWeather(currentPosition[0], currentPosition[1])
        );
    })
}

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
        selectFavorites.appendChild(document.createElement('option')).innerHTML = city;
    }
}

selectFavorites.addEventListener('change', (e) => {
    let city = e.target.value;
    let position = localStorage.getItem(city);
    let lat = Number(position.split(',')[0]);
    let lon = Number(position.split(',')[1]);
    renderWithLoader(lat, lon, city.split(',')[0]);
    selectFavorites.options[0].selected = true;
})


favoriteButton.addEventListener('click', () => {
    let city = `${forecast.name}, ${forecast.country}`
    let position = `${autoCompleteObject.latitude}, ${autoCompleteObject.longitude}`

    if (position === "0, 0") {
        position = `${currentPosition[0]}, ${currentPosition[1]}`
    }
    if (localStorage.getItem(city)) {
        localStorage.removeItem(city);
        favoriteButton.style.color = 'black';
        for (const child of selectFavorites.children) {
            child.textContent === city ? selectFavorites.removeChild(child) : null;
        }
        return;
    } else {
        if (position === "undefined, undefined") {
            position = "49.2811465, -123.1200766"
        }
        localStorage.setItem(city, position);
        favoriteButton.style.color = 'yellow';
        selectFavorites.appendChild(document.createElement('option')).innerHTML = city;
    }
})

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
        renderWithLoader(autoCompleteObject.latitude, autoCompleteObject.longitude, autoCompleteObject.name)
        document.getElementById('searchInput').value = '';

    }

}


const renderWithLoader = (lat, lon, name) => {
    return new Promise((resolve) => {
        showLoader();
        renderWeather(lat, lon, name);
        getHoursDayWeather(lat, lon);
    })
}

const showLoader = () => {
    loader.style.display = 'flex';
}

const hideLoader = () => {
    loader.style.display = 'none';
    
}

window.addEventListener('load', () => {
    showLoader();
    navigator.geolocation.getCurrentPosition(getBrowserLocationSuccess, getBrowserLocationError)

});
