/* eslint-disable import/extensions */
import express from 'express';
import {
  validationResult,
  body,
} from 'express-validator';
import { verifyTokenMiddleware } from '../auth/token.js';
import queryDatabase from '../database/queryDatabase.js';

// Initialize router
const router = express.Router();

// Create group chat
router.post(
  '/',
  // Validation
  verifyTokenMiddleware,
  body('groupName')
    .isLength({ min: 6 })
    .withMessage('Group chat name must be at least 6 characters')
    .isLength({ max: 30 })
    .withMessage('Group chat name cannot exceed 30 characters')
    .escape()
    .withMessage('Validation error'),
  body('friendOne')
    .escape()
    .trim(),
  body('friendTwo')
    .escape()
    .trim(),
  async (req, res) => {
    // Req body variables
    const {
      groupName,
      privacy,
      friendOne,
      friendTwo,
    } = req.body;

    // Validation results
    const validator = validationResult(req);

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }

    // Check if chat already exists in database
    const checkGroupExists = await queryDatabase(`SELECT * FROM chat_group
      WHERE chat_group_friend_one = $1
      AND chat_group_friend_two = $2
      OR chat_group_friend_one = $2
      AND chat_group_friend_two = $1`, [friendOne, friendTwo]);

    // Return error chat exists
    if (checkGroupExists && checkGroupExists.length > 0) {
      return res.json({
        err: 'Chat already exists',
        chatGroupId: checkGroupExists[0]?.chat_group_id,
      });
    }

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
      privacy,
      friendOne,
      friendTwo,
      new Date(Date.now()),
    ]);

    return res.json({
      msg: 'New group chat created',
      chatGroupId: insertChat[0]?.chat_group_id,
    });
  },
);

export default router;
