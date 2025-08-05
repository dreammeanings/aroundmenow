const express = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events with filtering and pagination
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('dateRange').optional().isIn(['today', 'tomorrow', 'weekend', 'custom']),
  query('priceRange').optional().isArray(),
  query('distance').optional().isFloat({ min: 0, max: 100 }),
  query('eventTypes').optional().isArray(),
  query('vibe').optional().isArray(),
  query('place').optional().isString(),
  query('freeOnly').optional().isBoolean(),
  query('latitude').optional().isFloat(),
  query('longitude').optional().isFloat()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      dateRange,
      priceRange,
      distance,
      eventTypes,
      vibe,
      place,
      freeOnly,
      latitude,
      longitude
    } = req.query;

    let query = db('events')
      .select(
        'events.*',
        'venues.name as venue_name',
        'venues.logo_url as venue_logo',
        'venues.address as venue_address',
        'venues.city as venue_city',
        'venues.state as venue_state'
      )
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.is_active', true)
      .where('events.status', 'active');

    // Search filter
    if (search) {
      query = query.where(function() {
        this.where('events.title', 'ilike', `%${search}%`)
          .orWhere('events.description', 'ilike', `%${search}%`)
          .orWhere('venues.name', 'ilike', `%${search}%`)
          .orWhereRaw("events.tags::text ilike ?", [`%${search}%`]);
      });
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekend = new Date(now);
      weekend.setDate(weekend.getDate() + (6 - weekend.getDay()));

      switch (dateRange) {
        case 'today':
          query = query.where('events.start_date', '>=', now.toISOString().split('T')[0]);
          break;
        case 'tomorrow':
          query = query.where('events.start_date', '>=', tomorrow.toISOString().split('T')[0]);
          break;
        case 'weekend':
          query = query.where('events.start_date', '>=', weekend.toISOString().split('T')[0]);
          break;
      }
    }

    // Price range filter
    if (priceRange && priceRange.length > 0) {
      query = query.whereIn('events.price_range', priceRange);
    }

    // Free only filter
    if (freeOnly === 'true') {
      query = query.where('events.price', 0);
    }

    // Event types filter
    if (eventTypes && eventTypes.length > 0) {
      query = query.whereRaw("events.event_types && ?::jsonb", [JSON.stringify(eventTypes)]);
    }

    // Vibe filter
    if (vibe && vibe.length > 0) {
      query = query.whereRaw("events.vibe && ?::jsonb", [JSON.stringify(vibe)]);
    }

    // Place filter - search by venue name, city, or address
    if (place) {
      query = query.where(function() {
        this.where('venues.name', 'ilike', `%${place}%`)
          .orWhere('venues.city', 'ilike', `%${place}%`)
          .orWhere('venues.address', 'ilike', `%${place}%`)
          .orWhere('venues.state', 'ilike', `%${place}%`)
          .orWhere('events.city', 'ilike', `%${place}%`)
          .orWhere('events.address', 'ilike', `%${place}%`);
      });
    }

    // Distance filter (if coordinates provided)
    if (latitude && longitude && distance) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const dist = parseFloat(distance);
      
      // Haversine formula for distance calculation
      query = query.whereRaw(`
        (6371 * acos(cos(radians(?)) * cos(radians(events.latitude)) * 
         cos(radians(events.longitude) - radians(?)) + 
         sin(radians(?)) * sin(radians(events.latitude)))) <= ?
      `, [lat, lng, lat, dist]);
    }

    // Order by trending score and date
    query = query.orderBy('events.trending_score', 'desc')
      .orderBy('events.start_date', 'asc');

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const events = await query;

    // Get total count for pagination
    const countQuery = db('events')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.is_active', true)
      .where('events.status', 'active');

    // Apply same filters to count query
    if (search) {
      countQuery.where(function() {
        this.where('events.title', 'ilike', `%${search}%`)
          .orWhere('events.description', 'ilike', `%${search}%`)
          .orWhere('venues.name', 'ilike', `%${search}%`)
          .orWhereRaw("events.tags::text ilike ?", [`%${search}%`]);
      });
    }

    // Date range filter for count query
    if (dateRange) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekend = new Date(now);
      weekend.setDate(weekend.getDate() + (6 - weekend.getDay()));

      switch (dateRange) {
        case 'today':
          countQuery.where('events.start_date', '>=', now.toISOString().split('T')[0]);
          break;
        case 'tomorrow':
          countQuery.where('events.start_date', '>=', tomorrow.toISOString().split('T')[0]);
          break;
        case 'weekend':
          countQuery.where('events.start_date', '>=', weekend.toISOString().split('T')[0]);
          break;
      }
    }

    // Price range filter for count query
    if (priceRange && priceRange.length > 0) {
      countQuery.whereIn('events.price_range', priceRange);
    }

    // Free only filter for count query
    if (freeOnly === 'true') {
      countQuery.where('events.price', 0);
    }

    // Event types filter for count query
    if (eventTypes && eventTypes.length > 0) {
      countQuery.whereRaw("events.event_types && ?::jsonb", [JSON.stringify(eventTypes)]);
    }

    // Vibe filter for count query
    if (vibe && vibe.length > 0) {
      countQuery.whereRaw("events.vibe && ?::jsonb", [JSON.stringify(vibe)]);
    }

    // Place filter for count query
    if (place) {
      countQuery.where(function() {
        this.where('venues.name', 'ilike', `%${place}%`)
          .orWhere('venues.city', 'ilike', `%${place}%`)
          .orWhere('venues.address', 'ilike', `%${place}%`)
          .orWhere('venues.state', 'ilike', `%${place}%`)
          .orWhere('events.city', 'ilike', `%${place}%`)
          .orWhere('events.address', 'ilike', `%${place}%`);
      });
    }

    const totalCount = await countQuery.count('* as count').first();

    // Add distance to events if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      events.forEach(event => {
        if (event.latitude && event.longitude) {
          event.distance = calculateDistance(lat, lng, event.latitude, event.longitude);
        }
      });
    }

    // Track analytics if user is authenticated
    if (req.user) {
      await trackEventSearch(req.user.userId, {
        search,
        filters: { dateRange, priceRange, distance, eventTypes, vibe, freeOnly, place },
        resultsCount: events.length
      });
    }

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting events' 
    });
  }
});

