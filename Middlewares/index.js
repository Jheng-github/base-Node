module.exports = {
  apiRateLimit: {
    rateLimiter: require("./apiRateLimit/index").rateLimiter,
  },
  auth: {
    checkLogin: require("./authenticate/index").checkLogin,
  },
  handler: {
    errorHandler: require("./errorHandler/index").errorHandler,
  }
};
