module.exports = (db, wss, WebSocket) => (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    // 从客户端接收的消息中解析 driverId、latitude、longitude
    const { driverId, latitude, longitude } = JSON.parse(message);
    const timestamp = Date.now(); // 获取当前时间戳

    // 存储到 Firebase 数据库，每次存储一个新的时间戳节点
    const locationRef = db.ref(`ms3/${driverId}/${timestamp}`);
    await locationRef.set({
      latitude,
      longitude,
      timestamp
    });

    // 向所有连接的客户端广播位置，使用 driverId 而不是 userId
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
       //client.send(JSON.stringify({ driverId, latitude, longitude, timestamp }));
        client.send(JSON.stringify({ latitude, longitude }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
};
