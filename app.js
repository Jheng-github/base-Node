const express = require("express");
const { passport } = require("./Middlewares/authenticate/index");
const routes = require("./Routers");
const app = express();
const cors = require("cors");
const { corsConfigs } = require("./dev.config");
const { responseCode } = require("./Constants");
require("dotenv").config();

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport初始化
app.use(passport.initialize());

// 全域CORS
app.use(cors(corsConfigs.default));

// 所有路由增加/api前綴
// 所有的全域middleware 必須在這之前
Object.keys(routes).forEach((routeName) => {
  app.use("/api", routes[routeName]);
});

app.use((error, req, res, next) => {
  console.log("Error response:", error);
  if (
    error.code == responseCode.HTTP_STATUS.BAD_REQUEST ||
    error.code == responseCode.HTTP_STATUS.UNAUTHORIZED
  ) {
    res.status(error.code).json({
      code: error.code,
      data: error.message,
    });
  } else {
    res
      .status(responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json("Internal Server Error:", error);
  }
});
// 啟動伺服器
app.listen(process.env.SERVER_PORT, () => {
  console.log(`伺服器正在 http://localhost:${process.env.SERVER_PORT} 上運行`);
});
