const socket = io();
let username = '';

let usersOnline = document.querySelector('.card .border-right');
let inputMsgSend = document.querySelector('.input-group > input');
let buttonInputMsgSend = document.querySelector('.input-group > button');
let loginNameInput = document.querySelector('#loginNameInput');
let loginArea = document.querySelector('#loginArea');
let chatArea = document.querySelector('#chatArea');

loginArea.style.display = 'flex';
chatArea.style.display = 'none';