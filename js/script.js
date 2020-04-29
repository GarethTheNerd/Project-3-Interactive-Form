//I'll add all of the selectors that we need at the top to make the code more readable
//Basic info fields
const nameField = document.querySelector('input#name');
const emailField = document.querySelector('input#mail');
//Job role fields
const jobRoleField = document.querySelector('select#title');
const otherJobRoleField = document.querySelector('input#other-title');
//T-Shirt fields
const shirtSizeField = document.querySelector('select#size');
const shirtDesignField = document.querySelector('select#design');
const shirtColorField = document.querySelector('select#color');
//Activity checkboxes
const activityCheckboxes = document.querySelectorAll('fieldset.activities > label > input');
//Payment method field
const paymentMethodField = document.querySelector('select#payment');
//Credit Card fields
const ccNumField = document.querySelector('input#cc-num');
const zipCodeField = document.querySelector('input#zip');
const cvvField = document.querySelector('input#cvv');
const expiryMonthField = document.querySelector('select#exp-month');
const expiryYearField = document.querySelector('select#exp-year');
//Payment method divs
const creditCardDiv = document.querySelector('div#credit-card');
const paypalDiv = document.querySelector('div#paypal');
const bitcoinDiv = document.querySelector('div#bitcoin');
//Shirt color options div
const colorOptionsDiv = document.querySelector('div#colors-js-puns');
//submit button
const submitButton = document.querySelector('button[type=submit]');

//Getting the page ready at page load
nameField.focus(); //This just puts the cursor in the name field
otherJobRoleField.style.display = 'none'; //hide the other role field
colorOptionsDiv.style.display = 'none'; //hide the color options
//Hide the bitcoin and paypal payment method options
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
//Add the price span ready for calculating later
const activityFieldset = document.querySelector('fieldset.activities');
const costSpan = document.createElement('span');
costSpan.className = 'cost';
costSpan.textContent = `Cost: $0`;
activityFieldset.appendChild(costSpan);
//Disable the submit button
submitButton.disabled = 'true';
//Select credit card by default
const selectPaymentMethodOption = document.querySelector('select#payment > option[value="select method"]');
paymentMethodField.removeChild(selectPaymentMethodOption);
//Create spans for errors
const nameErrorSpan = document.createElement('span');
nameErrorSpan.className = "error";
const nameLabel = document.querySelector('label[for=name]');
nameLabel.appendChild(nameErrorSpan);

const emailErrorSpan = document.createElement('span');
emailErrorSpan.className = "error";
const emailLabel = document.querySelector('label[for=mail]');
emailLabel.appendChild(emailErrorSpan);

//add a change event listener to the job drop down to show and hide the other box
jobRoleField.addEventListener('change', () => {

    if(jobRoleField.value === 'other') {
        otherJobRoleField.style.display = '';
    } else {
        otherJobRoleField.style.display = 'none';
    }

});

shirtDesignField.addEventListener('change', () => { //Adding a change listener to the shirt design so we can add the relevant color options

    if(shirtDesignField.value === 'js puns') {
        removeColorOptions(); //This funtion removes all the color options from the select element so we can re-add the relevant ones

        //We are now re-creating the option items relevant to the color that was selected 
        const cornflowerBlue = document.createElement('option');
        cornflowerBlue.value = 'cornflowerblue';
        cornflowerBlue.textContent = 'Cornflower Blue';
        shirtColorField.appendChild(cornflowerBlue);

        const darkSlateGrey = document.createElement('option');
        darkSlateGrey.value = 'darkslategrey';
        darkSlateGrey.textContent = 'Dark Slate Grey';
        shirtColorField.appendChild(darkSlateGrey);

        const gold = document.createElement('option');
        gold.value = 'gold';
        gold.textContent = 'Gold';
        shirtColorField.appendChild(gold);

        colorOptionsDiv.style.display = ''; //and now we need to unhide the color options menu 
    } else if(shirtDesignField.value === 'heart js') {
        removeColorOptions(); //This funtion removes all the color options from the select element so we can re-add the relevant ones

        //We are now re-creating the option items relevant to the color that was selected 
        const tomato = document.createElement('option');
        tomato.value = 'tomato';
        tomato.textContent = 'Tomato';
        shirtColorField.appendChild(tomato);

        const steelBlue = document.createElement('option');
        steelBlue.value = 'steelblue';
        steelBlue.textContent = 'Steel Blue'; 
        shirtColorField.appendChild(steelBlue);

        const dimGrey = document.createElement('option');
        dimGrey.value = 'dimgrey';
        dimGrey.textContent = 'Dim Grey';
        shirtColorField.appendChild(dimGrey);        

        colorOptionsDiv.style.display = ''; //and now we need to unhide the color options menu 
    } else {
        colorOptionsDiv.style.display = 'none'; //Select theme was selected. We need to hide the color options
    }

});
//When the payment method selected is changed, we need to hide the relevant sections
paymentMethodField.addEventListener('change', () => {
    checkSubmitButton();
    switch(paymentMethodField.value) { //Switch statement to hide the relevent options in the payment methods section
        case 'credit card':
            creditCardDiv.style.display = '';
            paypalDiv.style.display = 'none';
            bitcoinDiv.style.display = 'none';
            break;

        case 'paypal':
            creditCardDiv.style.display = 'none';
            paypalDiv.style.display = '';
            bitcoinDiv.style.display = 'none';
            break;

        case 'bitcoin':
            creditCardDiv.style.display = 'none';
            paypalDiv.style.display = 'none';
            bitcoinDiv.style.display = '';
            break;

        default:
            creditCardDiv.style.display = 'none';
            paypalDiv.style.display = 'none';
            bitcoinDiv.style.display = 'none';
            break;
    }
});

