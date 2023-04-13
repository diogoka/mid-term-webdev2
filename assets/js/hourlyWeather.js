//------------succeed to get current location------------
function success(location) {
  const latitude=location.coords.latitude;
  const longitude=location.coords.longitude
  ThreeHoursWeather(latitude, longitude);
}

//------------fail to get current location------------
function error(err) {
  window.alert(`Failed to get current location(${err.code}): ${err.message}`);
  ThreeHoursWeather("vancouver", "undifined");
}

//------------get current location------------
navigator.geolocation.getCurrentPosition(success, error);

//------------function for API------------
const ThreeHoursWeather=(lat,lon)=>{
  const apiKey="7986c02714e4efe92ca1c09ef5031f3f";
  let url="";
  if(lon=="undifined"){
    url="https://api.openweathermap.org/data/2.5/forecast?q="+lat+"&appid="+apiKey;
  }else{
    url="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey;
  }
  
  fetch(url)
  .then((data)=>{return data.json()})
  .then((data)=>{
      
      const list=document.querySelector(".hourly ul");
      let time='';
      let li='';
      for(let i=0; i<=5; i++){
        
        const dateTime=new Date(data.list[i].dt*1000);
        const month = dateTime.getMonth()+1;
        const date = dateTime.getDate();
        const hours = dateTime.getHours();
        const min = String(dateTime.getMinutes()).padStart(2, '0');
        let convertTo12h="";

        if(hours==12){
          convertTo12h=hours+":"+min+"&nbsp;p.m."
        }else if(hours==24){
          convertTo12h=12+":"+min+"&nbsp;a.m."
        }else if(hours<12){
          convertTo12h=hours+":"+min+"&nbsp;a.m."
        }else{
          convertTo12h=hours-12+":"+min+"&nbsp;p.m."
        }

        time=month+"/"+date+'&nbsp;'+convertTo12h+'&nbsp;';
        li='<li>'+time+'<br/>'+data.list[i]["weather"][0]["main"]+'</li>';
        list.insertAdjacentHTML("beforeend",li)
      }
  });
};