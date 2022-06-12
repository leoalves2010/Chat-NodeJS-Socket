const socket = io();

let inputMsgSend = document.querySelector('.input-group > input');
let buttonInputMsgSend = document.querySelector('.input-group > button');
let loginNameInput = document.querySelector('#loginNameInput');
let loginArea = document.querySelector('#loginArea');
let chatArea = document.querySelector('#chatArea');
let infoUserAvatar = document.querySelector('.infoUserAvatar img');
let infoUserName = document.querySelector('.infoUserName');
let userObj = {};
let userList = [];

loginArea.style.display = 'flex';
chatArea.style.display = 'none';

function addMessage(type, user, msg) {
    let chatMsgArea = document.querySelector('.chat-messages');

    switch (type) {
        case 'status':
            chatMsgArea.innerHTML += `
                <div class="chat-message-right pb-4 text-danger">
                    <div>
                        <img src="./media/avatarRobot.png" class="rounded-circle mr-1" alt="Mensagem do Sistema" width="40" height="40">
                        <div class="text-muted small text-nowrap mt-2">2:33 am</div>
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3 font-italic">
                        <div class="font-weight-bold mb-1 font-italic">Mensagem do Sistema</div>
                        ${user} ${msg}
                    </div>
                </div>`
        break;
        case 'msg':
            if(userObj.name == user.name){
                chatMsgArea.innerHTML += `
                <div class="chat-message-left pb-4">
                    <div>
                        <img src="${user.avatar}" class="rounded-circle mr-1" alt="${user.name}" width="40" height="40">
                        <div class="text-muted small text-nowrap mt-2">2:33 am</div>
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                        <div class="font-weight-bold mb-1">${user.name} (você)</div>
                        ${user.msg}
                    </div>
                </div>`
            }else{
                chatMsgArea.innerHTML += `
                <div class="chat-message-right pb-4">
                    <div>
                        <img src="${user.avatar}" class="rounded-circle mr-1" alt="${user.name}" width="40" height="40">
                        <div class="text-muted small text-nowrap mt-2">2:33 am</div>
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                        <div class="font-weight-bold mb-1">${user.name}</div>
                        ${user.msg}
                    </div>
                </div>`
            }
        break;
    }
}

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
                        ${user.name} ${(userObj.name == user.name) ? '(você)' : ''}
                    <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
                    </div>
                </div>
            </a>`;
        if(userObj.name == user.name){
            infoUserName.querySelector('strong').innerHTML = user.name;
            infoUserAvatar.src = user.avatar;
        }
    });
    usersOnline.innerHTML += `<hr class="d-block d-lg-none mt-1 mb-0">`;
}

loginNameInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let name = loginNameInput.value.trim();
        if(name != '') {
            userObj = {
                name: name,
                avatar: `./media/avatar${Math.floor(Math.random() * 11)}.jpg`
            };
            document.title = 'Chat ('+userObj.name+')';
            socket.emit('join-request', userObj);
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

socket.on('list-update', (data) => {
    if(data.joined){
        addMessage('status', data.joined, 'entrou agora no chat');
    }

    if(data.leave){
        addMessage('status', data.leave, 'saiu do chat');
    }

    userList = data.list;
    renderList();
});

socket.on('show-msg', (userObj) => {
    addMessage('msg', userObj, userObj.msg);
})

inputMsgSend.addEventListener('keyup', (event) => {
    setTimeout(() => {
        infoUserName.querySelector('div').innerHTML = "<em>Online...</em>";
    }, 1000);
    infoUserName.querySelector('div').innerHTML = "<em style='color: #00c21c; font-weight: bold'>Digitando...</em>";
    if(event.keyCode === 13) {
        let msg = inputMsgSend.value.trim();
        inputMsgSend.value = '';
        
        if(msg != '') {
            socket.emit('send-msg', {
                msg: msg,
                name: userObj.name,
                avatar: userObj.avatar
            });
        }
    }
});

buttonInputMsgSend.addEventListener('click', () => {
    let msg = inputMsgSend.value.trim();
        inputMsgSend.value = '';
        
    if(msg != '') {
        socket.emit('send-msg', {
            msg: msg,
            name: userObj.name,
            avatar: userObj.avatar
        });
    }
})