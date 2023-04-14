


const weather = (lat, lon) => {
  const apiKey = "7986c02714e4efe92ca1c09ef5031f3f";
  let url = "";
  if (lon == "undifined") {
    url = "https://api.openweathermap.org/data/2.5/forecast?q=" + lat + "&appid=" + apiKey;
  } else {
    url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=" + "&units=metric";
  }

  fetch(url)
    .then((data) => { return data.json() })
    .then((data) => {
      const day = {}
      let daysToRender = {};
      for (let i = 0; i < data.list.length; i++) {
        const dateTime = new Date(data.list[i].dt * 1000);
        let correctDate = dateTime.toUTCString().split(" ")[1] + " " + dateTime.toUTCString().split(" ")[2];
        const month = dateTime.getMonth() + 1;
        const date = dateTime.getDate();
        time = month + "/" + date;
        if (!day[correctDate]) {
          day[correctDate] = [data.list[i]]
        } else {
          day[correctDate].push(data.list[i])
        };
      }

      for (const key in day) {
        if (Object.keys(daysToRender).length < 5) {
          let temp = day[key].reduce((acc, cur) => {
            return acc + cur.main.temp;
          }, 0)
          temp = temp / day[key].length;
          daysToRender[key] = {
            average: Math.floor(temp),
          };
          let maximum = day[key].reduce((acc, cur) => {
            return acc > cur.main.temp_max ? acc : cur.main.temp_max;
          }, 0)
          daysToRender[key].maximum = Math.floor(maximum);
          let minimum = day[key].reduce((acc, cur) => {
            return acc < cur.main.temp_min ? acc : cur.main.temp_min;
          }, +Infinity)

          daysToRender[key].minimum = Math.floor(minimum);

          let icon = day[key].reduce((acc, cur) => {
            return acc > Number(cur.weather[0].icon.slice(0, 2)) ? acc : Number(cur.weather[0].icon.slice(0, 2));
          }, 0)
          let srcIcon = icon + "d";
          daysToRender[key].icon = srcIcon;

        } else {
          break;
        }
      }

      console.log("TAMANHO", Object.keys(daysToRender).length);
      console.log("daysToRender", daysToRender);
    })

}


const renderDays = async (lat, lon) => {

  const data = await weather(lat, lon);
  console.log("data", data);


}

renderDays(49.2811465, -123.1200766);


