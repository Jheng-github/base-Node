const Controller = require("../Controller");
const middleware = require("../../Middlewares");
const example = require("../../Services/example");
const db = require("../../database");
const util = require("../../util.js");

/**
 * @swagger
 * tags:
 *   name: Example
 *   description: 範例controller
 */

  /**
   * @swagger
   * /api/example/post:
   *   post:
   *     summary: 範例controller
   *     tags: [Example]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - b
   *             properties:
   *               a:
   *                 type: number
   *                 description: 參數 A(必填在required要寫)
   *                 example: 1
   *               b:
   *                 type: number
   *                 description: 參數 B
   *                 example: 2
   *     responses:
   *       200:
   *         description: 成功創建數據
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 code:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: object
   *                   properties:
   *                     a:
   *                       type: number
   *                     b:
   *                       type: number
   *       400:
   *         description: 請求參數錯誤
   *       429:
   *         description: 請求頻率過高
   */
class ExampleController extends Controller {
  rateLimiter() {
    return {
      seconds: 5, // 5 秒
      max: 2,
      message: {
        message:
          "Too many requests from this IP, please try again after 5 seconds",
      },
    };
  }

  getMiddlewares() {
    return [middleware.example.example];
  }

  async getOpts(req) {
    // 自訂參數處理邏輯
    console.log("123123", req.user);
    let opts = {};
    opts.a = util.validNumber(req.body.a, "a");
    opts.b = util.validRequireNumber(req.body.b, "b");
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
      .insert({ username: "jheng", password: "1234", email: "ewe" })
      .into("Users");
    return member;
  }
}

module.exports = {
  exampleController: new ExampleController(),
};
