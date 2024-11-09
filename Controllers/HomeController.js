const Controller = require('./Controller');

class HomeController extends Controller {
  middleware(req, res, next) {
    // 自訂中介軟體邏輯
    console.log('HomeController middleware');
    next();
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