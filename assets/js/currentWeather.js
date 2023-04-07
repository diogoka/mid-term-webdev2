let lat = 49.24;
let lon = -123.11;
const key = '7986c02714e4efe92ca1c09ef5031f3f';
let forecast = [];

let weather = document.querySelector('.current-weather');

async function getWeather(lat, lon) {
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

async function renderWeather(lat, lon) {
    const data = await getWeather(lat, lon);
    weather.innerHTML = data[0];
    weather.innerHTML += `<br>${data[1]}`;
    weather.innerHTML += `<br>${data[2]}`;
    weather.innerHTML += `<br>Temp ${data[3]}°C`;
    weather.innerHTML += `<br>Temp_min ${data[4]}°C`;
    weather.innerHTML += `<br>Temp_max ${data[5]}°C`;



}

renderWeather(lat, lon);

module.exports = {
    getWeather
}