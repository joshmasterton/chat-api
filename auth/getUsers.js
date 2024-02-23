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
    const users = await queryDatabase('SELECT * FROM users');
    const usersSafe = await users.map((user) => ({
      user_id: user.user_id,
      username: user.username,
      usernamelowercase: user.usernamelowercase,
      created_on: user.created_on,
      last_online: user.last_online,
    }));
    if (users[0]) return res.json(usersSafe);
    return res.json({ err: 'No users found' });
  },
);

export default router;
