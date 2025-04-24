const express = require("express");
const { passport } = require("./Middlewares/authenticate/index");
const routes = require("./Routers");
const app = express();
const cors = require("cors");
const { corsConfigs } = require("./dev.config");
const { responseCode } = require("./Constants");
const { handler } = require("./Middlewares");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require("dotenv").config();

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// passport初始化
app.use(passport.initialize());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 全域CORS
app.use(cors(corsConfigs.default));

// 所有路由增加/api前綴
// 所有的全域middleware 必須在這之前
Object.keys(routes).forEach((routeName) => {
  app.use("/api", routes[routeName]);
});

app.use(handler.errorHandler);
// 啟動伺服器
app.listen(process.env.SERVER_PORT, () => {
  console.log(`伺服器正在 http://localhost:${process.env.SERVER_PORT} 上運行`);
  console.log(`Swagger 文檔可在 http://localhost:${process.env.SERVER_PORT}/api-docs 查看`);
});
