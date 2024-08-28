# 使用官方的 Nginx Alpine 镜像作为基础镜像
FROM nginx:alpine

# 将 dist 目录复制到 Nginx 的默认静态文件目录
COPY dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]