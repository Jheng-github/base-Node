module.exports = {
  example: {
    example: require("./example/index").example,
  },
  auth: {
    checkLogin: require("./authenticate/index").checkLogin,
  },
  handler: {
    errorHandler: require("./errorHandler/index").errorHandler,
  }
};
