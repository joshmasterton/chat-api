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

// Create new friendship
router.post(
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

    // Return error if friendship already exists
    if (checkFriendship.length > 0) {
      // Is friendship already complete
      if (checkFriendship[0].friend_one_accepted
        && checkFriendship[0].friend_two_accepted) {
        return res.json({ err: 'Friendship already exists' });
      }
      // Check if user has accepted
      if (friendOne === checkFriendship[0].friend_one_username) {
        await queryDatabase(`UPDATE friends
          SET friend_one_accepted = $1
          WHERE friends_id = $2`, [true, checkFriendship[0].friends_id]);
      }
      if (friendOne === checkFriendship[0].friend_two_username) {
        await queryDatabase(`UPDATE friends
          SET friend_two_accepted = $1
          WHERE friends_id = $2`, [true, checkFriendship[0].friends_id]);
      }
      if (checkFriendship[0].friend_two_accepted === false) {
        return res.json({ err: 'Waiting for other person to accept' });
      }
    }

    // Insert friendship into database
    await queryDatabase(`INSERT INTO friends(
      friend_one_username,
      friend_two_username,
      friend_one_accepted,
      friend_two_accepted,
      created_on
    )VALUES($1, $2, $3, $4, $5)`, [friendOne, friendTwo, true, false, new Date(Date.now())]);

    return res.json({ err: 'Friendship created' });
  },
);

export default router;
