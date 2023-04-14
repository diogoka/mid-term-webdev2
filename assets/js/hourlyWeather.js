//------------succeed to get current location------------
function success(location) {
  const latitude=location.coords.latitude;
  const longitude=location.coords.longitude;
  ThreeHoursWeather(latitude, longitude);
}

//------------fail to get current location------------
function error(err) {
  const defaultLat = 49.2811465;
  const defaultLon = -123.1200766;
  window.alert(`Failed to get current location(${err.code}): ${err.message}`);
  ThreeHoursWeather(defaultLat, defaultLon);
}

//------------get current location------------
navigator.geolocation.getCurrentPosition(success, error);

//------------function for API------------
const ThreeHoursWeather=(lat,lon)=>{
  const apiKey="7986c02714e4efe92ca1c09ef5031f3f";
  const url="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey+"&units=metric";
  
  fetch(url)
  .then((data)=>{return data.json()})
  .then((data)=>{

      const hrlyData=(value)=>{
    
          const dateConvert_First=value.innerText.split("day")[1];
          data.list.forEach((value, index)=>{
              const dateTime=new Date(value.dt*1000);
              const month = dateTime.getMonth()+1;
              const date = dateTime.getDate();

              if(date==dateConvert_First){
                const dateTime=new Date(value.dt*1000);
                const month = dateTime.getMonth()+1;
                const date = dateTime.getDate();
                const hours = dateTime.getHours();
                const min = String(dateTime.getMinutes()).padStart(2, '0');
                let convertTo12h="";
            
                if(hours==12){
                    convertTo12h=hours+":"+min+"&nbsp;p.m.";
                  }else if(hours==24){
                    convertTo12h=12+":"+min+"&nbsp;a.m.";
                  }else if(hours<12){
                    convertTo12h=hours+":"+min+"&nbsp;a.m.";
                  }else{
                    convertTo12h=hours-12+":"+min+"&nbsp;p.m.";
                }

                const m_d=month+"/"+date;
                const time=convertTo12h+'&nbsp;';
                const weather=data.list[index]["weather"][0]["main"];
                const icon='<img class="weatherIcon'+index+'" alt="aa"/>';                       
                const temp=Math.round(value["main"]["temp"])+"&deg;C";
                const li='<li>'+time+'<br/>'+icon+weather+'<br/>'+temp+'</li>';
                document.querySelector(".hourly div").innerText=m_d;
                document.querySelector(".hourly ul").insertAdjacentHTML("beforeend",li);
                const iconImg=value["weather"][0]["icon"];
                const getImg=document.querySelector(".weatherIcon"+index);
                getImg.src=`http://openweathermap.org/img/wn/${iconImg}@2x.png`;
            }//if(date==dateConvert)
        })//forEach
      }//function


      const dailyData_First=document.querySelector(".daily-items");
      hrlyData(dailyData_First);

      const dailyData=document.querySelectorAll(".daily-items");
      dailyData.forEach((value)=>{
          value.addEventListener("click",()=>{
                    
              const hourlyLi=document.querySelectorAll(".hourly li");
              hourlyLi.forEach((vl)=>{
                  vl.remove();
              });

              hrlyData(value);
              
              })//addEventListner
        })//forEach
  });
};