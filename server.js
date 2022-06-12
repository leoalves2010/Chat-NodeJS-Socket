const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = [];

io.on("connection", (socket) => {
    socket.on('join-request', (user) => {
        socket.username = user.name;
        connectedUsers.push(user);

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: user.name,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.name !== socket.username);
        socket.broadcast.emit('list-update', {
            leave: socket.username,
            list: connectedUsers
        });
    });

    socket.on('send-msg', (user) => {
        let userObj = {
            name: socket.username,
            msg: user.msg,
            avatar: user.avatar
        };

        socket.emit('show-msg', userObj);
        socket.broadcast.emit('show-msg', userObj);
    });
});