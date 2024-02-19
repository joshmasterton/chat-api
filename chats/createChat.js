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
  async (req, res) => {
    // Req body variables
    const { groupName } = req.body;

    // Validation results
    const validator = validationResult(req);

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }

    // Check if user already exists in database
    const checkGroupExists = await queryDatabase(`SELECT * FROM chat_group
      WHERE chat_group_name = $1;`, [groupName]);
    // Return error is user exists
    if (checkGroupExists[0]) {
      return res.json({ err: 'Chat group name already taken' });
    }

    // Create group chat
    await queryDatabase(`INSERT INTO
      chat_group(chat_group_name, created_on)
      VALUES($1, $2);`, [
      groupName,
      new Date(Date.now()),
    ]);

    return res.json({ msg: 'New group chat created' });
  },
);

export default router;
