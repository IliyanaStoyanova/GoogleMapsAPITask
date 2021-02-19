const form = document.querySelector('.registerForm');
const myLocalStorage = window.localStorage;
const arrFunction = ['validateSpecialChar', 'validateEmail', 'validatePhone', 'validateUrl'];

const validateObj = {
    validateSpecialChar: function(input) {
        const regExp =  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        return regExp.test(input.value.trim()) ?
            setErrorMessage(input, 'The field must not contain special characters and numbers!') :
            setSuccessMessage(input);
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
};

const setSuccessMessage = (input) => {
    const formControl = input.parentElement;
    const smallInput = formControl.querySelector('small');

    smallInput.innerText = '';
    formControl.classList.remove('invalid');
    formControl.classList.add('valid');
};

const personExist = (personInfo) => {
    if(myLocalStorage.getItem('personInfo') !== null) {
        let personObj = JSON.parse(myLocalStorage.getItem('personInfo'));
        let personEmail = personInfo.email;

        if(personEmail !== null) {
            for(const item of personObj) {
                if(item.email.toLowerCase() === personEmail.toLowerCase()) {
                    return false;
                }
            }
        }
    }
    return true;
};

const saveToLocalStorage = (personObject) => {
    let persons = [];
    if(myLocalStorage.getItem('personInfo') !== null){
        persons = JSON.parse(myLocalStorage.getItem('personInfo'));
    }
    persons.push(personObject);
    myLocalStorage.setItem('personInfo', JSON.stringify(persons));
};

const newPerson = (personInputs) => {
    let personObj = {};

    personInputs.forEach((listElement) => {
        personObj[listElement.getAttribute("name")] = listElement.value.trim();
    });
    return personObj;
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const personInputs = form.querySelectorAll('input:not([type=submit])');
    let personObj = newPerson(personInputs);

    personInputs.forEach((listElement) => {
        let nameFunction = listElement.className;
        let checkExist = arrFunction.find(element => element === nameFunction);
        if(checkExist !== undefined) {
            validateObj[nameFunction].call(personObj, listElement);
        }
    });

    // if(personExist(personObj)){
    //     saveToLocalStorage(personObj);
    // }else{
    //
    // }
});
