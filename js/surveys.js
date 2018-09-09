let elementToRemove;const removeRow=(a)=>{a.remove()},removeUser=()=>{let a=elementToRemove.textContent,b=elementToRemove.parentElement.parentElement;fetch(`https://osomform.firebaseio.com/users/${a}.json`,{method:'delete'}).then((a)=>a.json().then(()=>{console.log('delete'),removeRow(b)}))};showModalToRemove=()=>{document.querySelector('.modal__container').classList.add('modal-visible'),document.querySelector('.modal').classList.add('background-visible')};const addListenersToButtons=()=>{document.querySelectorAll('.table__remove-button').forEach((a)=>{a.addEventListener('click',(a)=>{elementToRemove=a.currentTarget.parentElement.querySelector('span'),showModalToRemove()})})},displayUsers=(a)=>{console.log(a);const b=document.querySelector('tbody');if(a){let c=Object.keys(a).map((b)=>{let c=a[b];return c.id=b,c});console.log(c),c.forEach((a)=>{const c=`
        <tr>
            <td>${a.firstName}</td>
            <td>${a.lastName}</td>
            <td>${a.login}</td>
            <td>${a.city}</td>
            <td>${a.email}</td>
            <td class="table__idtd"><span>${a.id}</span>
            <div role="button" class="table__remove-button"><img class="modal__icon" src="images/trash.svg" alt=""></div>
            </td>
        </tr>`;b.insertAdjacentHTML('beforeend',c),addListenersToButtons()})}},fetchForUsers=()=>{fetch('https://osomform.firebaseio.com/users.json').then((a)=>{if(a.ok)return a.json();throw new Error((a)=>{console.log(a)})}).then((a)=>{console.log(a),displayUsers(a)})},closeModal=()=>{document.querySelector('.modal__container').classList.remove('modal-visible'),document.querySelector('.modal').classList.remove('background-visible')};document.querySelector('.modal__footer--surveys').addEventListener('click',(a)=>{'cancelDeletingButton'===a.target.id?closeModal():'confirmDeletingButton'===a.target.id&&(removeUser(a),closeModal())}),document.addEventListener('DOMContentLoaded',fetchForUsers);