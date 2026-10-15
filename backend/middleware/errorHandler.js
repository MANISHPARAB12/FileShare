function errorHandler(err, req, res, next) {
  console.error('Request error:', err);
  if (res.headersSent) return next(err);

  if (err.name === 'MulterError') {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ success: false, message: err.message });
  }

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Request failed. Check the server logs.'
      : (err.message || 'Internal server error.'),
  });
}

module.exports = errorHandler;
