const express = require("express");
const router = express.Router();
const { login } = require("../../Controllers");

// 定義路由
router.post("/login", (req, res, next) =>
  login.LoginController.handleRequest(req, res, next)
);

module.exports = router;
