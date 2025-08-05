const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  async register(req, res) {
    const { email, password, organizationName } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({
        message: 'Please provide email, password, and organization name',
      });
    }

    try {
      const result = await authService.register(email, password, organizationName);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Registration error', { error: error.message, email });
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    try {
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Login error', { error: error.message, email });
      const statusCode = error.message.includes('Invalid credentials') ? 401 : 500;
      res.status(statusCode).json({
        message: error.message,
      });
    }
  }

  async getMe(req, res) {
    try {
      // req.user is set by the auth middleware
      res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        organization_id: req.user.organization_id,
      });
    } catch (error) {
      logger.error('Get user profile error', { error: error.message });
      res.status(500).json({
        message: 'Server error getting user profile',
      });
    }
  }

  async verifyToken(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    try {
      const user = await authService.verifyToken(token);
      res.status(200).json(user);
    } catch (error) {
      logger.error('Token verification error', { error: error.message });
      res.status(401).json({
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();