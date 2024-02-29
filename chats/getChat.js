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
    // Req.query variables
    const { id } = req.query;

    // Get group chat for specific chat room
    const chats = await queryDatabase(`SELECT * FROM chat_group
      WHERE chat_group_id = $1
      AND chat_group_friend_one = $2
      OR chat_group_id = $1
      AND chat_group_friend_two = $2`, [
      parseInt(id, 10),
      req.user.username,
    ]);

    // Get public chats from chat
    const publicChats = await queryDatabase(`SELECT * FROM chat_group
    WHERE chat_group_id = $1 AND chat_group_privacy = $2`, [parseInt(id, 10), false]);

    // If chats return empty no access
    if (!publicChats && !chats) return res.json({ err: 'No chat found' });

    // Get chats
    if (chats[0]) {
      const sortedChats = await chats.sort((a, b) => b.created_on - a.created_on);
      return res.json(sortedChats);
    }

    // Get public chats
    if (publicChats[0]) {
      const sortedChats = await publicChats.sort((a, b) => b.created_on - a.created_on);
      return res.json(sortedChats);
    }

    return res.json({ err: 'No chat found' });
  },
);

export default router;
