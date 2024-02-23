/* eslint-disable import/extensions */
import express from 'express';
import { verifyTokenMiddleware } from '../auth/token.js';
import queryDatabase from '../database/queryDatabase.js';

// Initialize router
const router = express.Router();

// Create group chat
router.post(
  '/',
  // Validation
  verifyTokenMiddleware,
  async (req, res) => {
    // Get all chat groups for new public chat group name
    const allChatGroups = await queryDatabase(`SELECT * FROM chat_group
      WHERE chat_group_privacy = $1`, [false]);

    // Group name
    const groupName = `Chat Group ${allChatGroups.length + 1}`;

    // Create group chat
    const insertChat = await queryDatabase(`INSERT INTO
      chat_group(
        chat_group_name,
        chat_group_privacy,
        chat_group_friend_one,
        chat_group_friend_two,
        chat_group_created_on
      )
      VALUES($1, $2, $3, $4, $5) RETURNING *;`, [
      groupName,
      false,
      null,
      null,
      new Date(Date.now()),
    ]);

    return res.json({
      msg: 'New group chat created',
      chatGroupId: insertChat[0]?.chat_group_id,
    });
  },
);

export default router;
