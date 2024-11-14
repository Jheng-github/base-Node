const rateLimiter = (req, res, next) => {
  // TODO: Implement rate limiter
  console.log('rateLimiter');
  next();
};

module.exports = {
  rateLimiter
};