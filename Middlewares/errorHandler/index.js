const { responseCode } = require("../../Constants");

function errorHandler(error, req, res, next) {
  console.log("錯誤訊息", error);

  if (
    error.code == responseCode.HTTP_STATUS.BAD_REQUEST ||
    error.code == responseCode.HTTP_STATUS.UNAUTHORIZED ||
    error.code == responseCode.HTTP_STATUS.RATE_LIMIT
  ) {
    return res.status(error.code).json({
      code: error.code,
      data: error.message,
    });
  } else {
    return res.status(responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      code: responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { errorHandler };
