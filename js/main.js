const form = document.getElementById('registerForm');

/*Error function*/
function invalid(input, message){
    input.className = 'invalid';

    let error = input.nextElementSibling;
    error.innerText = message;
    return false;
}

/*Success function*/
function valid(input){
    input.className = 'valid';

    let error = input.nextElementSibling;
    error.innerText = '';
    return true;
}

/*Check Required fields */
function isEmpty(input, message) {
    return input.value.trim() === '' ? invalid(input, message) : valid(input);
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
    return regExp.test(input.value.trim()) ? valid(input) : invalid(input, 'Invalid url format');
}

/*Check have email is exist in Local Storage*/
function checkExist(){
    let arr = JSON.parse(localStorage.getItem('persons'));
    let elem = document.getElementById('email');
    for(let i = 0; i < arr.length; i++){
        if(arr[i].email === elem.value) {
            return invalid(elem, "This email is exist in Local Storage");
        }
    }
    return valid(elem);
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

/*Submit Form*/
form.addEventListener('submit', (event) => {
    let flEmpty=flName=flAddress=flEmail=flPhone=flWebsite=true;
    let valid;

    document.querySelectorAll('.registerForm input[type=text]').forEach(function(element) {
        valid = isEmpty(element, 'Please enter your ' + element.id);
        if(!valid) flEmpty = false;
        if(element.id === 'name' && valid){
            valid = specialChar(element, "Name must not contain special characters and numbers!");
            if(!valid) flName = false;
        }
        if(element.id === 'address' && valid){
            valid = isExistPlace(element);
            if(!valid) flAddress = false;
        }
        if(element.id === 'email' && valid){
            valid = validateEmail(element);
            if(valid) valid = checkExist();
            if(!valid) flEmail = false;
        }
        if(element.id === 'phone' && valid){
            valid = validatePhone(element);
            if(!valid) flPhone = false;
        }
        if(element.id === 'website' && valid){
            valid = validateUrl(element);
            if(!valid) flWebsite = false;
        }
    });
    if(!flEmpty || !flName || !flEmail || !flPhone || !flWebsite){
        event.preventDefault();
    }else{
        saveToLocalStorage();
    }
});