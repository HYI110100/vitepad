
# vite-static-serve

[🇨🇳 中文版](#中文版) | [🇺🇸 English Version](#english-version)

---

## 中文版

**轻量、多环境、本地快速静态服务管理工具**，基于 **Vite**。
适合小团队或个人开发者在本地调试多个分支或环境，无需 Nginx。

### 核心特性

* ⚡ 多环境管理，快速启动不同端口
* 🔀 内置代理，方便前后端联调
* 🗂 自动生成默认页面
* 💻 简单 CLI：`vserve start/add/list/remove`

### 安装

```bash
git clone https://github.com/<your-username>/vite-static-serve.git
cd vite-static-serve
npm install

# 可选全局安装
npm install -g .
```

### 使用示例

```bash
# 添加环境
npx vserve add dev

# 启动环境
npx vserve start dev

# 列出环境
npx vserve list

# 删除环境
npx vserve remove dev
```

### 项目结构

```
bin/
  serve.js
dists/
templates/
  index.html
env.config.json
package.json
vite.config.js
.gitignore
```

### 依赖

* [vite](https://vitejs.dev/) ⚡ 核心服务
* [inquirer](https://www.npmjs.com/package/inquirer) 📝 CLI 交互
* [chalk](https://www.npmjs.com/package/chalk) 🎨 终端高亮
* [detect-port](https://www.npmjs.com/package/detect-port) 🔌 端口检测

---

## English Version

**Lightweight, multi-environment local static server manager**, powered by **Vite**.
Ideal for small teams or individual developers to test multiple branches locally, without Nginx.

### Key Features

* ⚡ Multi-environment management, quick start on different ports
* 🔀 Built-in proxy for front-end/back-end integration
* 🗂 Automatic default page generation
* 💻 Simple CLI: `vserve start/add/list/remove`

### Installation

```bash
git clone https://github.com/<your-username>/vite-static-serve.git
cd vite-static-serve
npm install

# Optional global install
npm install -g .
```

### Usage Example

```bash
# Add an environment
npx vserve add dev

# Start environment
npx vserve start dev

# List environments
npx vserve list

# Remove environment
npx vserve remove dev
```

### Project Structure

```
bin/
  serve.js
dists/
templates/
  index.html
env.config.json
package.json
vite.config.js
.gitignore
```

### Dependencies

* [vite](https://vitejs.dev/) ⚡ Core service
* [inquirer](https://www.npmjs.com/package/inquirer) 📝 CLI interaction
* [chalk](https://www.npmjs.com/package/chalk) 🎨 Terminal highlighting
* [detect-port](https://www.npmjs.com/package/detect-port) 🔌 Port detection