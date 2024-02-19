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

// Create new message
router.post(
  '/',
  // Validation
  verifyTokenMiddleware,
  body('message')
    .isLength({ min: 1 })
    .withMessage('Message is empty')
    .isLength({ max: 250 })
    .withMessage('Message cannot exceed 250 characters')
    .escape()
    .withMessage('Validation error'),
  async (req, res) => {
    // Req body variables
    const { user, message, chatGroupId } = req.body;

    // Validation results
    const validator = validationResult(req);

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }

    // Check if chat group exists in database
    const checkGroupExists = await queryDatabase(`SELECT * FROM chat_group
      WHERE chat_group_id = $1;`, [parseInt(chatGroupId, 10)]);
    // Return error if chat group doesnt exist
    if (!checkGroupExists[0]) {
      return res.json({ err: 'Chat group doesnt exist' });
    }

    // Create new message
    await queryDatabase(`INSERT INTO
      chat(chat_group_id, username, content, created_on)
      VALUES($1, $2, $3, $4);`, [
      parseInt(chatGroupId, 10),
      user,
      message,
      new Date(Date.now()),
    ]);

    return res.json({ msg: 'Message sent' });
  },
);

export default router;
