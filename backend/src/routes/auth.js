const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [user] = await db('users').insert({
      email,
      password_hash: passwordHash,
      name,
      phone,
      member_since: new Date()
    }).returning(['id', 'email', 'name', 'created_at', 'member_since']);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        memberSince: user.member_since
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'Account is deactivated' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login_at: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        bio: user.bio,
        phonePrivacy: user.phone_privacy,
        memberSince: user.member_since,
        preferences: user.preferences,
        notificationSettings: user.notification_settings,
        subscription: {
          tier: user.subscription_tier,
          price: user.subscription_price
        }
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Social login (Google)
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    // Find existing user by Google ID or email
    let user = await db('users')
      .where({ google_id: googleId })
      .orWhere({ email })
      .first();

    if (user) {
      // Update Google ID if not set
      if (!user.google_id) {
        await db('users')
          .where({ id: user.id })
          .update({ 
            google_id: googleId,
            last_login_at: new Date()
          });
      }
    } else {
      // Create new user
      [user] = await db('users').insert({
        google_id: googleId,
        email,
        name,
        avatar_url: avatar,
        email_verified: true,
        member_since: new Date()
      }).returning(['id', 'email', 'name', 'created_at', 'member_since']);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        memberSince: user.member_since
      },
      token
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during Google login' 
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Get user data
    const user = await db('users').where({ id: userId }).first();
    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'User not found or inactive' 
      });
    }

    // Generate new token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Internal server error during token refresh' 
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Update last login time for analytics
    await db('users')
      .where({ id: req.user.userId })
      .update({ last_login_at: new Date() });

    res.json({ 
      message: 'Logout successful' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal server error during logout' 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        bio: user.bio,
        phonePrivacy: user.phone_privacy,
        avatar: user.avatar_url,
        memberSince: user.member_since,
        preferences: user.preferences,
        notificationSettings: user.notification_settings,
        subscription: {
          tier: user.subscription_tier,
          price: user.subscription_price
        },
        location: {
          latitude: user.latitude,
          longitude: user.longitude,
          locationName: user.location_name
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting user data' 
    });
  }
});

module.exports = router; 