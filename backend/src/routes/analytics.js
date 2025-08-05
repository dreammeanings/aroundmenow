const express = require('express');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get user analytics
router.get('/user', async (req, res) => {
  try {
    const { userId } = req.user;

    // Get user's event interactions
    const savedEvents = await db('user_saved_events')
      .where({ user_id: userId })
      .count('* as count')
      .first();

    const viewedEvents = await db('analytics_events')
      .where({ user_id: userId, event_type: 'event_view' })
      .count('* as count')
      .first();

    const searches = await db('analytics_events')
      .where({ user_id: userId, event_type: 'event_search' })
      .count('* as count')
      .first();

    // Get recent activity
    const recentActivity = await db('analytics_events')
      .where({ user_id: userId })
      .orderBy('timestamp', 'desc')
      .limit(10);

    res.json({
      analytics: {
        savedEvents: parseInt(savedEvents.count),
        viewedEvents: parseInt(viewedEvents.count),
        searches: parseInt(searches.count),
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting user analytics' 
    });
  }
});

// Get venue analytics
router.get('/venue/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Check if venue belongs to user
    const venue = await db('venues')
      .where({ id, user_id: userId })
      .first();

    if (!venue) {
      return res.status(404).json({ 
        error: 'Venue not found' 
      });
    }

    // Get venue's event metrics
    const totalEvents = await db('events')
      .where({ venue_id: id })
      .count('* as count')
      .first();

    const totalViews = await db('events')
      .where({ venue_id: id })
      .sum('total_views as total')
      .first();

    const totalSaves = await db('events')
      .where({ venue_id: id })
      .sum('total_saves as total')
      .first();

    const totalShares = await db('events')
      .where({ venue_id: id })
      .sum('total_shares as total')
      .first();

    // Get recent events
    const recentEvents = await db('events')
      .where({ venue_id: id })
      .orderBy('created_at', 'desc')
      .limit(5);

    res.json({
      analytics: {
        totalEvents: parseInt(totalEvents.count),
        totalViews: parseInt(totalViews.total || 0),
        totalSaves: parseInt(totalSaves.total || 0),
        totalShares: parseInt(totalShares.total || 0),
        recentEvents
      }
    });

  } catch (error) {
    console.error('Get venue analytics error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting venue analytics' 
    });
  }
});

// Track custom event
router.post('/track', [
  body('event_type').notEmpty(),
  body('properties').optional().isObject(),
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
    const { event_type, properties, event_id } = req.body;

    await db('analytics_events').insert({
      user_id: userId,
      event_type,
      event_id,
      properties: properties || {},
      timestamp: new Date()
    });

    res.json({ 
      message: 'Event tracked successfully' 
    });

  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({ 
      error: 'Internal server error tracking event' 
    });
  }
});

module.exports = router; 