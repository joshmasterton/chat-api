/* eslint-disable import/extensions */
import express from 'express';
import bcrypt from 'bcryptjs';
import {
  validationResult,
  body,
} from 'express-validator';
import queryDatabase from '../database/queryDatabase.js';
import { generateToken, decodeToken } from './token.js';

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
    .withMessage('Validation error')
    .matches(/^\S*$/)
    .withMessage('Username cannot contain spaces'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 200 })
    .withMessage('Password cannot exceed 200 characters')
    .escape()
    .withMessage('Validation error')
    .matches(/^\S*$/)
    .withMessage('Password cannot contain spaces'),
  async (req, res) => {
    // Req body variables
    const { username, password, confirmPassword } = req.body;

    // Validation results
    const validator = validationResult(req);
    const doPasswordsMatch = password === confirmPassword;

    // If validation error return error
    if (validator.errors[0]) {
      return res.json({ err: validator.errors[0].msg });
    }
    // Do passwords match
    if (!doPasswordsMatch) return res.json({ err: 'Passwords do not match' });

    // Check if user already exists in database
    const checkUserExists = await queryDatabase(`SELECT * FROM users
      WHERE usernameLowerCase = $1;`, [username.toLowerCase()]);
    // Return error is user exists
    if (checkUserExists[0]) {
      return res.json({ err: 'User already exists' });
    }

    // Encrypt password and store in database
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await queryDatabase(`INSERT INTO users(
        username, usernameLowerCase, password,
        created_on, last_online
      )VALUES($1, $2, $3, $4, $5) RETURNING *;`, [
        username,
        username.toLowerCase(),
        hashedPassword,
        new Date(Date.now()),
        new Date(Date.now()),
      ]);

      // Generate token for new user
      const jwtToken = await generateToken(newUser[0]);

      // Send generated token back with username
      const jwtDecoded = await decodeToken(jwtToken);
      return res.json({
        token: jwtToken,
        username: jwtDecoded.id,
      });
    } catch (err) {
      return res.json({ err: 'Signup error' });
    }
  },
);

export default router;