// Get single event by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await db('events')
      .select(
        'events.*',
        'venues.name as venue_name',
        'venues.logo_url as venue_logo',
        'venues.address as venue_address',
        'venues.city as venue_city',
        'venues.state as venue_state',
        'venues.website_url as venue_website',
        'venues.facebook_url as venue_facebook',
        'venues.instagram_url as venue_instagram'
      )
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.id', id)
      .where('events.is_active', true)
      .first();

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found' 
      });
    }

    // Increment view count
    await db('events')
      .where({ id })
      .increment('total_views', 1);

    // Track analytics if user is authenticated
    if (req.user) {
      await trackEventView(req.user.userId, event.id, event.title);
    }

    res.json({ event });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting event' 
    });
  }
});

// Save/unsave event
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Check if event exists
    const event = await db('events').where({ id }).first();
    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found' 
      });
    }

    // Check if already saved
    const existingSave = await db('user_saved_events')
      .where({ user_id: userId, event_id: id })
      .first();

    if (existingSave) {
      // Unsave event
      await db('user_saved_events')
        .where({ user_id: userId, event_id: id })
        .del();

      // Decrement save count
      await db('events')
        .where({ id })
        .decrement('total_saves', 1);

      res.json({ 
        message: 'Event unsaved successfully',
        saved: false
      });
    } else {
      // Save event
      await db('user_saved_events').insert({
        user_id: userId,
        event_id: id,
        saved_at: new Date()
      });

      // Increment save count
      await db('events')
        .where({ id })
        .increment('total_saves', 1);

      res.json({ 
        message: 'Event saved successfully',
        saved: true
      });
    }

    // Track analytics
    await trackEventSave(userId, id, event.title, !existingSave);

  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ 
      error: 'Internal server error saving event' 
    });
  }
});

// Get trending events
router.get('/trending/events', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const trendingEvents = await db('events')
      .select(
        'events.*',
        'venues.name as venue_name',
        'venues.logo_url as venue_logo'
      )
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.is_active', true)
      .where('events.status', 'active')
      .where('events.is_trending', true)
      .orderBy('events.trending_score', 'desc')
      .limit(limit);

    res.json({ events: trendingEvents });

  } catch (error) {
    console.error('Get trending events error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting trending events' 
    });
  }
});

// Get friends' activity
router.get('/friends/activity', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 5 } = req.query;

    // Get friends' saved events (mock implementation)
    const friendsActivity = await db('user_saved_events')
      .select(
        'user_saved_events.*',
        'events.title as event_title',
        'events.cover_image_url',
        'users.name as friend_name'
      )
      .join('events', 'user_saved_events.event_id', 'events.id')
      .join('users', 'user_saved_events.user_id', 'users.id')
      .where('user_saved_events.user_id', '!=', userId)
      .where('events.is_active', true)
      .orderBy('user_saved_events.saved_at', 'desc')
      .limit(limit);

    res.json({ friendsActivity });

  } catch (error) {
    console.error('Get friends activity error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting friends activity' 
    });
  }
});

// Get saved events for a user
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const savedEvents = await db('saved_events')
      .select('events.*', 'venues.name as venue_name')
      .join('events', 'saved_events.event_id', 'events.id')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('saved_events.user_id', req.user.id)
      .where('events.is_active', true)
      .orderBy('events.start_date', 'asc');

    res.json(savedEvents);
  } catch (error) {
    console.error('Error fetching saved events:', error);
    res.status(500).json({ error: 'Failed to fetch saved events' });
  }
});

