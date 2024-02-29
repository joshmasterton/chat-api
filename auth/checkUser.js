/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import express from 'express';
import { decodeToken, verifyToken } from './token.js';

// Initialize router
const router = express.Router();

// Check user
router.get(
  '/',
  async (req, res) => {
    // Log bearerToken
    const bearerToken = req.headers?.authorization?.split(' ')[1];

    // Is token still legit otherwise error
    const checkToken = await verifyToken(bearerToken);
    if (!checkToken) { return res.json({ err: 'No user' }); }

    // If token still legit send back
    const checkDecoded = await decodeToken(checkToken);

    // Return username
    return res.json({
      token: checkToken,
      username: checkDecoded.username,
      lastOnline: checkDecoded.lastOnline,
    });
  },
);

export default router;
