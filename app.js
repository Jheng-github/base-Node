const express = require('express');
const routes = require('./Routers');
const app = express();
const port = 3000;

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 所有路由增加/api前綴
Object.keys(routes).forEach(routeName => {
  console.log('routeName', routeName);
  
  app.use('/api', routes[routeName]);
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});