const knex = require("knex");
const knexfile = require("./knexfile"); // 你需要根據實際路徑修改

//後續有需要可以在這裡加入其他環境的設定ex. production的
const config = knexfile["development"];

const db = knex(config);

module.exports = db;
