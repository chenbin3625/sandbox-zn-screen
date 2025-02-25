# zn大屏沙箱

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