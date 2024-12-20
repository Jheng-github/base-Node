# base-Node


## 檔案說明

### Controllers/Controller.js

基礎介面類別
`Controller.js` 是一個基礎控制器類別，包含以下方法：
- `getMiddlewares()`: 返回中介軟體陣列，預設為空。
- `getOpts(req)`: 處理請求參數，預設為空。
- `run(opts)`: 執行商業邏輯，預計最少要實作這個，否則噴錯。
- `handleRequest(req, res, next)`: 處理請求，依序執行中介軟體並捕捉錯誤。

### Controllers/exampleController.js

範例控制器 `exampleController.js` 包含以下方法：
`exampleController.js` 繼承自 `Controller.js`，並覆蓋了部分方法：
- `getMiddlewares()`: 返回特定的中介軟體陣列。
- `getOpts(req)`: 自訂request參數驗證邏輯。

### Services/index.js

`Services/index.js` 包含了所有服務類別的引用，並將其封裝在一個物件中。

### Services/example/index.js

`Services/example/index.js` 定義了api實作邏輯，並將其封裝在一個服務類別中。

### Models/index.js

`Models/index.js` 針對一些SQL語句進行封裝，並將其封裝在一個物件中。

### util

`util` 更廣泛有機會使用在各大商業邏輯裡面的函數。

### Middleware

`Middleware` 目錄包含了中介軟體函數，這些函數可以在控制器的 `handleRequest` 方法中被調用。

### Middleware/index.js

`Middleware` 包含了所有中介函數的引用，並將其封裝在一個物件中。


### Routers/index.js

`Router/index.js` 定義了路由，並將請求委派給 `exampleController`：

### Routers/example/index.js

`Router/example/index.js` 定義了路由，並將請求委派給 `exampleController`：
- `router.post('/', (req, res, next) => exampleController.handleRequest(req, res, next))`:

### knexfile.js

`knexfile.js` 定義了資料庫連接設定。

### dev.config.js

`dev.config.js` 定義了開發環境的設定。

### .env.example

`.env.example` 定義了環境變數的範例。

### db_init.js

`db_init.js` 定義了創建資料庫邏輯。

### app.js

`app.js` 是應用程式的入口文件，設置了中介軟體和路由。

### docker-compose.yml

`docker-compose.yml` 定義了 Docker 容器的配置。

### database.js

`database.js` 定義了資料庫連接邏輯。


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


```
## Docker 相關指令

### 啟動 Docker container

```bash
docker-compose up


docker-compose up -d --build
- d：後台執行容器（可選）。
-- build：在啟動前重新建構映像檔。

``` 
### 關閉 Docker container

```bash
docker-compose down

docker-compose down --volumes --rmi all
-- volumes：同時移除容器附加的數據卷。
-- rmi all：同時移除相關的 Docker 映像檔。


```
### 查看 Docker container 狀態
```bash
docker ps


```


## knex幾個常用指令

### 創建migration
  
```bash
npm run migrate-make table_name
```

### 執行migration

```bash
npm run migrate-up
```