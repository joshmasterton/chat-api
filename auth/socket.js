/* eslint-disable no-param-reassign */
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Initialize env file dev/prod
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: './env/.development.env',
  });
}

// Initialize socket
export const initializeSocket = (app) => {
  const server = http.createServer(app);
  const { CLIENT_URL } = process.env;
  const io = new Server(server, {
    cors: {
      origin: [CLIENT_URL, 'http://localhost:9000'],
      credentials: true,
    },
  });
  return { server, io };
};

// Socket initialization
export const connectedIo = (io) => {
  // On inital connection
  io.on('connection', (socket) => {
    // User connected
    console.log('a user connected');

    // Emit to front end that user is connected
    setTimeout(() => {
      socket.emit('initialConnect');
    }, 100);

    // On join chat
    socket.on('joinChat', (chatGroupId) => {
      socket.join(`chat${chatGroupId}`);
      console.log('user joined chat');
      io.to(`chat${chatGroupId}`)
        .emit('userJoinedChat', 'user joined chat');
    });

    // On messages sent
    socket.on('sendMessage', (chatGroupId) => {
      console.log('get messages');
      io.to(`chat${chatGroupId}`)
        .emit('getMessages');
    });

    socket.on('sendChats', () => {
      console.log('get chats');
      io.emit('getChats');
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  });
};
