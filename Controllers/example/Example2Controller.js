const Controller = require("../Controller");
const middleware = require("../../Middlewares");
const example = require("../../Services/example");

class Example2Controller extends Controller {
  getMiddlewares() {
    return [middleware.auth.checkLogin];
  }

  async getOpts(req) {
    // 自訂參數處理邏輯
    let opts = {};
    opts.b = req.params.b;
    return opts;
  }

  async run(opts) {
    // 自訂商業邏輯
    return example.example(opts);
    return opts;
  }
}

module.exports = {
  example2Controller: new Example2Controller(),
};
