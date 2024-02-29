/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import signup from './auth/signup.js';
import login from './auth/login.js';
import checkUser from './auth/checkUser.js';
import createChat from './chats/createChat.js';
import createPublicChat from './chats/createPublicChat.js';
import createMessage from './chats/createMessage.js';
import getChats from './chats/getChats.js';
import getChat from './chats/getChat.js';
import getUsers from './auth/getUsers.js';
import getMessages from './chats/getMessages.js';
import getContact from './auth/getContact.js';
import getFriendship from './friends/getFriendship.js';
import createFriendship from './friends/createFriendship.js';
import removeFriendship from './friends/removeFriendship.js';
import initializeDatabase from './database/initializeDatabase.js';
import { initializeSocket, connectedIo } from './auth/socket.js';

// Initialize env file dev/prod
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: './env/.development.env',
  });
}

// Initialize app variables
const app = express();
const { PORT, CLIENT_URL } = process.env;
const { server, io } = initializeSocket(app);

// Initialize cors
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:9000'],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database initialization
initializeDatabase();

// Socket initialization
connectedIo(io);

// Routes
// Auth routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/checkUser', checkUser);
app.use('/getUsers', getUsers);
app.use('/getContact', getContact);

// Chat routes
app.use('/getMessages', getMessages);
app.use('/createMessage', createMessage);
app.use('/createChat', createChat);
app.use('/createPublicChat', createPublicChat);
app.use('/getChats', getChats);
app.use('/getChat', getChat);

// Friends routes
app.use('/createFriendship', createFriendship);
app.use('/removeFriendship', removeFriendship);
app.use('/getFriendship', getFriendship);

// Custom error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err.message);
    return res.json({ err: err.message });
  }
  return next();
});

// Listen to server
server.listen(PORT, (err) => {
  if (err) return console.log(err.message);
  return console.log(`Running On Port: ${PORT}`);
});
