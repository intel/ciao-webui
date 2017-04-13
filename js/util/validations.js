/* Copyright (c) 2017 Intel Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
