# 使用官方 Node.js 映像作為基底映像
FROM node:20

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json (如果有) 進到容器中
COPY package*.json ./

# 安裝應用所需的依賴包
RUN npm install

# 複製所有專案檔案到容器
COPY . .


# 開放應用程式埠 (例如 8080)
EXPOSE 8080

# 定義啟動命令，使用你定義的啟動腳本
CMD ["sh", "-c", "npm run init && npm run prod"]
