const { responseCode } = require("../Constants");
const { getRateLimiter } = require("../Middlewares/apiRateLimit");

const INITIAL_MIDDLEWARE_INDEX = 0; // 定義初始middleware索引值
class Controller {
  rateLimiter() {
    return {};
  }

  getMiddlewares() {
    return [];
  }

  getOpts(req, defaultOpts) {
    // 預設參數處理方法，可以在具體控制器中覆蓋
    return {};
  }

  run(req, res) {
    // 預設商業邏輯方法，需要在具體控制器中實作, 沒實作預計會拋出錯誤
    throw new Error("需實作run方法");
  }

  async handleRequest(req, res, next) {
    const rateLimiterConfig = this.rateLimiter();
    if (rateLimiterConfig) {
      const limiter = getRateLimiter(rateLimiterConfig);
      try {
        await limiter(req, res);
      } catch (err) {
        return next(err);
      }
    }

    const middlewares = this.getMiddlewares();
    let index = INITIAL_MIDDLEWARE_INDEX;
    const nextMiddleware = async (err) => {
      try {
        if (err) return next(err);
        if (index >= middlewares.length) {
          // TODO: 若有需要, req.user是token解析後的資料, 可以在去db撈出操作者資料做其他應用
          const opts = await this.getOpts(req, req.user);
          const result = await this.run(opts);
          res.status(responseCode.HTTP_STATUS.SUCCESS).json({
            code: responseCode.HTTP_STATUS.SUCCESS,
            data: result,
          });
        } else {
          const middleware = middlewares[index];
          index++;
          // 依序執行middleware, 遞迴呼叫進next, 直到middleware執行完畢
          middleware(req, res, nextMiddleware);
        }
      } catch (error) {
        // 進入app.js error handler
        next(error);
      }
    };

    nextMiddleware(0);
  }
}

module.exports = Controller;
