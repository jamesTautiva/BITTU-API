// Central error handler
module.exports = (err, req, res, next) => {
  // Enhanced logging with context
  if (process.env.NODE_ENV === 'development') {
    console.error('=== ERROR ===');
    console.error('Status:', err.status || 500);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    console.error('URL:', req.url);
    console.error('Method:', req.method);
  } else {
    // Production: minimal logging
    console.error(`[${new Date().toISOString()}] ${err.status || 500} - ${err.message} - ${req.url}`);
  }

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'Internal Server Error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
