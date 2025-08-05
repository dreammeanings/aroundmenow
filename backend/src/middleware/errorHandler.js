const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation failed';
    error.details = err.details;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.status = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.status = 401;
    error.message = 'Token expired';
  }

  // Database errors
  if (err.code === '23505') { // Unique constraint violation
    error.status = 409;
    error.message = 'Resource already exists';
  }

  if (err.code === '23503') { // Foreign key violation
    error.status = 400;
    error.message = 'Invalid reference';
  }

  // Rate limiting errors
  if (err.status === 429) {
    error.status = 429;
    error.message = 'Too many requests';
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    details: error.details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = { errorHandler }; 