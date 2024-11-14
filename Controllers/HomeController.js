const Controller = require('./Controller');
const middleware = require('../Middleware');


class HomeController extends Controller {
  getMiddlewares() {
    return [
      middleware.apiRateLimit.rateLimiter,
      middleware.auth.secondMiddleware
    ];
  }

  getOpts(req) {
    // 自訂參數處理邏輯
    console.log('123123',req.body);
    let opts = {};
    opts.a = req.body.a;
    opts.b = req.body.b;
    return opts;
  }

  run(opts) {
    // 自訂商業邏輯
    return opts;
    
    // res.send(`Hello World! Params: ${JSON.stringify(opts)}`);
  }
}

module.exports = new HomeController();