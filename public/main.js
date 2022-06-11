const socket = io();

let inputMsgSend = document.querySelector('.input-group > input');
let buttonInputMsgSend = document.querySelector('.input-group > button');
let loginNameInput = document.querySelector('#loginNameInput');
let loginArea = document.querySelector('#loginArea');
let chatArea = document.querySelector('#chatArea');
let user = {};
let userList = [];

loginArea.style.display = 'flex';
chatArea.style.display = 'none';

function renderList(){
    let usersOnline = document.querySelector('.card .border-right');
    usersOnline.innerHTML = '';
    usersOnline.innerHTML += `
        <div class="px-4 d-none d-md-block">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <input type="text" class="form-control my-3" placeholder="Pesquisar usuário...">
                </div>
            </div>
        </div>`;
    userList.forEach(user => {
        usersOnline.innerHTML += `
            <a href="#" class="list-group-item list-group-item-action border-0">
                <div class="d-flex align-items-start">
                    <img src="${user.avatar}" class="rounded-circle mr-1" alt="${user.name}" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                        ${user.name}
                    <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
                    </div>
                </div>
            </a>`;
    });
    usersOnline.innerHTML += `<hr class="d-block d-lg-none mt-1 mb-0">`;
}

loginNameInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let name = loginNameInput.value.trim();
        if(name != '') {
            user = {
                name: name,
                avatar: `./media/avatar${Math.floor(Math.random() * 11)}.jpg`
            };
            document.title = 'Chat ('+user.name+')';
            socket.emit('join-request', user);
        }
    }
});

socket.on('user-ok', (connectedUsers) => {
    loginArea.style.display = 'none';
    chatArea.style.display = 'block';
    inputMsgSend.focus();

    userList = connectedUsers;
    renderList();
});