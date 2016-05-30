/*
* Form Validation functions
*/

/* validate numeric inputs */
function inputNumericVal(inputValue) {
    if (Number.isInteger(inputValue) === true) {
        if (inputValue !== 0) {
            return {value: inputValue, state: true};
        } else {
            return {value: inputValue, state: false};
        }
    } else {
        var isnum = /^[0-9]+$/.test((inputValue).trim());
        if(isnum === true) {
            inputValue = parseInt((inputValue).trim());
            if (inputValue !== 0) {
                return {value: inputValue, state: true};
            } else {
                return {value: inputValue, state: false};
            }
        } else {
            return {value: inputValue, state: false};
        }
    }
}
