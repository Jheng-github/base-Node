const Controller = require("../Controller");
const middleware = require("../../Middlewares");
const example = require("../../Services/example");
const knex = require("../../knexfile");

class ExampleController extends Controller {
  getMiddlewares() {
    return [
      middleware.apiRateLimit.rateLimiter,
      middleware.auth.secondMiddleware,
    ];
  }

  async getOpts(req) {
    // 自訂參數處理邏輯
    console.log("123123", req.body);
    let opts = {};
    opts.a = req.body.a;
    opts.b = req.body.b;
    return opts;
  }

  async run(opts) {
    // 自訂商業邏輯
    const member = await knex("Member").select().where("Id", 1);
    return member;
    return example.getList(opts);
    return opts;
  }
}

module.exports = {
  exampleController: new ExampleController(),
};