// Purchase tickets for an event
router.post('/:id/purchase-tickets', authenticateToken, [
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
  body('purchaseMethod').isIn(['venue', 'platform']).withMessage('Purchase method must be venue or platform'),
  body('paymentMethodId').optional().isString().withMessage('Payment method ID required for platform purchases')
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
    const { quantity, purchaseMethod, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await db('events')
      .select('events.*', 'venues.name as venue_name', 'venues.website_url as venue_website')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.id', id)
      .first();
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found',
        message: 'The event you are trying to purchase tickets for could not be found.'
      });
    }

    // Check if event is sold out
    if (event.capacity && event.current_attendees + quantity > event.capacity) {
      return res.status(400).json({ 
        success: false,
        error: 'Event sold out',
        message: 'This event is sold out or does not have enough tickets available.'
      });
    }

    let purchaseResult;
    
    if (purchaseMethod === 'venue') {
      // Purchase through venue
      purchaseResult = {
        success: true,
        method: 'venue',
        message: 'Redirecting to venue for ticket purchase',
        venueUrl: event.venue_website || event.ticket_url,
        event: {
          id: event.id,
          title: event.title,
          price: event.price,
          venue: event.venue_name
        },
        purchaseDetails: {
          quantity,
          totalPrice: event.price * quantity,
          currency: 'USD'
        }
      };
    } else if (purchaseMethod === 'platform') {
      // Purchase through our platform
      if (!paymentMethodId) {
        return res.status(400).json({
          success: false,
          error: 'Payment method required',
          message: 'Payment method is required for platform purchases.'
        });
      }

      // Calculate total amount (including platform fee)
      const ticketPrice = event.price * 100; // Convert to cents
      const platformFee = Math.round(ticketPrice * 0.05); // 5% platform fee
      const totalAmount = (ticketPrice + platformFee) * quantity;

      // Create payment intent (mock implementation - would integrate with Stripe)
      const paymentIntent = {
        id: require('uuid').v4(),
        amount: totalAmount,
        currency: 'usd',
        status: 'succeeded' // Mock successful payment
      };

      if (paymentIntent.status === 'succeeded') {
        // Update event attendance
        await db('events').where('id', id).increment('current_attendees', quantity);
        
        // Create ticket record
        const ticketId = require('uuid').v4();
        await db('tickets').insert({
          id: ticketId,
          user_id: userId,
          event_id: id,
          quantity,
          total_amount: totalAmount / 100,
          platform_fee: platformFee / 100,
          payment_intent_id: paymentIntent.id,
          status: 'confirmed',
          created_at: new Date()
        });

        purchaseResult = {
          success: true,
          method: 'platform',
          message: 'Tickets purchased successfully through our platform!',
          ticketId,
          event: {
            id: event.id,
            title: event.title,
            price: event.price,
            venue: event.venue_name
          },
          purchaseDetails: {
            quantity,
            totalPrice: totalAmount / 100,
            platformFee: platformFee / 100,
            currency: 'USD'
          },
          paymentDetails: {
            paymentIntentId: paymentIntent.id,
            status: 'confirmed'
          }
        };
      } else {
        return res.status(400).json({
          success: false,
          error: 'Payment failed',
          message: 'Payment processing failed. Please try again.'
        });
      }
    }

    // Track ticket purchase analytics
    await trackTicketPurchase(userId, id, event.title, quantity, purchaseMethod, purchaseResult.purchaseDetails.totalPrice);

    res.json(purchaseResult);

  } catch (error) {
    console.error('Error purchasing tickets:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to purchase tickets',
      message: 'There was an error processing your ticket purchase. Please try again.'
    });
  }
});

// Get RSVP status for an event
router.get('/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rsvp = await db('rsvps').where({
      user_id: userId,
      event_id: id
    }).first();

    res.json({ 
      status: rsvp ? rsvp.status : null,
      hasRsvp: !!rsvp
    });

  } catch (error) {
    console.error('Error fetching RSVP status:', error);
    res.status(500).json({ error: 'Failed to fetch RSVP status' });
  }
});

// Get RSVP counts for an event
router.get('/:id/rsvp-counts', async (req, res) => {
  try {
    const { id } = req.params;

    const counts = await db('rsvps')
      .select('status')
      .count('* as count')
      .where('event_id', id)
      .groupBy('status');

    const rsvpCounts = {
      going: 0,
      maybe: 0,
      not_going: 0
    };

    counts.forEach(row => {
      rsvpCounts[row.status] = parseInt(row.count);
    });

    res.json(rsvpCounts);

  } catch (error) {
    console.error('Error fetching RSVP counts:', error);
    res.status(500).json({ error: 'Failed to fetch RSVP counts' });
  }
});

