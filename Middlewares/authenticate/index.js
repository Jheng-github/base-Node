const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { responseCode } = require("../../Constants");
require("dotenv").config();

// Header Authorization 提出 Bearer Token
// Authorization: Bearer <JWT>
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

// 「定義規則」讓 Passport 知道如何解析 JWT 和驗證用戶的身份。
//  username: 需與 jwt.sign() 的 第一個參數一致
function jwtTokenParser() {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      console.log("jwtPayload:", jwtPayload);
      const user = {
        username: jwtPayload.username,
        iat: jwtPayload.iat,
        exp: jwtPayload.exp,
      };
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
}

jwtTokenParser();

// 檢查用戶是否登入
function checkLogin(req, res, next) {
  // user 是由 jwtTokenParser() 設定的
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // TODO: 未來可以在這邊解決 token 相關問題, 例如: 刷新 token
    if (err) {
      console.log("Middleware checkLogin:", err);
      return next(err);
    }
    if (!user) {
      throw {
        code: responseCode.HTTP_STATUS.UNAUTHORIZED,
        message: "Unauthorized",
      };
    }
    console.log("login user:", user);
    req.user = user;
    return next();
  })(req, res, next);
}

module.exports = {
  passport,
  jwtTokenParser,
  checkLogin,
};
