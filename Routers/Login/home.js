const express = require('express');
const router = express.Router();
const homeController = require('../../Controllers/homeController');

// 定義路由
router.post('/', (req, res, next) => homeController.handleRequest(req, res, next));

module.exports = router;