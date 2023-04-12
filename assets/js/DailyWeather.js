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
            const obj ={
            
              
            }
  
        const list=document.querySelector(".daily ul");
        let time='';
        let li='';
        for(let i=0; i<data.list.length; i++){
          const dateTime=new Date(data.list[i].dt*1000);
          const month = dateTime.getMonth()+1;
          const date = dateTime.getDate();
          time=month+"/"+date;
          if(!obj[time]){
            obj[time] = [data.list[i]]
          } else {
            obj[time].push(data.list[i])
          };
        
          console.log('time', time);
          // li='<li>'+obj+'<br/>'+data.list[i]["main"]["temp_max"]+'<br/>'+data.list[i]["main"]["temp_min"]+'<br/>'+'</li>';
          // list.insertAdjacentHTML("beforeend",li)
          
          
        }
        for (const j in obj) {
          obj[j].forEach(element => {
             console.log(Math.max(element.main.temp_max));
             

          });;
         };
        // console.log(Object.keys(obj));

        // console.log('obj',obj);
        // console.log("inside", obj);
    });
  };