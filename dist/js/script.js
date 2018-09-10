'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

    var stringPattern = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+(?:[\s-][a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+)*$/i,
        mailPattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/i,
        requiredInputs = document.querySelectorAll('[required]');

    function sortAlphabetically(a, b) {
        if (a.city < b.city) return -1;
        if (a.city > b.city) return 1;
        return 0;
    };

    function displayCities(cities) {
        cities.sort(sortAlphabetically);
        var options = document.querySelector('#city');
        cities.forEach(function (city) {
            // create options fo each fetched city
            var option = document.createElement('option');
            option.innerHTML = city.city;
            option.value = city.city;
            options.appendChild(option);
        });
    }

    function fetchForCities() {
        var cities = [];
        var requestOffsets = [1, 11, 21, 31, 41, 51];
        Promise.all(requestOffsets.map(function (offset) {
            return (//due to API restrictions response can return max 10 results, so I has to makse 6 calls to get all cities
                fetch('https://wft-geo-db.p.mashape.com/v1/geo/countries/PL/regions/LD/cities?minPopulation=2025&offset=' + offset + '&limit=10', {
                    headers: new Headers({
                        "X-Mashape-Key": "jGFiACuqUmmshdbzTerBFXkUMmLFp1eSONIjsnrzszoIv8eyuw"
                    })
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(function (err) {
                            console.log(err);
                        });
                    }
                }).then(function (responseData) {
                    cities = cities.concat(responseData.data);
                    return cities; //with every iteration add new cities to cities array
                }).catch(function (err) {
                    return console.log(err);
                })
            );
        })).then(function () {
            return displayCities(cities);
        });
    }

    var showConfirmationModal = function showConfirmationModal(information) {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
        document.querySelector('.modal__information').innerHTML = information;
    };

    var formToJSON = function formToJSON(elements) {
        return [].concat(_toConsumableArray(elements)).reduce(function (obj, element) {
            //transform nodeList of form inputs into array and then into JSOn format
            if (element.name) {
                obj[element.name] = element.value;
            }
            return obj;
        }, {});
    };

    var sendData = function sendData() {
        var successInfo = 'Dane zostały zapisane pomyślnie. Na podany adres e-mail wysłaliśmy potwierdzenie rejestracji';
        var failInfo = 'Wystąpił błąd z połączeniem. Spróbuj ponownie później.';
        var url = 'https://osomform.firebaseio.com/users.json';
        var form = document.querySelector('.form');
        var data = null; // reset sending data before every new request
        data = formToJSON(form.elements);
        fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(data)
        }).then(function (res) {
            return res.json();
        }).then(function (res) {
            showConfirmationModal(successInfo); // if data will be send succesfully, show modal with confirmation
        }).catch(function (err) {
            console.log(err);
            showConfirmationModal(failInfo); // if something went wrong show modal with this info  
        });
    };

    var showFieldValidation = function showFieldValidation(input, inputIsValid) {
        //show red warning text if input is fill uncorrectly
        if (inputIsValid == false) {
            input.classList.add('warning-input');
            if (input.nextElementSibling !== null) {
                input.nextElementSibling.classList.add('visible-warning');
            }
        } else {
            input.classList.remove('warning-input'); //if input is ok, remove warning
            if (input.nextElementSibling !== null) {
                input.nextElementSibling.classList.remove('visible-warning');
            }
        }
    };

    var validateInput = function validateInput(input, reg) {
        var inputIsValid = true;
        if (reg !== undefined) {
            // if we have regex to check, check if value match to it 
            if (!reg.test(input.value) || input.value === '') {
                inputIsValid = false;
            }
        } else {
            // but if we don't have a regex check only if input isn't empty
            if (input.value === '') {
                inputIsValid = false;
            }
        }

        if (inputIsValid) {
            showFieldValidation(input, true); // if input isn't valid run func. showing warning
            return true;
        } else {
            showFieldValidation(input, false);
            return false;
        }
    };

    var saveToLocalStorage = function saveToLocalStorage(input) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(input.name, input.value);
        } else {
            return;
        }
    };

    var loadFromLocalStorage = function loadFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            [].concat(_toConsumableArray(requiredInputs)).forEach(function (input) {
                input.value = localStorage.getItem(input.name);
            });
        } else {
            return;
        }
    };

    var validateForm = function validateForm() {
        [].concat(_toConsumableArray(requiredInputs)).forEach(function (input) {
            // add listeners to all required inputs, to tunr on validation checking during filling it by user
            if (input.nodeName.toLowerCase() === 'input') {
                input.addEventListener('change', function () {
                    saveToLocalStorage(event.target);
                });
                if (input.type == 'text' && input.name !== 'login') {
                    input.addEventListener('input', function (event) {
                        validateInput(event.target, stringPattern); // validate with regex
                    });
                }
                if (input.name == 'login') {
                    input.addEventListener('change', function (event) {
                        validateInput(event.target, undefined); // or without regex
                    });
                }
                if (input.type == 'email') {
                    input.addEventListener('input', function (event) {
                        validateInput(event.target, mailPattern);
                    });
                }
            }
        });
    };

    var checkFormBeforeSending = function checkFormBeforeSending(event) {
        // check form once again before sending data to server
        event.preventDefault();
        var formIsCorrect = true;
        [].concat(_toConsumableArray(requiredInputs)).forEach(function (input) {
            if (input.nodeName.toLowerCase() === 'input') {
                var inputType = input.type.toLowerCase();
                var inputName = input.name;
                if (inputType == 'text' && inputName !== 'login' && validateInput(input, stringPattern) == false) {
                    formIsCorrect = false;
                }
                if (inputType == 'email' && validateInput(input, mailPattern) == false) {
                    formIsCorrect = false;
                }
                if (inputType == 'checkbox' && !input.checked) {
                    formIsCorrect = false; // apart of inputs values, check also if checkbox is checked
                }
            }
        });
        if (formIsCorrect) {
            sendData();
        } else {
            return false;
        }
    };

    document.querySelector('.modal__button').addEventListener('click', function () {
        document.querySelector('.modal__container').classList.remove('modal-visible');
        document.querySelector('.modal').classList.remove('background-visible');
    });

    document.querySelector('.form').addEventListener('submit', function (event) {
        checkFormBeforeSending(event);
    });

    document.addEventListener('DOMContentLoaded', function () {
        // after DOM is loaded, fetch for cities, start to validating form and load data from local storage
        fetchForCities();
        validateForm();
        loadFromLocalStorage();
    });
})();