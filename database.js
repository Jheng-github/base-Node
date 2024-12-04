require("dotenv").config();
const knex = require("knex");
const dbConfig = require("./dev.config"); // 你需要根據實際路徑修改

// 抓取script的環境變數，如果沒有就使用development
const environment = process.env.NODE_ENV || "development";

const config = dbConfig[environment];

const db = knex(config);

module.exports = db;
