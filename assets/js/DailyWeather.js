const weather = async (lat, lon) => {
  const apiKey = "7986c02714e4efe92ca1c09ef5031f3f";
  let url = "";
  if (lon == "undifined") {
    url =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      lat +
      "&appid=" +
      apiKey;
  } else {
    url =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey +
      "&cnt=" +
      "&units=metric";
  }

  const result = await fetch(url);
  const data = await result.json();
  const obj = {};
  const dailyForecast = {};
  // console.log('data',data);

  let time = "";
  let li = "";
  for (let i = 0; i < data.list.length; i++) {
    const dateTime = new Date(data.list[i].dt * 1000);
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();
    time = month + "/" + date;
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
    // console.log("Average Temp for the day", Math.floor(averageTemp));
    loggedIcon = obj[day].reduce((acc, curr) => {
      return acc > Number(curr.weather[0].icon.slice(0, 2))
        ? acc
        : Number(curr.weather[0].icon.slice(0, 2));
    }, 0);
    // console.log('Icon for the day',loggedIcon);
    dailyForecast[day] = {
      Temperature: Math.floor(averageTemp),
      MaxTemperature: Math.floor(maxTempDay),
      MinTemperature: Math.floor(minTempDay),
      icon: loggedIcon,
    };
  }
  // console.log("final", dailyForecast);

  return dailyForecast;
};

const getDailyWeather = async (lat, lon) => {
  const daily = await weather(lat, lon);
  let day = dailyForecast;
  // weather(lat, lon).then(res => {
  //   console.log('res', res);
  // })

  // let dailyweatherTitle = document.querySelector(".dailyweatherTitle");

  // dailyweatherTitle.innerHTML = daily.Temperature;
  // dailyWeatherIcon.innerHTML = daily.dailyForecast.icon;
  console.log(daily[day].Temperature);
  console.log("render", daily);
};
getDailyWeather(49.24, -123.11);
