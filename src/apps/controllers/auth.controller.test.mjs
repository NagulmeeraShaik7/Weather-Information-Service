import AuthController from '../controllers/auth.controller.mjs';
import User from '../models/user.model.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock the User model and jsonwebtoken
jest.mock('../models/user.model.mjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_jwt_secret';

    // Reset User constructor mock
    User.mockImplementation(() => ({
      save: jest.fn(),
    }));
  });

  describe('register', () => {
    it('should register a new user and return a JWT token', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      User.findOne.mockResolvedValue(null); // No existing user
      const savedUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashedPassword',
      };
      // Mock the save method on the User instance
      User.mockImplementation(() => ({
        ...savedUser,
        save: jest.fn().mockResolvedValue(savedUser),
      }));
      jwt.sign.mockReturnValue('jwt_token');

      // Act
      await AuthController.register(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(User).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        'test_jwt_secret',
        { expiresIn: '24h' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'jwt_token' });
    });

    it('should return 400 if username or password is missing', async () => {
      // Arrange
      req.body = { username: 'testuser' }; // Missing password

      // Act
      await AuthController.register(req, res);

      // Assert
      expect(User.findOne).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
    });

    it('should return 400 if username already exists', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      User.findOne.mockResolvedValue({ username: 'testuser' });

      // Act
      await AuthController.register(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(User).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it('should return 500 on server error', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await AuthController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('login', () => {
    it('should login a user and return a JWT token', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      const user = {
        _id: 'user123',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('jwt_token');

      // Act
      await AuthController.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(user.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        'test_jwt_secret',
        { expiresIn: '24h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'jwt_token' });
    });

    it('should return 400 if username or password is missing', async () => {
      // Arrange
      req.body = { username: 'testuser' }; // Missing password

      // Act
      await AuthController.login(req, res);

      // Assert
      expect(User.findOne).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
    });

    it('should return 401 if user is not found', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      // Act
      await AuthController.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is incorrect', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'wrongpassword' };
      const user = {
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(user);

      // Act
      await AuthController.login(req, res);

      // Assert
      expect(user.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 on server error', async () => {
      // Arrange
      req.body = { username: 'testuser', password: 'password123' };
      User.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      await AuthController.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});