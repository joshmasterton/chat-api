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

// Remove friendship
router.delete(
  '/',
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

    // Return error if chat group doesnt exist
    if (!checkFriendship || checkFriendship.length === 0) {
      return res.json({ err: 'Friendship already removed' });
    }

    // Remove friendship from database
    await queryDatabase(`DELETE FROM friends
      WHERE friend_one_username = $1
      AND friend_two_username = $2
      OR friend_one_username = $2
      AND friend_two_username = $1`, [friendOne, friendTwo]);
    return res.json({ err: 'Friendship removed' });
  },
);

export default router;
