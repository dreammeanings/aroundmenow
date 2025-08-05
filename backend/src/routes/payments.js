const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const stripe = require('../config/stripe');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['2 events/month', 'Basic listing'],
        description: 'Perfect for getting started'
      },
      {
        id: 'lite',
        name: 'Lite',
        price: 1900, // $19.00 in cents
        features: ['Unlimited events', 'Calendar sync', '3 images', 'Website links'],
        description: 'Great for growing venues'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 4900, // $49.00 in cents
        features: ['Everything in Lite', 'Ticket links', 'Featured listings', 'Analytics'],
        description: 'Perfect for established venues'
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 9900, // $99.00 in cents
        features: ['Everything in Pro', 'Push notifications', 'RSVPs', 'Front-page boosts'],
        description: 'For venues serious about growth'
      }
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create subscription
router.post('/create-subscription', authenticateToken, [
  body('tier').isIn(['lite', 'pro', 'elite']).withMessage('Invalid tier'),
  body('paymentMethodId').notEmpty().withMessage('Payment method required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { tier, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Get user from database
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId }
      });
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await db('users').where('id', userId).update({
        stripe_customer_id: stripeCustomerId
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: getTierPriceId(tier) }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user subscription in database
    await db('users').where('id', userId).update({
      subscription_tier: tier,
      subscription_status: 'active',
      subscription_id: subscription.id
    });

    res.json({ 
      subscription,
      message: `Successfully subscribed to ${tier} plan!`
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Purchase ticket
router.post('/purchase-ticket', authenticateToken, [
  body('eventId').notEmpty().withMessage('Event ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethodId').notEmpty().withMessage('Payment method required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { eventId, quantity, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Get event details
    const event = await db('events').where('id', eventId).first();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if event is sold out
    if (event.capacity && event.current_attendees + quantity > event.capacity) {
      return res.status(400).json({ error: 'Event is sold out' });
    }

    // Calculate total amount (including AMN commission)
    const ticketPrice = event.price * 100; // Convert to cents
    const commission = Math.round(ticketPrice * 0.10); // 10% commission
    const totalAmount = (ticketPrice + commission) * quantity;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      customer: req.user.stripe_customer_id,
      payment_method: paymentMethodId,
      metadata: {
        eventId,
        userId,
        quantity: quantity.toString(),
        commission: commission.toString()
      },
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/ticket-confirmation`
    });

    if (paymentIntent.status === 'succeeded') {
      // Update event attendance
      await db('events').where('id', eventId).increment('current_attendees', quantity);
      
      // Create ticket record
      await db('tickets').insert({
        id: require('uuid').v4(),
        user_id: userId,
        event_id: eventId,
        quantity,
        total_amount: totalAmount / 100,
        commission_amount: commission / 100,
        payment_intent_id: paymentIntent.id,
        status: 'confirmed'
      });

      res.json({ 
        paymentIntent,
        message: 'Ticket purchased successfully!'
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }

  } catch (error) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({ error: 'Failed to purchase ticket' });
  }
});

// Get user's current subscription
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    const user = await db('users').where('id', req.user.id).first();
    
    if (!user.subscription_id) {
      return res.json({ subscription: null });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscription_id);
    res.json({ subscription });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const user = await db('users').where('id', req.user.id).first();
    
    if (!user.subscription_id) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    const subscription = await stripe.subscriptions.update(user.subscription_id, {
      cancel_at_period_end: true
    });

    // Update user subscription status
    await db('users').where('id', req.user.id).update({
      subscription_status: 'canceling'
    });

    res.json({ 
      subscription,
      message: 'Subscription will be canceled at the end of the current period'
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions
function getTierPriceId(tier) {
  const priceIds = {
    lite: process.env.STRIPE_LITE_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
    elite: process.env.STRIPE_ELITE_PRICE_ID
  };
  return priceIds[tier];
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for invoice:', invoice.id);
  // Update subscription status in database
  await db('users')
    .where('stripe_customer_id', invoice.customer)
    .update({ subscription_status: 'active' });
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for invoice:', invoice.id);
  // Update subscription status in database
  await db('users')
    .where('stripe_customer_id', invoice.customer)
    .update({ subscription_status: 'past_due' });
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  // Update subscription status in database
  await db('users')
    .where('subscription_id', subscription.id)
    .update({ 
      subscription_status: 'canceled',
      subscription_tier: 'free'
    });
}

module.exports = router; 