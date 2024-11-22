// app.js
const express = require('express');
const app = express();

app.use(express.json()); // 用于处理 JSON 请求体

module.exports = app;
