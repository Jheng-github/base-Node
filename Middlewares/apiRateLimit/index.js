const rateLimit = require("express-rate-limit");

// 單例
const rateLimiterCache = {};

function getRateLimiter(config) {
  const cacheKey = JSON.stringify(config);

  if (rateLimiterCache[cacheKey]) {
    return rateLimiterCache[cacheKey];
  }

  const limiter = rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    handler: (req, res, next) => {
      const err = new Error();
      err.code = 429;
      err.message = config.message;
      next(err);
    },
  });

  // limiter本身非議步函數，其包裝成Promise
  rateLimiterCache[cacheKey] = (req, res) => {
    return new Promise((resolve, reject) => {
      limiter(req, res, (err) => {
        if (err) {
          // err來自 覆寫handler
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  return rateLimiterCache[cacheKey];
}

module.exports = {
  getRateLimiter,
};
