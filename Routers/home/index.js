const express = require('express');
const router = express.Router();
const homeController = require('../../Controllers/home/HomeController');

// 定義路由
router.post('/post', (req, res, next) => homeController.handleRequest(req, res, next));
// router.get('/get', (req, res, next) => homeController.handleRequest(req, res, next));

module.exports = router;