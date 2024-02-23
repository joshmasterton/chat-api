/* eslint-disable import/extensions */
import express from 'express';
import { decodeToken, verifyToken } from './token.js';

// Initialize router
const router = express.Router();

// Signup process
router.get(
  '/',
  async (req, res) => {
    // Log bearerToken
    const bearerToken = req.headers?.authorization?.split(' ')[1];

    // Is token still legit otherwise generate new one
    const checkToken = await verifyToken(bearerToken);
    if (!checkToken) { return res.json({ err: 'No user' }); }

    // If token still legit send back
    const checkDecoded = await decodeToken(checkToken);
    return res.json({
      token: checkToken,
      username: checkDecoded.username,
      lastOnline: checkDecoded.lastOnline,
    });
  },
);

export default router;
