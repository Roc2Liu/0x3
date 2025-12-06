# 🔍 0x3 - 搜索引擎聚合导航

> 一个美观、现代的搜索引擎聚合导航网站

[![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ 核心特性

- 多引擎切换、自定义添加、在线编辑
- 数据导入导出（加密存储）
- 云同步（GitHub Gist / 匿名口令同步）
- 自定义背景图片（最多 5 张历史）
- 主题切换（浅色/深色/自动）
- 磨砂透明背景效果

## 🚀 快速开始

```bash
git clone https://github.com/Roc2Liu/0x3.git
cd 0x3
npm install
npm run dev
```

## 📖 使用指南

**添加搜索引擎：** 设置 → 填写名称、图标和 URL（使用 `{query}` 占位符）

**云同步：**
- GitHub Gist：创建 Token（需要 `gist` 权限）并验证保存
- 匿名口令同步：输入口令即可（有效期 24 小时，相同口令会覆盖）

**背景图片：** 设置 → 背景图片 → 上传（最大 10MB）

## 🛠️ 技术栈

Vue 3.4+ | Vite 5.0+ | LocalStorage | IndexedDB | GitHub Gist API

## 🔒 隐私与安全

- 数据存储在浏览器本地，完全离线可用
- 无追踪、无分析
- 配置文件加密存储

## 📄 许可证

MIT License

---

**Made with ❤️ by Roc2Liu**
