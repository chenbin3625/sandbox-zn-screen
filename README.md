# zn大屏沙箱 / ZN Screen Sandbox

一个基于 Vue 3、Vite、ECharts、Pinia 和 Ant Design Vue 的智慧大屏沙箱项目，用于搭建登录、管理后台、监控页和大屏展示等数据可视化页面。

**English Summary**

ZN Screen Sandbox is a Vue 3 data-visualization sandbox for smart screen and monitoring-dashboard scenarios. It uses Vite, ECharts, Pinia, Vue Router, and Ant Design Vue to prototype login, admin, monitoring, and full-screen display pages.

## 功能概览 / Features

- 智慧大屏与监控页原型 / Smart screen and monitoring page prototypes
- 后台管理与登录流程 / Admin and login flows
- ECharts 数据可视化组件 / ECharts-based visualization
- Vite + Vue 3 开发体验 / Vite-powered Vue 3 workflow
- Docker、Nginx 与 Vercel 部署配置 / Docker, Nginx, and Vercel deployment files

## 环境准备

### 安装 pnpm (推荐方法)

```sh
# 方法 1: 使用 npm 直接安装
npm install -g pnpm@10.4.1

# 方法 2: 如果 corepack 可用，可以尝试
corepack enable
corepack prepare pnpm@10.4.1 --activate

# 方法 3: 使用官方安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 初始化

```sh
pnpm install
```

### 启动热重载测试服务器

```sh
pnpm run dev
```

### 编译并为生产环境进行压缩

```sh
pnpm run build
```

## 常见问题

如果使用 corepack 安装 pnpm 时遇到 "Cannot find matching keyid" 错误，请尝试上述替代安装方法。
