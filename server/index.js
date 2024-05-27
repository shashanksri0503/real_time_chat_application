const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create an Express app
const app = express();

// Use CORS middleware
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // You can specify your client URL here
        methods: ['GET', 'POST']
    }
});

const users = {};


io.on('connection', socket => {
    console.log('New connection:', socket.id);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log(`${name} joined the chat`);
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log(`Message from ${users[socket.id]}: ${message}`);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {

        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// Listen on a specific port
server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
