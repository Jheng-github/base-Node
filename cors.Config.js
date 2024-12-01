require("dotenv").config();

const corsConfigs = {
  // 只開放特定網域
  // 有特別檢查是不是開發環境，如果是開發環境origin不存在也可以打(postman 測試時)
  default: {
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(",");
      const isAllowed =
        process.env.NODE_ENV === "development"
          ? allowedOrigins.includes(origin) || !origin
          : allowedOrigins.includes(origin);

      isAllowed
        ? callback(null, true)
        : callback(new Error("此網域目前不被允許"));
    },
  },
  // 開放所有網域
  open: {
    origin: "*",
  },
};

module.exports = corsConfigs;
