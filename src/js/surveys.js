if(document.body.getAttribute('data-page') ==='surveys') {(function () {

    
    let elementToRemove;

    const removeRow = (element) => {
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }
        element.remove();
    }

    const removeUser = () => {
        let id = elementToRemove.textContent; //get if of removing user
        let element = elementToRemove.parentElement.parentElement; // and find it's parent row
        fetch(`https://osomform.firebaseio.com/users/${id}.json`, {
            method: 'delete' 
        }).then(response => {
                if(response.ok) {
                    response.json()
                }else {
                    throw new Error(err => console.log(error))
                }
            }
        ).then(json => {
            removeRow(element) //after deleting user from database, remove it also from HTML
        })
        .catch(err => {
            const errorMessage = 'There is a connection error. User cannot be removed in this moment. Please try again later.';
            console.log(err);
            showModal(errorMessage, true);
        })
    }

    const showModal= (message, isError) => {
        // let text = message ==='undefined' ? 'Are you sure you want to remove this user?': message;

        if (isError) {
            document.querySelector('#confirmDeletingButton').style.display ='none';
        } else {
            document.querySelector('#confirmDeletingButton').style.display ='inline';
        }
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
        document.querySelector('.modal__text').innerHTML = message;

    }

    const addListenersToButtons = () => { // add listener to each removing button
        const buttons = document.querySelectorAll('.table__remove-button');
        [...buttons].forEach(button => {
            button.addEventListener('click', (event) => {
                const message = 'Are you sure you want to remove this user?';
                elementToRemove = event.currentTarget.parentElement.querySelector('span'); //after click, set element which will be removing and show modal with removing confirmation
                showModal(message, false);
            })
        })
    }

    const displayUsers = (data) => {
        const warningInfo = document.querySelector('.warning-info');
        if(warningInfo) warningInfo.remove(); //remove info about warning if it is
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

    const showInfoWithWarning = () => {
        const warning = document.createElement('p');
        warning.innerHTML = "There is a connection error, unable to load data.";
        warning.classList.add('warning-info');
        document.querySelector('.table-container').appendChild(warning);
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
            .catch(err => {
                console.log(err);
                showInfoWithWarning();//in spite of error, show display this info
            } )
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
}