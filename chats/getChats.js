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
    // Get all chats
    if (req.user.username) {
      // Get all chats related to username
      const chats = await queryDatabase(`SELECT * FROM chat_group
        WHERE chat_group_friend_one = $1
        OR chat_group_friend_two = $1`, [req.user.username]);

      // Get all chats related to username
      const publicChats = await queryDatabase(`SELECT * FROM chat_group
        WHERE chat_group_privacy = $1`, [false]);

      // No chats found
      if (!chats && !publicChats) return res.json({ err: 'No chats found' });

      // Sort chats by creation date
      if (chats[0] || publicChats[0]) {
        const publicPrivateChats = chats.concat(publicChats);
        const sortedChats = await publicPrivateChats.sort(
          (a, b) => b.chat_group_last_message - a.chat_group_last_message,
        );
        return res.json(sortedChats);
      }
    }

    // Get all chats related to public chats
    return res.json({ err: 'No chats found' });
  },
);

export default router;
