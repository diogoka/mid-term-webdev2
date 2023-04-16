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

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const data = await response.json();
        console.log(data);
        placeName === undefined ? forecast.name = data.name : forecast.name = placeName;
        forecast.country = data.sys.country;
        forecast.temperature = Math.floor(data.main.temp);
        forecast.weatherCondition = data.weather[0].main;
        forecast.temp_max = Math.floor(data.main.temp_max);
        forecast.temp_min = Math.floor(data.main.temp_min);
        forecast.icon = data.weather[0].icon;
        return forecast;
    } catch (error) {
        alert(`Failed to get weather data: ${error}. Please try again later.`);
        hideLoader();
    }
}

const renderWeather = async (lat, lon, placeName) => {
    try {
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
    } catch (error) {
        alert(`Failed to get weather data: ${error}. Please try again later.`);
        hideLoader();

    }
}


const getHoursDayWeather = (lat, lon) => {
    console.log("getHoursDayWeather", lat, lon);
    const apiKey = "7986c02714e4efe92ca1c09ef5031f3f";
    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";

    fetch(url)
        .then((data) => { return data.json() })
        .then((data) => {

//////////////////////////////////////Daily Weather//////////////////////////////////////

    const obj = {};
    const dailyForecast = {};

    let monthArray=[
        "January","February","March","April","May","June",
        "July","August","September","Octobar","November","December"
    ];

    let time = "";
    
    for (let i = 0; i < data.list.length; i++) {
        const dateTime = new Date(data.list[i].dt * 1000);
        const month = dateTime.getMonth();
        const date = dateTime.getDate();
        time = monthArray[month] + ", " + date;
        if (!obj[time]) {
        obj[time] = [data.list[i]];
        } else {
        obj[time].push(data.list[i]);
        }
    }
   
    for (const day in obj) {
        // console.log('--------Day---------', obj[day]);
        let maxTempDay;
        let minTempDay;
        let sumAverageTemp;
        maxTempDay = obj[day].reduce((acc, curr) => {
        return acc > curr.main.temp_max ? acc : curr.main.temp_max;
        }, 0);
        // console.log("maxTempDay", Math.floor(maxTempDay));
        minTempDay = obj[day].reduce((acc, curr) => {
        return acc < curr.main.temp_min ? acc : curr.main.temp_min;
        });
        // console.log("minTempDay", Math.floor(minTempDay));
        sumAverageTemp = obj[day].reduce((acc, curr) => {
        return acc + curr.main.temp;
        }, 0);
        let averageTemp = sumAverageTemp / obj[day].length;
        console.log("Average Temp for the day", Math.floor(averageTemp));
        let loggedIcon = obj[day].reduce((acc, curr) => {
        return acc > Number(curr.weather[0].icon.slice(0, 2))
            ? acc
            : Number(curr.weather[0].icon.slice(0, 2));
        }, 0);

        if (loggedIcon < 10) {
            loggedIcon = "0" + loggedIcon;
        }
        let srcIcon = loggedIcon + "d";

        console.log('Icon for the day',loggedIcon);
        dailyForecast[day] = {
        Temperature: Math.floor(averageTemp),
        MaxTemperature: Math.floor(maxTempDay),
        MinTemperature: Math.floor(minTempDay),
        icon: srcIcon,
        };
    }

    const dailyList=document.querySelector(".daily ul")
    let i=1;
    for(let key in dailyForecast){
        if(i<=5){
            let li=
            '<li class="daily-items position'+i+'"><span class="bold">'+key+
            '</span><img class="icon'+key.split(", ")[1]+'"><span class="bold">'
            +dailyForecast[key].Temperature +'&deg;C</span><div><span>Max:&nbsp;'
            +dailyForecast[key].MaxTemperature+'&deg;C</span><span>Min:&nbsp;'
            +dailyForecast[key].MinTemperature+'&deg;C</span></div></li>'
            dailyList.insertAdjacentHTML("beforeend", li);
            const getImg = document.querySelector(".icon" + key.split(", ")[1]);
            //getImg.src = `http://openweathermap.org/img/wn/${dailyForecast[key].srcIcon}@2x.png`;
            getImg.src = `http://openweathermap.org/img/wn/10d@2x.png`;
        }
        i+=1;
    }

/////////////////////////////////////////////////////////////////////////////////

            const hourlyData = (value) => {
        
                value.style.background='#7eb1eb';
                const number = parseInt(value.classList[1].split("position")[1]);
                const dailyItems = window.getComputedStyle(document.querySelector(".daily"));
                
                const width = parseInt(dailyItems.getPropertyValue('width'));
                const padding = parseInt(dailyItems.getPropertyValue('padding-left'));
                const arrowWidth = parseInt(document.querySelector(".upArrow svg").getAttribute("width"))
                document.querySelector(".upArrow").style.left=(width/5)*(number-1/2)+padding-arrowWidth/2+"px"

                const height = parseInt(dailyItems.getPropertyValue('height'));
                const padding_top = parseInt(dailyItems.getPropertyValue('padding-top'));
                const arrowHeight = parseInt(document.querySelector(".rightArrow svg").getAttribute("height"))
                document.querySelector(".rightArrow").style.top=((height-padding_top*2)/5)*(number-1/2)+padding_top-arrowHeight/2+"px"
                    
                const dateConvert_First = value.children[0].innerText.split(", ")[1];
                data.list.forEach((value2, index) => {
                    const dateTime = new Date(value2.dt * 1000);
                    //const month = dateTime.getMonth() + 1;
                    const date = dateTime.getDate();

                    if (date == dateConvert_First) {
                        
                        const month = dateTime.getMonth() + 1;
                        const date = dateTime.getDate();
                        const hours = dateTime.getHours();
                        const min = String(dateTime.getMinutes()).padStart(2, '0');
                        let convertTo12h = "";

                        if (hours < 12) {
                            convertTo12h = hours + ":" + min + "&nbsp;a.m.";
                        } else {
                            convertTo12h = hours - 12 + ":" + min + "&nbsp;p.m.";
                        }

                        const time = '<span class="time">' + convertTo12h + '</span>';
                        const icon = '<img class="weatherIcon' + index + '"/>';
                        const weather = '<span>'+data.list[index]["weather"][0]["main"]+'</span>';
                        const temp = '<span>'+Math.round(value2["main"]["temp"]) + "&deg;C</span>";
                        const li = '<li><div>' + time + icon + weather + temp + '</div></li>';
                        
                        document.querySelector(".hourly .showDate").innerText = value.children[0].innerText;
                        document.querySelector(".hourly ul").insertAdjacentHTML("beforeend", li);
                        
                        const iconImg = value2["weather"][0]["icon"];
                        const getImg = document.querySelector(".weatherIcon" + index);
                        getImg.src = `http://openweathermap.org/img/wn/${iconImg}@2x.png`;
                    }//if(date==dateConvert)
                })//forEach
            }//function

            const dailyData_First = document.querySelector(".daily-items");
            hourlyData(dailyData_First);

            const dailyData = document.querySelectorAll(".daily-items");
            dailyData.forEach((value) => {

                value.addEventListener("click", () => {

                    dailyData.forEach((value) => {value.style.background="#A8C9EF"})

                    const hourlyLi = document.querySelectorAll(".hourly li");
                    hourlyLi.forEach((vl) => {
                        vl.remove();
                    });

                    hourlyData(value);
                        
                })//addEventListner
            })//forEach
            
        })
        .catch((error) => {
            alert(`Failed to get weather data: ${error}. Please try again later.`);
            hideLoader();
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
    return new Promise((resolve, reject) => {
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
    console.log('hide');
}

window.addEventListener('load', () => {
    showLoader();
    navigator.geolocation.getCurrentPosition(getBrowserLocationSuccess, getBrowserLocationError)

});
