

  


        //  async function fetchCities () {

        //    async function asyncAction () {

        //     let cities = [];
        //     requestOffsets .forEach(el=> {

        //         let url = `https://wft-geo-db.p.mashape.com/v1/geo/countries/PL/regions/LD/cities?minPopulation=2025&offset=${el}&limit=10`;

        //         let headers = new Headers();

        //         headers.append("X-Mashape-Key", "jGFiACuqUmmshdbzTerBFXkUMmLFp1eSONIjsnrzszoIv8eyuw");

        //         let request = new Request(url, {
        //             headers: headers
        //         });

                
        //         fetch(request)
        //         .then(resp => {
        //         return resp.json()
                    
        //         })
        //         .then(response=> {
        //             cities = cities.concat(response.data)
        //             console.log(cities)
        //         })

                

        //     })

        //     return cities

        // }


        //     const data = await asyncAction();
        //     console.log(data)


        // }

        // fetchCities()

        function sortAlphabetically (a,b) {
            if (a.city < b.city)
                return -1;
            if (a.city > b.city)
                return 1;
            return 0;
        };


        function displayCities(cities) {
            cities.sort(sortAlphabetically);
            console.log(cities);
            const options = document.querySelector('#city-select');
            cities.forEach(city => {
                const option = document.createElement('option');
                option.innerHTML = city.city;
                option.value = city.city
                options.appendChild(option)


            })
            
            console.log(cities)
        }


  function fetchForCities () {

        let cities = [];

        const requestOffsets = [1,11,21,31,41,51];
  
            Promise.all(
                requestOffsets.map(offset => 
                fetch(   `https://wft-geo-db.p.mashape.com/v1/geo/countries/PL/regions/LD/cities?minPopulation=2025&offset=${offset}&limit=10`, {
                    headers: new Headers({
                        "X-Mashape-Key": "jGFiACuqUmmshdbzTerBFXkUMmLFp1eSONIjsnrzszoIv8eyuw"
                    })  
                })
                .then(response => response.json())
                .then(responseData => {
                  console.log(responseData);
                  cities = cities.concat(responseData.data);
                  return cities  
                })
                .catch(err => /* handle errors here */ console.error(err))
              )
            )
            .then(()=> displayCities(cities))


        }







            document.addEventListener('DOMContentLoaded', fetchForCities)
     
         
    