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
            console.log('delete');
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
    console.log(data);
    const tableBody = document.querySelector('tbody');
    if (!data) return;
    let usersArray = Object.keys(data).map((key) => {
        let item = data[key];
        item.id = key;
        return item
    });

    console.log(usersArray);
    usersArray.forEach((user) => {
        const row = `
        <tr>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.login}</td>
            <td>${user.city}</td>
            <td>${user.email}</td>
            <td class="table__idtd"><span>${user.id}</span>
            <div role="button" class="table__remove-button"><img class="modal__icon" src="images/trash.svg" alt=""></div>
            </td>
        </tr>`
        tableBody.insertAdjacentHTML('beforeend', row);
        addListenersToButtons()
    })

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
            console.log(resp);
            displayUsers(resp)
        })

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