const Controller = require("../Controller");
const jwt = require("jsonwebtoken");
const { responseCode } = require("../../Constants");
require("dotenv").config();

class LoginController extends Controller {
  getMiddlewares() {
    return [];
  }

  async getOpts(req) {
    let opts = {};
    opts.username = req.body.username;
    opts.password = req.body.password;
    return opts;
  }

  async run(opts) {
    // example
    if (opts.username === "admin" && opts.password === 1234) {
      const token = jwt.sign(
        { username: opts.username },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.ACCESS_TOKEN,
        }
      );
      return token;
    } else {
      throw {
        code: responseCode.HTTP_STATUS.UNAUTHORIZED,
        message: "帳號或密碼錯誤",
      };
    }
  }
}

module.exports = {
  LoginController: new LoginController(),
};
