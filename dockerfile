# 使用官方 Node.js 基础镜像
FROM node:20

# 设置环境变量以提高构建效率
ENV NODE_ENV=production

# 设置工作目录
WORKDIR /usr/src/app

# 仅复制 package.json 和 package-lock.json 文件以优化构建缓存
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制项目文件
COPY . .

# 确保项目代码中能找到 .env 文件（仅开发环境加载）
# 在运行时动态加载环境变量时无需此文件

# 暴露应用端口
EXPOSE 3003

# 定义容器启动命令
CMD ["node", "server.js"]
