const {responseCode} = require("../Constants");
const INITIAL_MIDDLEWARE_INDEX = 0; // 定義初始middleware索引值
class Controller {
  getMiddlewares() {
    return [];
  }

  getOpts(req) {
    // 預設參數處理方法，可以在具體控制器中覆蓋
    return {};
  }

  run(req, res) {
    // 預設商業邏輯方法，需要在具體控制器中實作, 沒實作預計會拋出錯誤
    throw new Error("需實作run方法");
  }

  handleRequest(req, res, next) {
    const middlewares = this.getMiddlewares();
    let index = INITIAL_MIDDLEWARE_INDEX;

    const nextMiddleware = (err) => {
      try {
        if (err) return next(err);
        if (index >= middlewares.length) {
          const opts = this.getOpts(req);
          const result = this.run(opts);
          res.status(responseCode.HTTP_STATUS.SUCCESS).json({
            code: response.HTTP_STATUS.SUCCESS,
            data: result,
          });
        } else {
          const middleware = middlewares[index];
          index++;
          // 依序執行middleware
          middleware(req, res, nextMiddleware);
        }
      } catch (error) {
        console.log("Error response:", error);
        if (error.code == responseCode.HTTP_STATUS.BAD_REQUEST || error.code == responseCode.HTTP_STATUS.UNAUTHORIZED) {
          res.status(error.code).json({
            code: error.code,
            data: error.message,
          });
        } else {
          res.status(responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR).json("Internal Server Error:", error);
        }
      }
    };

    nextMiddleware(0);
  }
}

module.exports = Controller;
