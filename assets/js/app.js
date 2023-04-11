//----------------------get current location----------------------
function success(location) {
  const latitude=location.coords.latitude;
  const longitude=location.coords.longitude
  const txt=
  `Latitude: ${latitude}<br/>
  Longitude: ${longitude}<br/>
  Accuracy: ${location.coords.accuracy} m.`
  const loc=document.querySelector(".current-Weather");
  loc.innerHTML=txt;
  weather(latitude, longitude);
}

function error(err) {
  window.alert(`Failed to get current location(${err.code}): ${err.message}`);
  weather("vancouver", "undifined");
}

navigator.geolocation.getCurrentPosition(success, error);
  
const weather=(lat,lon)=>{
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
        time=month+"/"+date+'&nbsp;'+hours+":"+min+'&nbsp;';
        li='<li>'+time+'<br/>'+data.list[i]["weather"][0]["main"]+'</li>';
        list.insertAdjacentHTML("beforeend",li)
      }
  });
};