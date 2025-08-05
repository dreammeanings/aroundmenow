const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
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
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting user profile' 
    });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().custom((value) => {
    if (!value) return true; // Allow empty phone numbers
    
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // Check if it's a valid phone number format
    // Accept formats like: +1234567890, 1234567890, (123) 456-7890, etc.
    const phoneRegex = /^(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    
    if (!phoneRegex.test(cleaned)) {
      throw new Error('Invalid phone number format');
    }
    
    return true;
  }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { userId } = req.user;
    const { name, phone, avatar, bio, phonePrivacy } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) {
      // Clean and format phone number for storage
      const cleaned = phone.replace(/[^\d+]/g, '');
      updateData.phone = cleaned;
    }
    if (avatar) updateData.avatar_url = avatar;
    if (bio !== undefined) updateData.bio = bio; // Allow empty bio strings
    if (phonePrivacy !== undefined) updateData.phone_privacy = phonePrivacy; // Handle phone privacy

    await db('users')
      .where({ id: userId })
      .update({
        ...updateData,
        updated_at: new Date()
      });

    res.json({ 
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error updating user profile' 
    });
  }
});

// Get saved events
router.get('/saved-events', async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const savedEvents = await db('user_saved_events')
      .select(
        'user_saved_events.id as save_id',
        'user_saved_events.saved_at',
        'events.*',
        'venues.name as venue_name',
        'venues.address as venue_address',
        'venues.city as venue_city',
        'venues.state as venue_state'
      )
      .leftJoin('events', 'user_saved_events.event_id', 'events.id')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('user_saved_events.user_id', userId)
      .where('events.is_active', true)
      .orderBy('user_saved_events.saved_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('user_saved_events')
      .where('user_id', userId)
      .count('* as count')
      .first();

    res.json({
      events: savedEvents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        totalPages: Math.ceil(total.count / limit)
      }
    });

  } catch (error) {
    console.error('Get saved events error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting saved events' 
    });
  }
});

// Get friends activity
router.get('/friends-activity', async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 10 } = req.query;

    // For demo purposes, return mock friends activity
    // In production, this would query actual friend relationships
    const mockFriendsActivity = [
      {
        id: '1',
        friendName: 'Sarah Johnson',
        eventTitle: 'Live Jazz Night',
        action: 'saved',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        eventId: 'e9b960ef-4b65-4663-91ec-5001b6330bc6'
      },
      {
        id: '2',
        friendName: 'Mike Chen',
        eventTitle: 'Tech Networking Mixer',
        action: 'attending',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        eventId: 'e991e664-5872-415d-a772-479e93fa1e02'
      },
      {
        id: '3',
        friendName: 'Emma Davis',
        eventTitle: 'Food Truck Festival',
        action: 'shared',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        eventId: 'b7468b13-b891-4481-a66c-c6d39071bfc0'
      },
      {
        id: '4',
        friendName: 'Alex Rodriguez',
        eventTitle: 'Yoga in the Park',
        action: 'saved',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        eventId: 'c8f7a123-4567-89ab-cdef-123456789abc'
      },
      {
        id: '5',
        friendName: 'Lisa Wang',
        eventTitle: 'Art Gallery Opening',
        action: 'attending',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        eventId: 'd9e8b234-5678-9abc-def0-234567890def'
      }
    ].slice(0, parseInt(limit));

    res.json({
      friendsActivity: mockFriendsActivity
    });

  } catch (error) {
    console.error('Get friends activity error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting friends activity' 
    });
  }
});

// Update user preferences
router.put('/preferences', [
  body('defaultRadius').optional().isInt({ min: 1, max: 100 }),
  body('eventTypes').optional().isArray(),
  body('vibe').optional().isArray(),
  body('priceRange').optional().isArray(),
  body('preferredVibe').optional().isString(),
  body('locationEnabled').optional().isBoolean(),
  body('locationPrecision').optional().isIn(['high', 'medium', 'low']),
  body('radius').optional().isInt({ min: 1, max: 100 }),
  body('profileVisibility').optional().isIn(['public', 'friends', 'private']),
  body('dataSharing').optional().isBoolean(),
  body('analyticsEnabled').optional().isBoolean(),
  body('twoFactorAuth').optional().isBoolean(),
  body('loginNotifications').optional().isBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { userId } = req.user;
    const { 
      defaultRadius, 
      eventTypes, 
      vibe, 
      priceRange, 
      preferredVibe,
      locationEnabled,
      locationPrecision,
      radius,
      profileVisibility,
      dataSharing,
      analyticsEnabled,
      twoFactorAuth,
      loginNotifications
    } = req.body;

    const currentUser = await db('users').where({ id: userId }).first();
    const currentPreferences = currentUser.preferences || {};

    const updatedPreferences = {
      ...currentPreferences,
      ...(defaultRadius !== undefined && { defaultRadius }),
      ...(eventTypes && { eventTypes }),
      ...(vibe && { vibe }),
      ...(priceRange && { priceRange }),
      ...(preferredVibe && { preferredVibe }),
      ...(locationEnabled !== undefined && { locationEnabled }),
      ...(locationPrecision && { locationPrecision }),
      ...(radius !== undefined && { radius }),
      ...(profileVisibility && { profileVisibility }),
      ...(dataSharing !== undefined && { dataSharing }),
      ...(analyticsEnabled !== undefined && { analyticsEnabled }),
      ...(twoFactorAuth !== undefined && { twoFactorAuth }),
      ...(loginNotifications !== undefined && { loginNotifications })
    };

    await db('users')
      .where({ id: userId })
      .update({
        preferences: updatedPreferences,
        updated_at: new Date()
      });

    res.json({ 
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      error: 'Internal server error updating preferences' 
    });
  }
});

module.exports = router; 