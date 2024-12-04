require("dotenv").config();

module.exports = {
  // 開發環境
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      max: 100,
      min: 10,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  // 正式環境
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      max: 100,
      min: 10,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  corsConfigs: {
    /**
     * .env若有設定cors, postman header要加上origin 反則之
     */
    default: {
      origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(",");
        const isAllowed =
          process.env.NODE_ENV === "development"
            ? allowedOrigins.includes(origin) || !origin
            : allowedOrigins.includes(origin);

        isAllowed
          ? callback(null, true)
          : callback({
              code: 401,
              message: "此網域目前不被允許",
            });
      },
    },
  },
};
