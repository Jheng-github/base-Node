const Controller = require('../Controller');
const middleware = require('../../Middlewares');
const example = require('../../Services/example');

class Example2Controller extends Controller {
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
    opts = req.params;
    console.log('opts',opts);
    opts.b = req.body.b;
    
    return opts;
  }

  run(opts) {
    // 自訂商業邏輯
    return example.example(opts);
    return opts;
  }
}

module.exports = {
  example2Controller: new Example2Controller(),
};