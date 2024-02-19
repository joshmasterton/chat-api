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
    // Get group chat for specific chat room
    const chats = await queryDatabase(`SELECT * FROM chat_group
    WHERE chat_group_id = $1`, [parseInt(req?.query.id, 10)]);
    if (!chats[0]) return res.json({ err: 'No chat found' });
    if (chats[0]) {
      const sortedChats = await chats.sort((a, b) => b.created_on - a.created_on);
      return res.json(sortedChats);
    }
    return res.json({ err: 'No chat found' });
  },
);

export default router;
