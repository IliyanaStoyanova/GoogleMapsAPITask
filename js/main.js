const form = document.querySelector('.registerForm');
const myLocalStorage = window.localStorage;
const arrFunction = ['validateFullField','validateAddress','validateSpecialChar',
                     'validateEmail', 'validatePhone', 'validateUrl'];

const validateObj = {
    validateFullField: function(input) {
        return (input.value.trim() !== '') ? 
            setSuccessMessage(input): 
            setErrorMessage(input, 'This field is required!');
    },
    validateSpecialChar: function(input) {
        const regExp =  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        return regExp.test(input.value.trim()) ?
            setErrorMessage(input, 'This field must not contain special characters and numbers!') :
            setSuccessMessage(input);
    },
    validateAddress: function(input){
        const geocoder = new google.maps.Geocoder();
        const checkPromise = new Promise((resolve, reject) => {
            geocoder.geocode({'address': input.value}, function (results, status) {
              if(status === 'OK') {
                 resolve(setSuccessMessage(input));
              }else {
                 reject(setErrorMessage(input, "Couldn't find the location!"));
              } 
            });            
        });
        return checkPromise;
    },
    validateEmail: function(input) {
        const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)| + (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regExp.test(input.value.trim()) ?
            setSuccessMessage(input) :
            setErrorMessage(input, 'Invalid email format!');
    },
    validatePhone: function(input) {
        const regExp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g;
        return regExp.test(input.value.trim()) ?
            setSuccessMessage(input) :
            setErrorMessage(input, 'Invalid phone format') ;
    },
    validateUrl: function(input) {
        const regExp =  /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        return regExp.test(input.value.trim()) ?
            setSuccessMessage(input) :
            setErrorMessage(input, 'Invalid url format (must contain http/https)');
    }
}

const setErrorMessage = (input, message) => {
    const formControl = input.parentElement;
    const smallInput = formControl.querySelector('small');

    smallInput.innerText = message;
    formControl.classList.remove('valid');
    formControl.classList.add('invalid');

    return false;
};

const setSuccessMessage = (input) => {
    const formControl = input.parentElement;
    const smallInput = formControl.querySelector('small');

    smallInput.innerText = '';
    formControl.classList.remove('invalid');
    formControl.classList.add('valid');

    return true;
};

const saveToLocalStorage = (personObject) => {
    let persons = [];
    if(myLocalStorage.getItem('personInfo') !== null){
        persons = JSON.parse(myLocalStorage.getItem('personInfo'));
    }
    persons.push(personObject);
    myLocalStorage.setItem('personInfo', JSON.stringify(persons));
    return true;
};

const newPerson = (personInputs) => {
    let personObj = {};

    personInputs.forEach((listElement) => {
        personObj[listElement.getAttribute("name")] = listElement.value.trim();
    });
    return personObj;
};

function initAddress(){
    const addressField = document.querySelector('#address');
    const map = new google.maps.Map(document.querySelector("#map"), {
        center: { lat: 42.7249925, lng: 25.4833039 },
        zoom: 7,
    });
    const geocoder = new google.maps.Geocoder();
    const icon = './images/pin_red.png';
    const marker = new google.maps.Marker({
        map,
        icon: icon,
        anchorPoint: new google.maps.Point(0, -45),
    });

    const infowindowContent = document.querySelector("#place-address");
    const infowindow = new google.maps.InfoWindow({
        content: infowindowContent
    });

    let completeAddress = new google.maps.places.Autocomplete(
        addressField,
        {
            types: ['geocode'],
            componentRestrictions: {'country' : ['BG']},
            fields: ['formatted_address', 'geometry', 'name']
        }
    );

    function geocodeLatLng(latlng) {
        const latlngStr = latlng.toString().slice(1,-1).split(",", 2);
        const coordinates = {
            lat: parseFloat(latlngStr[0]),
            lng: parseFloat(latlngStr[1]),
        };
        geocoder.geocode({ location: coordinates }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    map.setZoom(17);
                    addressField.value = results[0].formatted_address;
                    marker.setPosition(coordinates);
                    marker.setVisible(true);
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    return setSuccessMessage(addressField);
                } else {
                    return setErrorMessage(addressField, 'Noting result found!');
                }
            } else {
                return setErrorMessage(addressField,'Something is wrong! Try again!');
            }
        });
    }

    function addMarker(latLng){
        marker.setPosition(latLng);
        marker.setVisible(true);
    }

    map.addListener("click", (e) => {
        addMarker(e.latLng);
        geocodeLatLng(e.latLng);
    });

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

        infowindow.setContent(place.formatted_address);
        infowindow.open(map, marker);
    });
}

const checkRequired = (form, person) =>{
    const inputRequired = form.querySelectorAll('.validateFullField');
    let arr = [];

    if(inputRequired !== null) {
        inputRequired.forEach((listElement) => {
            arr.push(validateObj.validateFullField.call(person, listElement));
        });
       return arr.every(item => item === true);
    }
    return false;
}

const validateDifferent = (form) => {
    if(myLocalStorage.getItem('personInfo') !== null) {
        const input = form.querySelector('.validateEmail');
        let personObj = JSON.parse(myLocalStorage.getItem('personInfo'));
        let personEmail = input.value;
        if(personEmail !== null) {
            for(const item of personObj) {
                if(item.email.toLowerCase() !== personEmail.toLowerCase()){  
                    setSuccessMessage(input);                        
                }else{                  
                    return setErrorMessage(input, 'This email is existing in Local Storage');
                }
            }
        }
    }
    return true;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const personInputs = form.querySelectorAll('input:not([type=submit])');
    let personObj = newPerson(personInputs);
    let flagValidation = [];
        
    let flagFull = checkRequired(form, personObj);
    if(flagFull) {        
        const inputAddress = form.querySelector('.validateAddress');
        if(inputAddress !== null) {
            let res = Promise.resolve(validateObj.validateAddress.call(personObj, inputAddress));
            await res.then(function (result) {
                flagValidation.push(result);
            }).catch(function (error){
                flagValidation.push(error);
            });
        }

        personInputs.forEach((listElement) => {
            let strClass = listElement.className;
            strClass = strClass.replace('validateFullField','').trim();
            strClass = strClass.replace('validateAddress','').trim();
            const arrClass = strClass.split(' ');
            arrClass.forEach((item) => {   
                let checkExist = arrFunction.find(element => element === item);
                if(checkExist !== undefined) {       
                    let res = validateObj[item].call(personObj, listElement);
                    flagValidation.push(res);
                }
            });
        });

        let searchErrors = flagValidation.includes(false);
        if(!searchErrors && validateDifferent(form)) {
            if(saveToLocalStorage(personObj)){
                const container = document.querySelector('.registerForm');
                container.classList.add('message-submit');
                const googleMaps = document.querySelector('.google-maps');
                googleMaps.classList.add('map-submit');
                const submitMessage = document.querySelector('.form-title');
                submitMessage.innerHTML = 'Success! Your information is saved!';
            }
        } 
    }
});