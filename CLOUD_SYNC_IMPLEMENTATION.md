# 云同步功能实现方案

## 概述

实现搜索引擎列表的云同步功能，让用户可以在多个设备间同步搜索引擎配置。

## 实现方案

### 方案选择：GitHub Gist API

**优点：**
- ✅ 完全免费
- ✅ 无需后端服务器
- ✅ 利用用户已有的 GitHub 账号
- ✅ 数据存储在私有 Gist 中，安全性高
- ✅ 简单易用，API 清晰

**缺点：**
- ⚠️ 需要用户创建 GitHub Personal Access Token
- ⚠️ 需要用户手动配置一次

### 技术实现

1. **云同步服务** (`src/utils/cloudSync.js`)
   - 提供 GitHub Gist API 封装
   - Token 验证
   - 上传/下载功能
   - 配置管理

2. **UI 组件** (在 `Settings.vue` 中添加)
   - 云同步设置区域
   - Token 输入和验证
   - 上传/下载按钮
   - 同步状态显示

3. **数据流程**
   - 本地数据 → 加密 → 上传到 Gist
   - Gist → 下载 → 解密 → 导入到本地

## 使用步骤

### 用户配置步骤

1. **创建 GitHub Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 命名：`0x3 Search Engine Sync`
   - 选择权限：勾选 `gist` 权限
   - 生成并复制 Token

2. **在网站中配置**
   - 打开设置页面
   - 找到"云同步"区域
   - 输入 GitHub Token
   - 点击"验证并保存"

3. **首次上传**
   - 点击"上传到云端"
   - 系统会创建一个私有 Gist
   - 保存 Gist ID 用于后续同步

4. **在其他设备同步**
   - 配置相同的 GitHub Token
   - 输入 Gist ID（首次上传后获得）
   - 点击"从云端下载"
   - 确认导入数据

## 功能特性

- 🔒 **数据加密**：使用现有的加密工具加密数据后上传
- 🔐 **私有存储**：数据存储在私有 Gist 中
- ⏱️ **同步时间记录**：记录最后同步时间
- ✅ **冲突处理**：覆盖现有配置（用户确认）
- 🔄 **自动更新 Gist ID**：首次上传后自动保存

## 安全考虑

1. **Token 安全**
   - Token 存储在 localStorage 中（仅在当前浏览器）
   - 用户需要妥善保管 Token
   - 建议使用最小权限（仅 gist 权限）

2. **数据加密**
   - 上传前使用现有加密工具加密
   - 即使 Token 泄露，数据也是加密的

3. **私有 Gist**
   - 所有 Gist 都设置为私有
   - 只有拥有 Token 的用户可以访问

## API 说明

### GitHub Gist API 端点

- **创建 Gist**: `POST https://api.github.com/gists`
- **更新 Gist**: `PATCH https://api.github.com/gists/:gist_id`
- **获取 Gist**: `GET https://api.github.com/gists/:gist_id`
- **验证用户**: `GET https://api.github.com/user`

### 需要的权限

- `gist` - 创建和更新 Gist

## 未来扩展

1. **自动同步**：检测到变化时自动上传
2. **多设备管理**：显示所有同步的设备
3. **版本历史**：查看同步历史记录
4. **冲突解决**：提供更智能的冲突解决机制

