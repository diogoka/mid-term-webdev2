let autocomplete;
let autocompleteArray = [];


function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('searchInput'),
        {
            types: ['(cities)'],
            fields: ['geometry', 'name']
        }
    )
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('searchInput').placeholder = 'Enter a place';
    } else {
        autocompleteArray.push(place.geometry.location.lat());
        autocompleteArray.push(autocompleteLon = place.geometry.location.lng());
        console.log("autocomplete", autocompleteArray);
    }

}







