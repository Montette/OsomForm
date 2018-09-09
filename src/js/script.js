

  

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
     
            const options = document.querySelector('#citySelect');
            cities.forEach(city => {
                const option = document.createElement('option');
                option.innerHTML = city;
                option.value = city;
                options.appendChild(option)


            })
            
          
        }

        document.addEventListener('DOMContentLoaded', displayCities)
         
    document.querySelector('.form__button').addEventListener('click', ()=> {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
        
    });

    document.querySelector('.modal__button').addEventListener('click', ()=> {
        document.querySelector('.modal__container').classList.remove('modal-visible');
        document.querySelector('.modal').classList.remove('background-visible');
    })
