# 部署指南

## 概述

本文档指导如何将思维进化训练营H5应用部署到Vercel生产环境。

## 前置要求

- GitHub账号
- Vercel账号（可用GitHub账号登录）
- 域名（可选，推荐）

## 步骤

### 1. 准备代码

确保项目已推送到GitHub仓库：

```bash
cd D:/氛围编程/AINATIVE/app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evolve-mind-camp.git
git push -u origin main
```

### 2. Vercel项目导入

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择你的GitHub仓库
4. Framework Preset 选择 **Vite**
5. 点击 "Deploy"

### 3. 配置环境变量

在Vercel Dashboard > Project Settings > Environment Variables 中添加：

| 变量名 | 值 | 说明 |
|--------|------|------|
| `VITE_AI_API_KEY` | your_api_key | AI服务API密钥 |
| `VITE_AI_BASE_URL` | https://api.openai.com/v1 | API基础URL（可选） |
| `VITE_AI_MODEL` | gpt-4 | AI模型名称（可选） |
| `VITE_GA_ID` | G-XXXXXXXXXX | Google Analytics 4 Measurement ID（可选） |

### 4. 自定义域名配置（可选）

#### 使用Cloudflare DNS（推荐）

1. 在域名注册商处将DNS服务器改为Cloudflare提供的DNS
2. 在Cloudflare Dashboard中添加域名
3. 在Vercel Dashboard > Project Settings > Domains 中添加自定义域名
4. 按Vercel提示在Cloudflare中添加CNAME记录：
   - 类型: CNAME
   - 名称: @（根域名）或 www
   - 目标: cname.vercel-dns.com

#### 域名推荐

- evolve-mind.com
- mind-evolve.com
- think-evolve.com

### 5. HTTPS配置

Vercel自动提供HTTPS：
- 自动生成SSL证书
- 自动续期
- 无需手动配置

### 6. 部署验证

部署完成后验证以下项目：

- [ ] 网站可通过域名访问
- [ ] 所有页面加载正常
- [ ] 底部导航可切换页面
- [ ] AI对话功能正常（需配置API Key）
- [ ] 兑换码功能正常
- [ ] 移动端显示正常

### 7. 后续更新

每次推送到main分支会自动触发重新部署：

```bash
git add .
git commit -m "Update: xxx"
git push origin main
```

## 故障排除

### 构建失败

1. 检查 `npm run build` 本地是否通过
2. 检查Vercel构建日志中的错误信息
3. 确认Node.js版本兼容（项目使用Node 18+）

### API Key不生效

1. 确认环境变量名正确（以 `VITE_` 开头）
2. 重新部署以应用新环境变量
3. 在浏览器开发者工具中检查 `import.meta.env.VITE_AI_API_KEY` 是否存在

### 域名访问问题

- .cn域名在国内使用需要ICP备案，建议使用.com域名
- 检查DNS记录是否正确配置
- 等待DNS传播（通常5-30分钟）

## 监控

部署后可通过以下方式监控：

- **Vercel Analytics**: 内置在Dashboard中
- **Google Analytics 4**: 配置GA_ID后自动收集数据
- **Vercel Logs**: 实时查看访问日志和错误
