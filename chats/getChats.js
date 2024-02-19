/* eslint-disable import/extensions */
import express from 'express';
import queryDatabase from '../database/queryDatabase.js';
import { verifyTokenMiddleware } from '../auth/token.js';

// Get chats router
const router = express.Router();

// Get all chats from database
router.get(
  '/',
  verifyTokenMiddleware,
  async (req, res) => {
    const chats = await queryDatabase('SELECT * FROM chat_group');
    if (!chats[0]) return res.json({ err: 'No chats found' });
    if (chats[0]) {
      const sortedChats = await chats.sort((a, b) => b.created_on - a.created_on);
      return res.json(sortedChats);
    }
    return res.json({ err: 'No chats found' });
  },
);

export default router;
