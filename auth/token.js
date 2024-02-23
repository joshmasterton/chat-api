import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Initialize env file dev/prod
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: './env/.development.env',
  });
}

// Secret variables
const { JWT_SECRET } = process.env;

// Generate a token from user
export const generateToken = async (user) => {
  const token = jwt.sign(
    { username: user.username, lastOnline: user.last_online },
    JWT_SECRET,
    { expiresIn: '8h' },
  );
  return token;
};

// Verify token on request
export const verifyToken = async (token) => {
  const checkToken = jwt.verify(token, JWT_SECRET, (err) => {
    if (err) return null;
    return token;
  });

  return checkToken;
};

// Verify token middleware
export const verifyTokenMiddleware = async (req, res, next) => {
  // BearerToken
  const bearerToken = req.headers.authorization.split(' ')[1];

  // Is token legit
  const checkToken = jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('TokenError'));
    req.user = decoded;
    return next();
  });

  return checkToken;
};

// Decode and return username
export const decodeToken = async (token) => {
  const decodedToken = jwt.decode(token);
  return decodedToken;
};
