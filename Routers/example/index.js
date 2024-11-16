const express = require("express");
const router = express.Router();
const example = require("../../Controllers/example");


// 定義路由
router.post("/post", (req, res, next) =>
  example.exampleController.handleRequest(req, res, next)
);
router.get("/get/:user/:book", (req, res, next) =>
  example.example2Controller.handleRequest(req, res, next)
);

module.exports = router;
