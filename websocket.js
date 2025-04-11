const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const path = require('path');
require("dotenv").config();

// 創建獨立的 Express 應用
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 或設置為允許的前端域名，例如 "http://yourfrontend.com"
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 靜態文件服務 - 用於提供聊天室前端頁面
app.use(express.static(path.join(__dirname, 'public')));

// 簡單的首頁路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket 連線管理
const clients = new Map();

io.on('connection', (socket) => {
  console.log('新用戶連線，ID:', socket.id);
  
  // 儲存客戶端連線
  clients.set(socket.id, {
    id: socket.id,
    name: `訪客-${socket.id.substr(0, 4)}`,
    role: ''
  });
  
  // 廣播新用戶加入
  io.emit('userJoined', {
    id: socket.id,
    name: clients.get(socket.id).name,
    online: clients.size
  });
  
  // 設定角色
  socket.on('setRole', (data) => {
    if (data.role) {
      const client = clients.get(socket.id);
      client.role = data.role;
      console.log(`用戶 ${socket.id} 設定角色為: ${data.role}`);
    }
  });
  
  // 處理用戶註冊名稱
  socket.on('register', (data) => {
    if (data.name && data.name.trim()) {
      const client = clients.get(socket.id);
      client.name = data.name.trim();
      
      // 更新用戶資訊
      io.emit('userUpdated', {
        id: socket.id,
        name: client.name
      });
      
      console.log(`用戶 ${socket.id} 已註冊為: ${client.name}`);
    }
  });
  
  // 處理用戶發送的訊息
  socket.on('message', (data) => {
    const client = clients.get(socket.id);
    if (client && data.text) {
      // 廣播訊息給所有用戶
      io.emit('newMessage', {
        id: socket.id,
        name: client.name,
        role: client.role || data.role,
        text: data.text,
        time: new Date().toLocaleTimeString()
      });
      
      console.log(`${client.name} (${client.role || '未設定角色'}) 說: ${data.text}`);
    }
  });
  
  // 處理用戶斷線
  socket.on('disconnect', () => {
    const client = clients.get(socket.id);
    if (client) {
      io.emit('userLeft', {
        id: socket.id,
        name: client.name,
        online: clients.size - 1
      });
      
      clients.delete(socket.id);
      console.log(`用戶 ${client.name} 已斷線`);
    }
  });
});

// 獨立啟動 WebSocket 服務器
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3001;
server.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket 服務器正在 http://localhost:${WEBSOCKET_PORT} 上運行`);
});