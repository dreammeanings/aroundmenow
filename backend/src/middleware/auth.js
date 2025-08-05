const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token' 
      });
    }

    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

const requireVenueOwner = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    // Check if user is a venue owner
    const user = await db('users').where({ id: userId }).first();
    
    if (!user || !user.is_venue_owner) {
      return res.status(403).json({ 
        error: 'Venue owner access required' 
      });
    }

    next();
  } catch (error) {
    console.error('Venue owner check error:', error);
    res.status(500).json({ 
      error: 'Internal server error checking venue owner status' 
    });
  }
};

const requireSubscription = (tier) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.user;
      
      const user = await db('users').where({ id: userId }).first();
      
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      const subscriptionTiers = ['Free', 'Lite', 'Pro', 'Elite'];
      const userTierIndex = subscriptionTiers.indexOf(user.subscription_tier);
      const requiredTierIndex = subscriptionTiers.indexOf(tier);

      if (userTierIndex < requiredTierIndex) {
        return res.status(403).json({ 
          error: `${tier} subscription required` 
        });
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({ 
        error: 'Internal server error checking subscription' 
      });
    }
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireVenueOwner,
  requireSubscription
}; 