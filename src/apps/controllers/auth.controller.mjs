
import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

/**
 * @class AuthController
 * @description Controller for handling user authentication operations, including registration and login.
 */
class AuthController {
  /**
   * Registers a new user and returns a JWT token.
   * @async
   * @param {Object} req - Express request object containing the user data in the body.
   * @param {Object} req.body - Request body containing user registration details.
   * @param {string} req.body.username - The unique username for the new user.
   * @param {string} req.body.password - The password for the new user.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with a JSON object containing the JWT token or an error message.
   * @throws {Error} If the username already exists, input is invalid, or a server error occurs.
   */
  async register(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const user = new User({ username, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Logs in a user and returns a JWT token.
   * @async
   * @param {Object} req - Express request object containing the user credentials in the body.
   * @param {Object} req.body - Request body containing user login details.
   * @param {string} req.body.username - The username of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with a JSON object containing the JWT token or an error message.
   * @throws {Error} If the credentials are invalid, input is missing, or a server error occurs.
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();