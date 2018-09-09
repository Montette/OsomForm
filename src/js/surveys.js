(function () {

    let elementToRemove;

    const removeRow = (element) => {
        element.remove();
    }

    const removeUser = () => {
        let id = elementToRemove.textContent;
        let element = elementToRemove.parentElement.parentElement;
        fetch(`https://osomform.firebaseio.com/users/${id}.json`, {
            method: 'delete'
        }).then(response =>
            response.json()
            .then(json => {
                removeRow(element)
            })
        );
    }

    showModalToRemove = (element) => {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
    }

    const addListenersToButtons = () => {
        document.querySelectorAll('.table__remove-button').forEach(button => {
            button.addEventListener('click', (event) => {
                elementToRemove = event.currentTarget.parentElement.querySelector('span');
                showModalToRemove();
            })
        })
    }

    const displayUsers = (data) => {
        const tableBody = document.querySelector('tbody');
        if (!data) return;
        let usersArray = Object.keys(data).map((key) => {
            let item = data[key];
            item.id = key;
            return item
        });

        const source = document.getElementById('usersTemplate').innerHTML,
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
            content += template(context);
        })
        tableBody.insertAdjacentHTML('beforeend', content);
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
        if (event.target.id === 'cancelDeletingButton') {
            closeModal()
        } else if (event.target.id === 'confirmDeletingButton') {
            removeUser(event);
            closeModal()
        }
    })

    document.addEventListener('DOMContentLoaded', fetchForUsers)

})()