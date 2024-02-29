/* eslint-disable import/extensions */
import express from 'express';
import queryDatabase from '../database/queryDatabase.js';
import { verifyTokenMiddleware } from '../auth/token.js';

// Get messages router
const router = express.Router();

// Get all messages from chat_group
router.post(
  '/',
  verifyTokenMiddleware,
  async (req, res) => {
    // Req variables
    const { chatGroupId } = req.body;

    // Get messages
    const messages = await queryDatabase(`SELECT * FROM chat
      WHERE chat_group_id = $1`, [chatGroupId]);
    if (!messages[0]) {
      return res.json({ err: 'No messages found' });
    }
    if (messages[0]) {
      const sortedMessages = await messages.sort((a, b) => a.created_on - b.created_on);
      return res.json(sortedMessages);
    }
    return res.json({ err: 'No messages found' });
  },
);

export default router;
