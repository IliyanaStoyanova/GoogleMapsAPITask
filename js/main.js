const form = document.querySelector('.registerForm');
const myLocalStorage = window.localStorage;
const arrFunction = ['validateIsEmpty','validateSpecialChar', 'validateEmail', 'validatePhone', 'validateUrl'];

const validateObj = {
    validateIsEmpty: function(input) {
        return (input.value.trim() === '') ? 
            setErrorMessage(input, 'This field is required!') : 
            setSuccessMessage(input);
    },
    validateSpecialChar: function(input) {
        const regExp =  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        return regExp.test(input.value.trim()) ?
            setErrorMessage(input, 'This field must not contain special characters and numbers!') :
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

const personNotExist = (personInfo) => {
    if(myLocalStorage.getItem('personInfo') !== null) {
        let personObj = JSON.parse(myLocalStorage.getItem('personInfo'));
        let personEmail = personInfo.email;

        if(personEmail !== null){
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
    let flagValidation = true;
    let flagFull = false;
   
    personInputs.forEach((listElement) => {
        let inputEmpty = listElement.classList.contains('validateIsEmpty');
        if(inputEmpty) {
            flagFull = validateObj.validateIsEmpty.call(personObj, listElement);
        }
        if(flagFull) {
            let nameFunction = listElement.className;
            nameFunction = nameFunction.replace('validateIsEmpty','').trim();
            const arrClass = nameFunction.split(' ');
            arrClass.forEach((item) => {   
                let checkExist = arrFunction.find(element => element === item);
                if(checkExist !== undefined) {
                    if(!validateObj[item].call(personObj, listElement)) {
                        flagValidation = false;
                    }
                }
            });
        }
    });
    if(flagValidation && personNotExist(personObj)) {
        saveToLocalStorage(personObj);
    }else{
    
    }
});
