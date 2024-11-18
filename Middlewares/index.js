module.exports = {
  apiRateLimit: {
    rateLimiter: require("./apiRateLimit/index").rateLimiter,
  },
  auth: {
    checkLogin: require("./authenticate/index").checkLogin,
  },
};
