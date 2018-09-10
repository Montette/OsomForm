'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

    var elementToRemove = void 0;

    var removeRow = function removeRow(element) {
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function () {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }
        element.remove();
    };

    var removeUser = function removeUser() {
        var id = elementToRemove.textContent; //get if of removing user
        var element = elementToRemove.parentElement.parentElement; // and find it's parent row
        fetch('https://osomform.firebaseio.com/users/' + id + '.json', {
            method: 'delete'
        }).then(function (response) {
            return response.json().then(function (json) {
                removeRow(element); //after deleting user from database, remove it also from HTML
            });
        });
    };

    var showModalToRemove = function showModalToRemove(element) {
        document.querySelector('.modal__container').classList.add('modal-visible');
        document.querySelector('.modal').classList.add('background-visible');
    };

    var addListenersToButtons = function addListenersToButtons() {
        // add listener to each removing button
        var buttons = document.querySelectorAll('.table__remove-button');
        [].concat(_toConsumableArray(buttons)).forEach(function (button) {
            button.addEventListener('click', function (event) {
                elementToRemove = event.currentTarget.parentElement.querySelector('span'); //after click, set element which will be removing and show modal with removing confirmation
                showModalToRemove();
            });
        });
    };

    var displayUsers = function displayUsers(data) {
        var warningInfo = document.querySelector('.warning-info');
        if (warningInfo) warningInfo.remove(); //remove info about warning if it is
        var tableBody = document.querySelector('tbody');
        if (!data) return; // stop if we don't have any user yet, don't iterate on empty object
        var usersArray = Object.keys(data).map(function (key) {
            // change object of objects into array of objects
            var item = data[key];
            item.id = key;
            return item;
        });

        var source = document.getElementById('usersTemplate').innerHTML,
            //create handlebars template
        template = Handlebars.compile(source);
        var context = void 0,
            content = '';
        usersArray.forEach(function (user) {
            context = {
                firstName: user.firstName,
                lastName: user.lastName,
                login: user.login,
                city: user.city,
                email: user.email,
                id: user.id
            };
            content += template(context); //add user data to template after each iteration on users list
        });
        tableBody.insertAdjacentHTML('beforeend', content); //in the end inject data into table in HTML doc.
        addListenersToButtons();
    };

    var showInfoWithWarning = function showInfoWithWarning() {
        var warning = document.createElement('p');
        warning.innerHTML = "There is a connection error, unable to load data.";
        warning.classList.add('warning-info');
        document.querySelector('.table-container').appendChild(warning);
    };

    var fetchForUsers = function fetchForUsers() {
        var url = 'https://osomform.firebaseio.com/users.json';
        fetch(url).then(function (resp) {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error(function (err) {
                    console.log(err);
                });
            }
        }).then(function (resp) {
            displayUsers(resp);
        }).catch(function (err) {
            console.log(err);
            showInfoWithWarning(); //in spite of error, show display this info
        });
    };

    var closeModal = function closeModal() {
        document.querySelector('.modal__container').classList.remove('modal-visible');
        document.querySelector('.modal').classList.remove('background-visible');
    };

    document.querySelector('.modal__footer--surveys').addEventListener('click', function (event) {
        if (event.target.id === 'cancelDeletingButton') {
            // add listeners do modal buttons
            closeModal();
        } else if (event.target.id === 'confirmDeletingButton') {
            removeUser(event);
            closeModal();
        }
    });

    document.addEventListener('DOMContentLoaded', fetchForUsers);
})();