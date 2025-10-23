# 数据管理系统

一个基于 React + Ant Design 的现代化管理系统界面。

## 功能特性

- 🎨 美观的侧边栏菜单设计
- 📱 响应式布局
- 🔧 三个主要模块：
  - 问数助手
  - 数据中心
  - 权限配置

## 技术栈

- React 18
- Ant Design 5
- React Router 6

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
npm start
```

项目将在 [http://localhost:3000](http://localhost:3000) 打开。

## 项目结构

```
src/
├── components/
│   ├── MainLayout.js      # 主布局组件
│   └── MainLayout.css     # 布局样式
├── pages/
│   ├── QuestionAssistant.js   # 问数助手页面
│   ├── DataCenter.js          # 数据中心页面
│   ├── PermissionConfig.js    # 权限配置页面
│   └── PageStyle.css          # 页面通用样式
├── App.js
├── App.css
├── index.js
└── index.css
```

## 构建生产版本

```bash
npm run build
```

