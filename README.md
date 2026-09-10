# ZN Screen Sandbox

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A smart-screen sandbox project built with Vue 3, Vite, ECharts, Pinia and Ant Design Vue, used to prototype data-visualization pages such as login screens, admin dashboards, monitoring pages and full-screen displays.

## Features

- Smart screen and monitoring page prototypes
- Admin and login flows
- ECharts-based data visualization components
- Vite + Vue 3 development workflow
- Docker, Nginx, and Vercel deployment configuration

## Prerequisites

### Installing pnpm (recommended)

```sh
# Option 1: install directly with npm
npm install -g pnpm@10.4.1

# Option 2: try corepack if it is available
corepack enable
corepack prepare pnpm@10.4.1 --activate

# Option 3: use the official install script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Setup

```sh
pnpm install
```

### Start the hot-reload dev server

```sh
pnpm run dev
```

### Build and minify for production

```sh
pnpm run build
```

## FAQ

If you hit the `Cannot find matching keyid` error while installing pnpm through corepack, try one of the alternative install methods above.

## License

This project is released under the [MIT License](LICENSE).

---

# 中文

一个基于 Vue 3、Vite、ECharts、Pinia 和 Ant Design Vue 的智慧大屏沙箱项目，用于搭建登录、管理后台、监控页和大屏展示等数据可视化页面。

## 功能概览

- 智慧大屏与监控页原型
- 后台管理与登录流程
- ECharts 数据可视化组件
- Vite + Vue 3 开发体验
- Docker、Nginx 与 Vercel 部署配置

## 环境准备

### 安装 pnpm（推荐方法）

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

## 许可证

本项目以 [MIT License](LICENSE) 授权。
