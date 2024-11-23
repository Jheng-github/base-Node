const express = require("express");
const { passport } = require("./Middlewares/authenticate/index");
const routes = require("./Routers");
const app = express();
const port = 3000;
const cors = require("cors");
const corsOptions = require("./cors.Config");
const { responseCode } = require("./Constants");

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport初始化
app.use(passport.initialize());

// 全域應用 CORS 設定，使用經過更新的動態驗證邏輯
app.use(cors(corsOptions.default));

// 所有路由增加/api前綴
Object.keys(routes).forEach((routeName) => {
  console.log("routeName", routeName);

  app.use("/api", routes[routeName]);
});

// 全域錯誤處理中介軟體
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
    res.status(responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      code: responseCode.HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});
