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
      url="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey+"&cnt="+"&units=metric";
    }
  
    fetch(url)
    .then((data)=>{return data.json()})
    .then((data) =>{
        console.log(
            data.list[0].main.temp_max,
            data.list[0].main.temp_min
            );
  
        const list=document.querySelector(".daily ul");
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
          li='<li>'+time+'<br/>'+data.list[i]["main"]["temp_max"]+'<br/>'+data.list[i]["main"]["temp_min"]+'<br/>'+Math.max(data.list[i].main.max_temp)+'</li>';
          list.insertAdjacentHTML("beforeend",li)
          
        }
    });
  };