removeColorOptions = () => {
    const colorOptions = document.querySelectorAll('select#color > option'); //Here we are just selecting all the color options
    for (let i = 0; i < colorOptions.length; i++) { //loop over them all
        shirtColorField.removeChild(colorOptions[i]); // and remove them from the dropdown
    }
}

//Lets add event listeners to our checkboxes
for (let i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener('change', e => {handleCheckboxClick(e)} );
}

const handleCheckboxClick = e => {
    calculateActivityTotal(); //Function to calculate the total.
    validateActivities("error");
    checkSubmitButton();
    //Lets get the time and day of the clicked item!
    const dayAndTime = e.target.dataset.dayAndTime;
    const checked = e.target.checked; //this holds a boolean of whether the box is checked or unchecked

    if (dayAndTime) { //We check if dayAndTime is set as there is 1 checkbox that doesn't have a day-and-time attribute 

        for (let i = 0; i < activityCheckboxes.length; i++) { //now let's loop over the checkboxes so we can correct which one's need to be disabled
            
            if (activityCheckboxes[i] != e.target) { //when this if statement is true, we are currently looping over the checkbox that triggered the event. We don't want to touch this one
                
                if (dayAndTime === activityCheckboxes[i].dataset.dayAndTime) { //The checkbox we are currently looking at matches the date and time of the selected checkbox

                    if (checked) { //Now we just need to check if the checkbox we are looking at in the loop needs enabling or disabling
                        activityCheckboxes[i].disabled = 'true';
                    } else {
                        activityCheckboxes[i].disabled = '';
                    }

                }

            }

        }

    }

}

const calculateActivityTotal = () => {
    const costSpan = document.querySelector('span.cost'); //We are getting the span where the cost will be placed
    
    let totalCost = 0;
    for(let i = 0; i < activityCheckboxes.length; i++) { //Let's loop through the items
        if (activityCheckboxes[i].checked) { //If the checkbox we are looking at is checked
            const cost = activityCheckboxes[i].dataset.cost; //Get the cost from it's data attribute
            totalCost = parseInt(totalCost) + parseInt(cost); //Add it's cost to the total
        }
    }
    costSpan.textContent = `Cost: $${totalCost}`; //Now the loop is done, we can set the total on the page
}

//Event Listeners for validation (the event listener for the activity checkboxes are on the handleCheckboxClick function)

nameField.addEventListener("input", () => {validateName("error"); checkSubmitButton()});
emailField.addEventListener("input", () => {validateEmail("error"); checkSubmitButton()});
ccNumField.addEventListener("input", () => {validateCcNum("error"); checkSubmitButton()});
zipCodeField.addEventListener("input", () => {validateZipCode("error"); checkSubmitButton()});
cvvField.addEventListener("input", () => {validateCvvCode("error"); checkSubmitButton()});

//Validation funtions
const validateName = (mode) => {
    const nameEntered = nameField.value;
    const nameRegEx = /^\w{1,100}\s?\w{1,100}?$/;

    if (mode === "test") {
        if (nameRegEx.test(nameEntered)) {
            return true;
        } else {
            return false;
    }
}

    if (mode === "error") {
        if (nameRegEx.test(nameEntered)) {
        //We will undo the failed styling
            nameErrorSpan.textContent = ''
            nameField.style.border = '2px solid rgb(111, 157, 220)';
        } else {
            nameErrorSpan.textContent = 'Please provide your name';
            nameField.style.border = '2px solid red';
        }
    }
}

