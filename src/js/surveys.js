(function () {

    let elementToRemove;

    const removeRow = (element) => {
        element.remove();
    }

    const removeUser = () => {
        let id = elementToRemove.textContent; //get if of removing user
        let element = elementToRemove.parentElement.parentElement; // and find it's parent row
        fetch(`https://osomform.firebaseio.com/users/${id}.json`, {
            method: 'delete' 
        }).then(response =>
            response.json()
            .then(json => {
                removeRow(element) //after deleting user from database, remove it also from HTML
            })
        );
    }

    showModalToRemove = (element) => {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
    }

    const addListenersToButtons = () => { // add listener to each removing button
        document.querySelectorAll('.table__remove-button').forEach(button => {
            button.addEventListener('click', (event) => {
                elementToRemove = event.currentTarget.parentElement.querySelector('span'); //after click, set element which will be removing and show modal with removing confirmation
                showModalToRemove();
            })
        })
    }

    const displayUsers = (data) => {
        const tableBody = document.querySelector('tbody');
        if (!data) return; // stop if we don't have any user yet, don't iterate on empty object
        let usersArray = Object.keys(data).map((key) => { // change object of objects into array of objects
            let item = data[key];
            item.id = key;
            return item
        });

        const source = document.getElementById('usersTemplate').innerHTML, //create handlebars template
            template = Handlebars.compile(source);
        let context, content = '';

        usersArray.forEach((user) => {
            context = {
                firstName: user.firstName,
                lastName: user.lastName,
                login: user.login,
                city: user.city,
                email: user.email,
                id: user.id
            }
            content += template(context); //add user data to template after each iteration on users list
        })
        tableBody.insertAdjacentHTML('beforeend', content); //in the end inject data into table in HTML doc.
        addListenersToButtons()
    }


    const fetchForUsers = () => {
        const url = 'https://osomform.firebaseio.com/users.json';
        fetch(url)
            .then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw new Error(err => {
                        console.log(err)
                    })
                }
            })
            .then(resp => {
                displayUsers(resp)
            })
            .catch(err => console.log(err))
    }

    const closeModal = () => {
        document.querySelector('.modal__container').classList.remove('modal-visible');
        document.querySelector('.modal').classList.remove('background-visible');
    }

    document.querySelector('.modal__footer--surveys').addEventListener('click', (event) => {
        if (event.target.id === 'cancelDeletingButton') { // add listeners do modal buttons
            closeModal()
        } else if (event.target.id === 'confirmDeletingButton') {
            removeUser(event); 
            closeModal()
        }
    })

    document.addEventListener('DOMContentLoaded', fetchForUsers)

})()