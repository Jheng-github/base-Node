# base-Node


## 檔案說明

### Controllers/Controller.js

基礎介面類別
`Controller.js` 是一個基礎控制器類別，包含以下方法：
- `getMiddlewares()`: 返回中介軟體陣列，預設為空。
- `getOpts(req)`: 處理請求參數，預設為空。
- `run(opts)`: 執行商業邏輯，預計最少要實作這個，否則噴錯。
- `handleRequest(req, res, next)`: 處理請求，依序執行中介軟體並捕捉錯誤。

### Controllers/homeController.js

範例控制器 `homeController.js` 包含以下方法：
`homeController.js` 繼承自 `Controller.js`，並覆蓋了部分方法：
- `getMiddlewares()`: 返回特定的中介軟體陣列。
- `getOpts(req)`: 自訂request參數驗證邏輯。

### Services/home/index.js

包含了商業邏輯，並將其封裝在一個服務類別中。

### Middleware

`Middleware` 目錄包含了中介軟體函數，這些函數可以在控制器的 `handleRequest` 方法中被調用。

### Routers/Login/home.js

`home.js` 定義了路由，並將請求委派給 `homeController`：
- `router.post('/', (req, res, next) => homeController.handleRequest(req, res, next))`:

### app.js

`app.js` 是應用程式的入口文件，設置了中介軟體和路由。

## 流程說明

1. 當請求到達時，`app.js` 會將請求委派給對應的路由處理器。
2. 路由處理器會調用對應控制器的 `handleRequest` 方法。
3. `handleRequest` 方法會依序執行中介軟體函數，並捕捉任何錯誤。
4. 如果所有中介軟體函數都成功執行，`handleRequest` 會調用 `getOpts` 和 `run` 方法來處理請求並返回結果。
5. 如果中介軟體或商業邏輯中發生錯誤，錯誤會被捕捉並傳遞給 Express 的錯誤處理機制。
```javascript
 error example : throw {
  code: 400,
  message: 'error message'
}
```

## 啟動應用程式

```bash
node index.js