const validateEmail = (mode) => {
    const emailEntered = emailField.value;    
    const emailRegEx = /^[-a-zA-Z0-9_.]+@[-a-zA-Z0-9_.]+[.][a-zA-Z0-9-]+$/;

    if (mode === "test") {
        if (emailRegEx.test(emailEntered)) {
            return true;
        } else {
            return false;
    }
}

    if (mode === "error") {
        if (emailRegEx.test(emailEntered)) {
        //We will undo the failed styling
            emailField.style.border = '2px solid rgb(111, 157, 220)';
            emailErrorSpan.textContent = '';
        } else {
            if (emailEntered === "") {
                emailErrorSpan.textContent = "Email cannot be blank.";
            } else {
                emailErrorSpan.textContent = "Please provide a valid email address";
            }
            emailField.style.border = '2px solid red';
        }
    }
}

const validateCcNum = (mode) => {
    const ccNumEntered = ccNumField.value;    
    const ccNumRegEx = /^\d{13,16}$/;

    if (mode === "test") {
        if (ccNumRegEx.test(ccNumEntered)) {
            return true;
        } else {
            return false;
        }
    }

    if (mode === "error") {
        if (ccNumRegEx.test(ccNumEntered)) {
        //We will undo the failed styling
            ccNumField.style.border = '2px solid rgb(111, 157, 220)';
        } else {
            ccNumField.style.border = '2px solid red';
        }
    }
}

const validateZipCode = (mode) => {
    const zipCodeEntered = zipCodeField.value;    
    const zipCodeRegEx = /^\d{5}$/;

    if (mode === "test") {
        if (zipCodeRegEx.test(zipCodeEntered)) {
            return true;
        } else {
            return false;
        }
    }

    if (mode === "error") {
        if (zipCodeRegEx.test(zipCodeEntered)) {
        //We will undo the failed styling
            zipCodeField.style.border = '2px solid rgb(111, 157, 220)';
        } else {
            zipCodeField.style.border = '2px solid red';
        }
    }
}

const validateCvvCode = (mode) => {
    const cvvCodeEntered = cvvField.value;    
    const cvvCodeRegEx = /^\d{3}$/;

    if (mode === "test") {
        if (cvvCodeRegEx.test(cvvCodeEntered)) {
            return true;
        } else {
            return false;
        }
    }

    if (mode === "error") {
        if (cvvCodeRegEx.test(cvvCodeEntered)) {
        //We will undo the failed styling
            cvvField.style.border = '2px solid rgb(111, 157, 220)';
        } else {
            cvvField.style.border = '2px solid red';
        }
    }
}

const validateActivities = (mode) => {
    
    let anyTicked = false;
    for(let i = 0; i < activityCheckboxes.length; i++) {
        const currentCheckbox = activityCheckboxes[i];

        if(currentCheckbox.checked) {
            anyTicked = true;
        }
    
    }

    if(mode === "test") {
        return anyTicked;
    }

    if(mode === "error") {
        if(anyTicked) {
            //We need to clear any errors on the checkboxes. As there is multiple of them, I will loop over them
            for(let i = 0; i < activityCheckboxes.length; i++) {
                activityCheckboxes[i].parentElement.style.color = ''; //Lets clear the color on all the checkboxes to show there is no error
            }

        } else {
            //We need to add an error to all the checkboxes
            for(let i = 0; i < activityCheckboxes.length; i++) {
                activityCheckboxes[i].parentElement.style.color = 'red'; //Lets color all the checkboxes red to show they need to be filled in 
            }
        } 
    }
    

}

const checkSubmitButton = () => {
    if(paymentMethodField.value === "credit card") {
        if(validateName("test") && validateEmail("test") && validateActivities("test") && validateCcNum("test") && validateZipCode("test") && validateCvvCode("test")) {
            //All of the fields including the credit card number fields are valid
            submitButton.disabled = '';
        } else {
            submitButton.disabled = 'true';
        }
    } else {
        if(validateName("test") && validateEmail("test") && validateActivities("test")) {
            //All of the fields excluding the credit card number fields are valid
            submitButton.disabled = '';
        } else {
            submitButton.disabled = 'true';
        }
    }
}