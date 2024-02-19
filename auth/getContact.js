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
    if (users[0]) return res.json(users);
    return res.json({ err: 'No contact found' });
  },
);

export default router;
