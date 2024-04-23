const { Server } = require("socket.io");
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express();
const server = createServer(app);
const io = new Server(server);
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
  //connected conformation
  socket.on('set-name', (userName) => {
    socket.userName = userName;
    const userConnectedmessage = `${userName} has joined the chat`;
    console.log(`${userName} connected`);
    io.emit(`user connected`, userConnectedmessage);
  });

  //msg output
  socket.on('chat message', (msg) => {
    const messageWithUserName = `${socket.userName}: ${msg}`;
    console.log('message: ' + messageWithUserName);
    io.emit('chat message', messageWithUserName);
});

  //disconnect
  socket.on('disconnect', () => {
    const userDisconnectedMessage = `${socket.userName} has left the chat`;
    console.log(`${socket.userName} disconnected`);
    io.emit('user disconnected', userDisconnectedMessage);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});