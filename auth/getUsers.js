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
    if (users[0]) return res.json(users);
    return res.json({ err: 'No users found' });
  },
);

export default router;
