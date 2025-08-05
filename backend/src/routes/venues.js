const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Get venues (all venues for demo purposes)
router.get('/', async (req, res) => {
  try {
    const venues = await db('venues')
      .select('*')
      .orderBy('created_at', 'desc');

    res.json({ venues });

  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting venues' 
    });
  }
});

// Create venue
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('address').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('zip_code').trim().notEmpty(),
  body('latitude').isFloat(),
  body('longitude').isFloat(),
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
      name,
      description,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      phone,
      email,
      website_url
    } = req.body;

    const [venue] = await db('venues').insert({
      user_id: userId,
      name,
      description,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      phone,
      email,
      website_url,
      created_at: new Date(),
      updated_at: new Date()
    }).returning('*');

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    });

  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ 
      error: 'Internal server error creating venue' 
    });
  }
});

// Update venue
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('address').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('zip_code').optional().trim().notEmpty(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { userId } = req.user;

    // Check if venue exists and belongs to user
    const venue = await db('venues')
      .where({ id, user_id: userId })
      .first();

    if (!venue) {
      return res.status(404).json({ 
        error: 'Venue not found' 
      });
    }

    const updateData = req.body;
    updateData.updated_at = new Date();

    await db('venues')
      .where({ id })
      .update(updateData);

    res.json({ 
      message: 'Venue updated successfully' 
    });

  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ 
      error: 'Internal server error updating venue' 
    });
  }
});

// Get venue events
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const events = await db('events')
      .select(
        'events.*',
        'venues.name as venue_name',
        'venues.address as venue_address',
        'venues.city as venue_city',
        'venues.state as venue_state'
      )
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.venue_id', id)
      .where('events.is_active', true)
      .orderBy('events.start_date', 'asc')
      .limit(limit)
      .offset(offset);

    const total = await db('events')
      .where('venue_id', id)
      .where('is_active', true)
      .count('* as count')
      .first();

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        totalPages: Math.ceil(total.count / limit)
      }
    });

  } catch (error) {
    console.error('Get venue events error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting venue events' 
    });
  }
});

module.exports = router; 