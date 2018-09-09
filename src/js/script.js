//         function sortAlphabetically (a,b) {
//             if (a.city < b.city)
//                 return -1;
//             if (a.city > b.city)
//                 return 1;
//             return 0;
//         };


//         function displayCities(cities) {
//             cities.sort(sortAlphabetically);
//             console.log(cities);
//             const options = document.querySelector('#city-select');
//             cities.forEach(city => {
//                 const option = document.createElement('option');
//                 option.innerHTML = city.city;
//                 option.value = city.city
//                 options.appendChild(option)


//             })

//             console.log(cities);
//             console.log(testCities);
//         }


//   function fetchForCities () {

//         let cities = [];

//         const requestOffsets = [1,11,21,31,41,51];

//             Promise.all(
//                 requestOffsets.map(offset => 
//                 fetch(   `https://wft-geo-db.p.mashape.com/v1/geo/countries/PL/regions/LD/cities?minPopulation=2025&offset=${offset}&limit=10`, {
//                     headers: new Headers({
//                         "X-Mashape-Key": "jGFiACuqUmmshdbzTerBFXkUMmLFp1eSONIjsnrzszoIv8eyuw"
//                     })  
//                 })
//                 .then(response => response.json())
//                 .then(responseData => {
//                   console.log(responseData);
//                   cities = cities.concat(responseData.data);
//                   return cities  
//                 })
//                 .catch(err => /* handle errors here */ console.error(err))
//               )
//             )
//             .then(()=> displayCities(cities))


//         }


//             document.addEventListener('DOMContentLoaded', fetchForCities);




function displayCities() {


    const cities = ["Andrespol", "Bełchatów", "Biała Rawska", "Brzeziny", "Błaszki", "Drzewica", "Działoszyn", "Gorzkowice", "Głowno", "Głuchów", "Kamieńsk", "Koluszki", "Konstantynów Łódzki", "Krośniewice", "Ksawerów", "Kutno", "Moszczenica", "Opoczno", "Ozorków", "Pabianice", "Pajęczno", "Piotrków Trybunalski", "Piątek", "Poddębice", "Przedbórz", "Pęczniew", "Radomsko", "Rawa Mazowiecka", "Rzeczyca", "Rzgów", "Sadkowice", "Sieradz", "Skierniewice", "Stryków", "Sulejów", "Szczerców", "Tomaszów Mazowiecki", "Tuszyn", "Uniejów", "Warta", "Wieluń", "Wieruszów", "Wola Krzysztoporska", "Wolbórz", "Zduńska Wola", "Zelów", "Zgierz", "Złoczew", "Łask", "Łowicz", "Łódź", "Łęczyca", "Żychlin"];

    const options = document.querySelector('#city');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.innerHTML = city;
        option.value = city;
        options.appendChild(option)


    })


}


const stringPattern = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+(?:[\s-][a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+)*$/i;

const mailPattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/i;

const requiredInputs = document.querySelectorAll('[required]');



const sendData = () => {

}

const showConfirmationModal = () => {


    document.querySelector('.modal__container').classList.add('modal-visible');
    document.querySelector('.modal').classList.add('background-visible');


}


const showFieldValidation = (input, inputIsValid) => {
    if (inputIsValid == false) {
        input.classList.add('warning-input');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.add('visible-warning');
        }
    } else {
        input.classList.remove('warning-input');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.remove('visible-warning');
        }
    }
}


const validateInput = (input, reg) => {
    let inputIsValid = true;
    if (reg !== undefined) {
        if (!reg.test(input.value) || input.value === '') {
            inputIsValid = false;
        }
    } else {
        if (input.value === '') {
            inputIsValid = false;
        }
    }

    if (inputIsValid) {
        showFieldValidation(input, true);
        return true;
    } else {
        showFieldValidation(input, false);
        return false;
    }
}

const saveToLocalStorage = (input) => {
    localStorage.setItem(input.name, input.value);
}

const loadFromLocalStorage = () => {
    [...requiredInputs].forEach(input => {
        input.value = localStorage.getItem(input.name);
    })
}


const validateForm = () => {
    [...requiredInputs].forEach(input => {
        if (input.nodeName.toLowerCase() === 'input') {

            input.addEventListener('input', () => {
                saveToLocalStorage(event.target);
            })
            if (input.type == 'text' && input.name !== 'login') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, stringPattern);
                })
            }
            if (input.name == 'login') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, undefined);
                })
            }
            if (input.type == 'email') {
                input.addEventListener('blur', (event) => {
                    validateInput(event.target, mailPattern)
                })
            }
        }
    })
}


const checkFormBeforeSending = (event) => {
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
                formIsCorrect = false;
            }

        }
    })
    if (formIsCorrect) {
        sendData();
        // showConfirmationModal();

    } else {
        return false;

    }
}


document.querySelector('.modal__button').addEventListener('click', () => {
    document.querySelector('.modal__container').classList.remove('modal-visible');
    document.querySelector('.modal').classList.remove('background-visible');
})



document.addEventListener('DOMContentLoaded', () => {

    displayCities();
    validateForm();
    loadFromLocalStorage()
})

document.querySelector('.form').addEventListener('submit', (event) => {
    checkFormBeforeSending(event);
})