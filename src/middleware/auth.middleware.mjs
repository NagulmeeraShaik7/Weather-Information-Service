import jwt from 'jsonwebtoken';

/**
 * @function authenticate
 * @description Middleware to authenticate requests using a JWT token.
 * @async
 * @param {Object} req - Express request object containing the Authorization header.
 * @param {Object} req.headers - Request headers.
 * @param {string} [req.headers.authorization] - The Authorization header containing the JWT token (format: Bearer <token>).
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to pass control to the next middleware or route handler.
 * @returns {void} Calls next() if authentication is successful, otherwise responds with a 401 error.
 * @throws {Error} If the token is missing, invalid, or expired.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authenticate;