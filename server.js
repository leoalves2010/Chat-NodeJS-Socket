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
    console.log("Conectado no Socket");

    socket.on('join-request', (user) => {
        socket.username = user.name;
        connectedUsers.push(user);

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('user-ok', connectedUsers);
    });
});