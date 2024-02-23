/* eslint-disable import/extensions */
import express from 'express';
import {
  validationResult,
  body,
} from 'express-validator';
import queryDatabase from '../database/queryDatabase.js';
import { verifyTokenMiddleware } from '../auth/token.js';

// Get friendship router
const router = express.Router();

// Get friendship from database
router.post(
  '/',
  verifyTokenMiddleware,
  verifyTokenMiddleware,
  body('friendOne')
    .escape()
    .trim(),
  body('friendTwo')
    .escape()
    .trim(),
  async (req, res) => {
    // Req body variables
    const { friendOne, friendTwo } = req.body;

    // Validation results
    const validator = validationResult(req);

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }

    // Check if friendship exists in database
    const checkFriendship = await queryDatabase(`SELECT * FROM friends
      WHERE friend_one_username = $1
      AND friend_two_username = $2
      OR friend_one_username = $2
      AND friend_two_username = $1`, [friendOne, friendTwo]);

    if (!checkFriendship || checkFriendship.length === 0) return res.json({ err: 'No friendships exist' });
    if (checkFriendship[0]) {
      return res.json(checkFriendship);
    }
    return res.json({ err: 'No friendships exist' });
  },
);

export default router;
