// 載入 mysql 客戶端
const mysql = require("mysql");
require("dotenv").config();


// 創建與 MySQL 伺服器的連接
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // MySQL 伺服器位址
  user: process.env.DB_USER, // MySQL 用戶名
  password: process.env.MYSQL_ROOT_PASSWORD, // MySQL 密碼
  port : process.env.DB_PORT
});

// 連接到 MySQL 伺服器
connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// 創建資料庫的 SQL 語句
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`;

// 執行創建資料庫的 SQL 指令
connection.query(createDatabaseQuery, () => {
  console.log(`Database ${process.env.DB_DATABASE} created successfully`);

  // 關閉連接，釋放連接資源
  connection.end();
});
