const Controller = require("../Controller");
const middleware = require("../../Middlewares");
const example = require("../../Services/example");
const db = require("../../database");
const util = require("../../util.js");
class ExampleController extends Controller {
  getMiddlewares() {
    return [middleware.apiRateLimit.rateLimiter];
  }

  async getOpts(req) {
    // 自訂參數處理邏輯
    console.log("123123", req.user);
    let opts = {};
    opts.a = util.validNumber(req.body.a, 'a');
    opts.b = util.validRequireNumber(req.body.b, 'b');
    return opts;
  }

  async run(opts) {
    // 自訂商業邏輯
    return opts;
    // const member = await knex("Member").select().where("Id", 1);
    // return member;
    // return example.getList(opts);
    // 已測試過的knex語法
    const member = await db()
      .insert({ username: "wade", password: "1234", email: "ewe" })
      .into("Users");
    return member;
  }
}

module.exports = {
  exampleController: new ExampleController(),
};
