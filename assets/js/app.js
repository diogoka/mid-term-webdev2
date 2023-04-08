//----------------------get current location----------------------
function success(location) {
    const txt=
    `Latitude: ${location.coords.latitude}<br/>
    Longitude: ${location.coords.longitude}<br/>
    Accuracy: ${location.coords.accuracy} m.`
    const loc=document.querySelector(".current-Weather");
    loc.innerHTML=txt;
  }
function error(err) {
    window.alert(`Failed to get current location(${err.code}): ${err.message}`);
  }
navigator.geolocation.getCurrentPosition(success, error);
  
  