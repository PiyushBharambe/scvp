const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const Organization = require('../db/models/Organization');
const logger = require('../utils/logger');

class AuthService {
  async register(email, password, organizationName) {
    if (!email || !password || !organizationName) {
      throw new Error('Email, password, and organization name are required');
    }

    // Check if user already exists
    const existingUser = await User.query().where('email', email).first();
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    // Create organization first
    const organization = await Organization.query().insert({
      name: organizationName,
    });

    // Create user
    const user = await User.query().insert({
      email,
      password_hash: hashedPassword,
      role: 'admin', // First user is admin
      organization_id: organization.id,
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    logger.info('User registered successfully', { 
      userId: user.id, 
      email: user.email,
      organizationId: organization.id 
    });

    return {
      token,
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = await User.query().where('email', email).first();
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(String(password), user.password_hash || '');
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    logger.info('User logged in successfully', { 
      userId: user.id, 
      email: user.email 
    });

    return {
      token,
      id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    };
  }

  async verifyToken(token) {
    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
      const decoded = jwt.verify(token, secret);
      const user = await User.query().findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  generateToken(userId) {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
    return jwt.sign({ id: userId }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  }
}

module.exports = new AuthService();