let Day1 = []
let Day2 = []
let Day3 = []
let Day4 = []
let Day5 = []
let Day6 = []
const apiKey = '7986c02714e4efe92ca1c09ef5031f3f'
const lat = 49.2812287
const lon = -123.1201192
fetch(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
.then((data)=>{return data.json()})
console.log(data.list[0].dt);
