let map;
let completeAddress;

function isExistPlace(input){
    const inputAddress = input.value;
    const geocod = new google.maps.Geocoder();

    geocod.geocode({ 'address': inputAddress,  "componentRestrictions":{"country":"BG"} }, (results, status) => {
        if (status === "OK") {
            if(results[0].formatted_address) {
                return valid(input);
            }
            return invalid(input, 'Invalid Address!');
        }
        return invalid(input, 'Invalid Address!');
    });
}

function initAddress(){
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.7249925, lng: 25.4833039 },
        zoom: 7,
    });
    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    const infowindowContent = document.getElementById("place-address");
    const infowindow = new google.maps.InfoWindow({
        content: infowindowContent
    });

    completeAddress = new google.maps.places.Autocomplete(
        document.getElementById('address'),
        {
            types: ['geocode'],
            componentRestrictions: {'country' : ['BG']},
            fields: ['formatted_address', 'geometry', 'name']
        }
    );

    const geocoder = new google.maps.Geocoder();

/*Convert coordinates to address and show in the input field*/
    function geocodeLatLng(geocoder, latlng, map, infowindow) {
        const latlngStr = latlng.toString().slice(1,-1).split(",", 2);
        const coordinates = {
            lat: parseFloat(latlngStr[0]),
            lng: parseFloat(latlngStr[1]),
        };
        geocoder.geocode({ location: coordinates }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    map.setZoom(17);
                    marker.setPosition(coordinates);
                    marker.setVisible(true);
                    infowindow.setContent(results[0].formatted_address);
                    document.getElementById('address').value = infowindow.content;
                    infowindow.open(map, marker);
                } else {
                    invalid(document.getElementById('address'), 'Noting result found!');
                }
            } else {
                invalid(document.getElementById('address'),'Something is wrong! Try again!');
            }
        });
    }

/*Created marker*/
    function addMarker(latLng){
        marker.setPosition(latLng);
        marker.setVisible(true);
        //map.panTo(latLng);
    }

/*Click on the map to show the address and the marker*/
    map.addListener("click", (e) => {
        addMarker(e.latLng, map);
        geocodeLatLng(geocoder, e.latLng, map, infowindow);
    });

/*Event for choose address*/
    completeAddress.addListener('place_changed', () => {
        const place = completeAddress.getPlace();
        if(!place.geometry){
            return false;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        infowindowContent.textContent = place.formatted_address;
        infowindow.open(map, marker);
    });
}
