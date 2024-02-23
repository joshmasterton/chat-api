/* eslint-disable import/extensions */
import express from 'express';
import queryDatabase from '../database/queryDatabase.js';
import { verifyTokenMiddleware } from './token.js';

// Get users router
const router = express.Router();

// Get all users from database
router.get(
  '/',
  verifyTokenMiddleware,
  async (req, res) => {
    // Query specific user required
    const users = await queryDatabase(`SELECT * FROM
    users WHERE username = $1`, [req.query.username]);
    const userSafe = await users.map((user) => ({
      user_id: user.user_id,
      username: user.username,
      usernamelowercase: user.usernamelowercase,
      created_on: user.created_on,
      last_online: user.last_online,
    }));

    if (users[0]) return res.json(userSafe);
    return res.json({ err: 'No contact found' });
  },
);

export default router;