// Add event to calendar (sync with device calendar)
router.post('/:id/calendar-sync', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await db('events')
      .select('events.*', 'venues.name as venue_name')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('events.id', id)
      .first();
    
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found',
        message: 'The event you are trying to sync could not be found.'
      });
    }

    // Check if calendar sync already exists
    const existingSync = await db('calendar_syncs').where({
      user_id: userId,
      event_id: id
    }).first();

    if (existingSync) {
      return res.json({ 
        success: true,
        message: 'Event already synced to calendar',
        synced: true,
        syncInfo: {
          syncedAt: existingSync.synced_at,
          createdAt: existingSync.created_at
        },
        event: {
          id: event.id,
          title: event.title,
          startDate: event.start_date,
          venue: event.venue_name,
          description: event.description
        }
      });
    }

    // Create calendar sync record
    const syncId = require('uuid').v4();
    const syncedAt = new Date();
    
    await db('calendar_syncs').insert({
      id: syncId,
      user_id: userId,
      event_id: id,
      synced_at: syncedAt,
      created_at: new Date()
    });

    // Get the created sync record
    const syncRecord = await db('calendar_syncs').where('id', syncId).first();

    // Track calendar sync analytics
    await trackCalendarSync(userId, id, event.title);

    res.json({ 
      success: true,
      message: 'Event synced to calendar successfully',
      synced: true,
      syncInfo: {
        id: syncRecord.id,
        syncedAt: syncRecord.synced_at,
        createdAt: syncRecord.created_at
      },
      event: {
        id: event.id,
        title: event.title,
        startDate: event.start_date,
        venue: event.venue_name,
        description: event.description,
        price: event.price,
        ticketUrl: event.ticket_url
      },
      calendarDetails: {
        eventTitle: event.title,
        startDate: event.start_date,
        endDate: new Date(new Date(event.start_date).getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        location: event.venue_name || event.address,
        description: event.description,
        url: event.ticket_url
      }
    });

  } catch (error) {
    console.error('Error syncing event to calendar:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to sync event to calendar',
      message: 'There was an error syncing the event to your calendar. Please try again.'
    });
  }
});

// Remove event from calendar sync
router.delete('/:id/calendar-sync', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Remove calendar sync record
    await db('calendar_syncs').where({
      user_id: userId,
      event_id: id
    }).del();

    res.json({ 
      message: 'Event removed from calendar sync',
      synced: false
    });

  } catch (error) {
    console.error('Error removing calendar sync:', error);
    res.status(500).json({ error: 'Failed to remove calendar sync' });
  }
});

// Get calendar sync status for an event
router.get('/:id/calendar-sync', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const sync = await db('calendar_syncs').where({
      user_id: userId,
      event_id: id
    }).first();

    res.json({ 
      synced: !!sync,
      syncedAt: sync ? sync.synced_at : null
    });

  } catch (error) {
    console.error('Error fetching calendar sync status:', error);
    res.status(500).json({ error: 'Failed to fetch calendar sync status' });
  }
});

// Get user's synced events
router.get('/calendar-synced', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const syncedEvents = await db('calendar_syncs')
      .select('events.*', 'venues.name as venue_name')
      .join('events', 'calendar_syncs.event_id', 'events.id')
      .leftJoin('venues', 'events.venue_id', 'venues.id')
      .where('calendar_syncs.user_id', userId)
      .where('events.is_active', true)
      .orderBy('events.start_date', 'asc');

    res.json(syncedEvents);

  } catch (error) {
    console.error('Error fetching synced events:', error);
    res.status(500).json({ error: 'Failed to fetch synced events' });
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Analytics tracking functions
async function trackEventSearch(userId, searchData) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: 'event_search',
      properties: searchData,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackEventView(userId, eventId, eventTitle) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: 'event_view',
      event_id: eventId,
      properties: { eventTitle },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackEventSave(userId, eventId, eventTitle, isSaving) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: isSaving ? 'event_save' : 'event_unsave',
      event_id: eventId,
      properties: { eventTitle },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackEventRsvp(userId, eventId, eventTitle, status) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: 'event_rsvp',
      event_id: eventId,
      properties: { eventTitle, status },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackCalendarSync(userId, eventId, eventTitle) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: 'calendar_sync',
      event_id: eventId,
      properties: { eventTitle },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

async function trackTicketPurchase(userId, eventId, eventTitle, quantity, purchaseMethod, totalPrice) {
  try {
    await db('analytics_events').insert({
      user_id: userId,
      event_type: 'ticket_purchase',
      event_id: eventId,
      properties: { eventTitle, quantity, purchaseMethod, totalPrice },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

module.exports = router; 