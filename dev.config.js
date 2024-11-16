require("dotenv").config();

const knexConfig = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: 3306,
  },
};

module.exports = {
  knexConfig,
};
