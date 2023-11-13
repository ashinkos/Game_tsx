const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 4001;

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle player movement
  socket.on('movePaddle', (data) => {
    // Broadcast the movement to all other clients
    socket.broadcast.emit('updatePaddle', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
