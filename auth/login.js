/* eslint-disable import/extensions */
import express from 'express';
import bcrypt from 'bcryptjs';
import {
  validationResult,
  body,
} from 'express-validator';
import queryDatabase from '../database/queryDatabase.js';
import { decodeToken, generateToken, verifyToken } from './token.js';

// Initialize router
const router = express.Router();

// Signup process
router.post(
  '/',
  // Validation
  body('username')
    .isLength({ min: 6 })
    .withMessage('Username must be at least 6 characters')
    .isLength({ max: 30 })
    .withMessage('Username cannot exceed 30 characters')
    .escape()
    .withMessage('Validation error'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 200 })
    .withMessage('Password cannot exceed 200 characters')
    .escape()
    .withMessage('Validation error'),
  async (req, res) => {
    // Log bearerToken
    const bearerToken = req.headers.authorization.split(' ')[1];

    // Req body variables
    const { username, password } = req.body;

    // Validation results
    const validator = validationResult(req);

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }

    // Is user
    const isUser = await queryDatabase(`SELECT * FROM
      users WHERE username = $1`, [username]);

    // On no found user send error
    if (!isUser[0]) return res.json({ err: 'Invalid details' });

    // Check password is correct
    const passwordCheck = await bcrypt.compare(password, isUser[0].password);
    if (!passwordCheck) return res.json({ err: 'Invalid details' });

    // Is token still legit otherwise generate new one
    const checkToken = await verifyToken(bearerToken);
    if (!checkToken) {
      const newToken = await generateToken(isUser[0]);
      const newDecoded = await decodeToken(newToken);
      return res.json({
        token: newToken,
        username: newDecoded.id,
      });
    }

    // If token still legit send back
    const checkDecoded = await decodeToken(checkToken);
    return res.json({
      token: checkToken,
      username: checkDecoded.id,
    });
  },
);

export default router;
