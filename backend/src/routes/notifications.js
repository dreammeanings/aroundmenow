const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Send push notification
router.post('/send', [
  body('title').notEmpty(),
  body('body').notEmpty(),
  body('user_id').optional().isUUID(),
  body('event_id').optional().isUUID(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, body, user_id, event_id } = req.body;

    // Store notification in database
    await db('notifications').insert({
      user_id,
      event_id,
      title,
      body,
      type: 'push',
      sent_at: new Date()
    });

    res.json({ 
      message: 'Notification sent successfully' 
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      error: 'Internal server error sending notification' 
    });
  }
});

// Get notification settings
router.get('/settings', async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      settings: user.notification_settings
    });

  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ 
      error: 'Internal server error getting notification settings' 
    });
  }
});

// Update notification settings
router.put('/settings', [
  body('push').optional().isBoolean(),
  body('email').optional().isBoolean(),
  body('weeklyDigest').optional().isBoolean(),
  body('calendarSync').optional().isBoolean(),
  body('eventReminders').optional().isBoolean(),
  body('friendActivity').optional().isBoolean(),
  body('geofenceAlerts').optional().isBoolean(),
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
    const updateData = req.body;

    const currentUser = await db('users').where({ id: userId }).first();
    const currentSettings = currentUser.notification_settings || {};

    const updatedSettings = {
      ...currentSettings,
      ...updateData
    };

    await db('users')
      .where({ id: userId })
      .update({
        notification_settings: updatedSettings,
        updated_at: new Date()
      });

    res.json({ 
      message: 'Notification settings updated successfully',
      settings: updatedSettings
    });

  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ 
      error: 'Internal server error updating notification settings' 
    });
  }
});

module.exports = router; 