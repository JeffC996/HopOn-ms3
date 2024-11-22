// server.js
require('dotenv').config();
const admin = require('firebase-admin');
const app = require('./app');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const websocketHandler = require('./websocket');

// 从环境变量中获取 Firebase 配置
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
const databaseURL = process.env.DATABASE_URL;

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// 初始化 Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const db = admin.database();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// 传递 `wss` 实例、`db` 和 `WebSocket` 给 WebSocket 处理函数
wss.on('connection', websocketHandler(db, wss, WebSocket));

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
