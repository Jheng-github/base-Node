const express = require("express");
const router = express.Router();
const { example } = require("../../Controllers");

// 定義路由
router.post("/example/post", (req, res, next) =>
  example.exampleController.handleRequest(req, res, next)
);
router.get("/example/get/:user/:book", (req, res, next) =>
  example.example2Controller.handleRequest(req, res, next)
);

module.exports = router;
