module.exports = {
  apiRateLimit: {
    rateLimiter: require("./apiRateLimit/index").rateLimiter,
  },
  auth: {
    logTimestamp: require("./auth/index").logTimestamp,
    secondMiddleware: require("./auth/index").secondMiddleware,
  },
  auth: {
    checkLogin: require("./authenticate/index").checkLogin,
  },
};
