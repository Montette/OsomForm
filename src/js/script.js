

if(document.body.getAttribute('data-page') ==='form') {(function () {
   

    const stringPattern = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+(?:[\s-][a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+)*$/i,
        mailPattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/i,
        requiredInputs = document.querySelectorAll('[required]');

    const sortAlphabetically = (a, b) => {
        if (a.city < b.city)
            return -1;
        if (a.city > b.city)
            return 1;
        return 0;
    };

    const displayCities = (cities) => {
        cities.sort(sortAlphabetically);
        const options = document.querySelector('#city');
        cities.forEach(city => { // create options fo each fetched city
            const option = document.createElement('option');
            option.innerHTML = city.city;
            option.value = city.city
            options.appendChild(option)
        })
    }

    const fetchForCities = () => {
        let cities = [];
        const requestOffsets = [1, 11, 21, 31, 41, 51];
        Promise.all(
                requestOffsets.map(offset => //due to API restrictions response can return max 10 results, so I has to makse 6 calls to get all cities
                    fetch(`https://wft-geo-db.p.mashape.com/v1/geo/countries/PL/regions/LD/cities?minPopulation=2025&offset=${offset}&limit=10`, {
                        headers: new Headers({
                            "X-Mashape-Key": "jGFiACuqUmmshdbzTerBFXkUMmLFp1eSONIjsnrzszoIv8eyuw"
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json()
                        } else {
                            throw new Error(err => {
                                console.log(err)
                            })
                        }                
                    })
                    .then(responseData => {
                        cities = cities.concat(responseData.data);
                        return cities //with every iteration add new cities to cities array
                    })
                    .catch(err => console.log(err))
                )
            )
            .then(() => displayCities(cities))
    }

    const showConfirmationModal = (information) => {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
        document.querySelector('.modal__information').innerHTML = information;

    }

    const formToJSON = elements => [...elements].reduce((obj, element) => {//transform nodeList of form inputs into array and then into JSOn format
        if (element.name) { 
            obj[element.name] = element.value;
        }
        return obj;

    }, {});

    const sendData = () => {
        const successInfo = 'Dane zostały zapisane pomyślnie. Na podany adres e-mail wysłaliśmy potwierdzenie rejestracji';
        const failInfo = 'Wystąpił błąd z połączeniem. Spróbuj ponownie później.';
        const url = 'https://osomform.firebaseio.com/users.json';
        const form = document.querySelector('.form');
        let data = null; // reset sending data before every new request
        data = formToJSON(form.elements);
        fetch(url, {
                method: 'post',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                showConfirmationModal(successInfo); // if data will be send succesfully, show modal with confirmation
            })
            .catch(err => {
                console.log(err);
                showConfirmationModal(failInfo) // if something went wrong show modal with this info  
            })
    }

    const showFieldValidation = (input, inputIsValid) => { //show red warning text if input is fill uncorrectly
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
    }

    const validateInput = (input, reg) => {
        let inputIsValid = true;
        if (reg !== undefined) { // if we have regex to check, check if value match to it 
            if (!reg.test(input.value) || input.value === '') {
                inputIsValid = false;
            }
        } else { // but if we don't have a regex check only if input isn't empty
            if (input.value === '') {
                inputIsValid = false;
            }
        }

        if (inputIsValid) {
            showFieldValidation(input, true);// if input isn't valid run func. showing warning
            return true;
        } else {
            showFieldValidation(input, false);
            return false;
        }
    }

    const saveToLocalStorage = (input) => {
        if(typeof localStorage !== 'undefined') {
        localStorage.setItem(input.name, input.value);
        } else {
            return
        }
    }

    const loadFromLocalStorage = () => {
        if (typeof localStorage !== 'undefined') {
            [...requiredInputs].forEach(input => {
                input.value = localStorage.getItem(input.name);
            })
        } else {
            return
    }
    }

    const validateForm = () => {
        [...requiredInputs].forEach(input => { // add listeners to all required inputs, to tunr on validation checking during filling it by user
            if (input.nodeName.toLowerCase() === 'input') {
                input.addEventListener('change', () => {
                    saveToLocalStorage(event.target);
                })
                if (input.type == 'text' && input.name !== 'login') {
                    input.addEventListener('input', (event) => {
                        validateInput(event.target, stringPattern); // validate with regex
                    })
                }
                if (input.name == 'login') {
                    input.addEventListener('change', (event) => {
                        validateInput(event.target, undefined); // or without regex
                    })
                }
                if (input.type == 'email') {
                    input.addEventListener('input', (event) => {
                        validateInput(event.target, mailPattern)
                    })
                }
            }
        })
    }

    const checkFormBeforeSending = (event) => { // check form once again before sending data to server
        event.preventDefault();
        let formIsCorrect = true;
        [...requiredInputs].forEach(input => {
            if (input.nodeName.toLowerCase() === 'input') {
                const inputType = input.type.toLowerCase();
                const inputName = input.name;
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
        })
        if (formIsCorrect) {
            sendData();
        } else {
            return false;
        }
    }

    document.querySelector('.modal__button').addEventListener('click', () => {
        document.querySelector('.modal__container').classList.remove('modal-visible');
        document.querySelector('.modal').classList.remove('background-visible');
    })

    document.querySelector('.form').addEventListener('submit', (event) => {
        checkFormBeforeSending(event);
    })

    document.addEventListener('DOMContentLoaded', () => { // after DOM is loaded, fetch for cities, start to validating form and load data from local storage
        fetchForCities();
        validateForm();
        loadFromLocalStorage()
    })

})()
}