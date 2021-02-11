const form = document.getElementById('registerForm');

/*Error function*/
function invalid(input, message){
    input.classList.remove('valid');
    input.classList.add('invalid');

    let error = input.nextElementSibling;
    error.innerText = message;
    return false;
}

/*Success function*/
function valid(input){
    input.classList.remove('invalid');
    input.classList.add('valid');

    let error = input.nextElementSibling;
    error.innerText = '';
    return true;
}

/*Check Required fields */
function isEmpty(input, message) {
    if (!input.classList.contains("errAddress")){
        return input.value.trim() === '' ? invalid(input, message) : valid(input);
    }
    return input.value.trim() === '' ? invalid(input, message) : true;

}

/*Validation for Special characters*/
function specialChar(input, message){
    const regExp =  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
    return regExp.test(input.value.trim()) ? invalid(input, message) : valid(input);
}

/*Email validation*/
function validateEmail(input) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)| + (".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(input.value.trim()) ? valid(input) : invalid(input, 'Invalid email format');
}

/*Phone validation*/
function validatePhone(input) {
    const regExp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g;
    return regExp.test(input.value.trim()) ? valid(input) : invalid(input, 'Invalid phone format');
}

/*Url validation*/
function validateUrl(input) {
    const regExp =  /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return regExp.test(input.value.trim()) ? valid(input) : invalid(input, 'Invalid url format (must contain http/https)');
}

/*Check have email is exist in Local Storage*/
function checkExist(){
    if(window.localStorage.getItem('persons') !== null) {
        let arr = JSON.parse(window.localStorage.getItem('persons'));
        let elem = document.getElementById('email');
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].email.toLowerCase() === elem.value.toLowerCase()) {
                return invalid(elem, "This email is existing in Local Storage");
            }
        }
        return valid(elem);
    }
    return true;
}

/*Save Personal Information in Local Storage*/
function saveToLocalStorage(){
    let personStorage = window.localStorage;
    let persons;
    const person = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value
    };
    if(personStorage.getItem('persons') === null){
        persons = [];
    }else{
        persons = JSON.parse(personStorage.getItem('persons'));
    }
    persons.push(person);
    personStorage.setItem('persons', JSON.stringify(persons));
}
/*Remove the event enter the address field*/
document.getElementById('address').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') e.preventDefault();
});

/*Validate place*/
document.getElementById('address').addEventListener('blur',(e)=>{
    let geocoder = new google.maps.Geocoder();
    let address = e.target.value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
            valid(e.target);
            document.getElementById('address').classList.remove("errAddress");
        } else {
            invalid(e.target, 'Invalid Address!');
            document.getElementById('address').classList.add('errAddress');
        }
    });
});

/*Submit Form*/
form.addEventListener('submit', (event) => {
    let flEmpty=flName=flAddress=flEmail=flPhone=flWebsite=true;
    let fl;

    document.querySelectorAll('.registerForm input[type=text]').forEach(function(element) {
        flEmpty = isEmpty(element, 'Please enter your ' + element.id);
        if(element.id === 'name' && flEmpty){
            flName = specialChar(element, "Name must not contain special characters and numbers!");
        }
        if(element.id === 'address' && flEmpty){
           flAddress = element.classList.contains('errAddress') ? false : true;
        }
        if(element.id === 'email' && flEmpty){
            fl = validateEmail(element);
            if(fl) flEmail = checkExist();
        }
        if(element.id === 'phone' && flEmpty){
            flPhone = validatePhone(element);
        }
        if(element.id === 'website' && flEmpty){
            flWebsite = validateUrl(element);
        }
    });
    if(!flEmpty || !flName || !flAddress || !flEmail || !flPhone || !flWebsite){
        event.preventDefault();
    }else{
        saveToLocalStorage();
    }
});