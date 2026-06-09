# 快记 - AI 原生极速记账

> 打开就记，记完就走 —— 你的智能记账伙伴

[![Powered by CloudBase](https://7463-tcb-advanced-a656fc-1257967285.tcb.qcloud.la/mcp/powered-by-cloudbase-badge.svg)](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit)

基于微信小程序 + 腾讯云开发（CloudBase）的 AI 记账应用。支持手动输入、语音识别、拍照识别三种记账方式，混元大模型驱动智能解析与消费分析。

## 功能特性

### 记账方式
- **手动输入** — 数字键盘快速记账
- **语音记账** — 说出消费内容，AI 自动识别金额、分类、备注
- **拍照识别** — 拍摄小票/账单，AI 提取消费信息

### 智能分析
- **消费分析** — AI 生成个性化消费报告，口语化风格
- **省钱建议** — 基于真实数据给出具体可执行的省钱方案
- **预算管理** — 日/月预算设置，超支实时提醒

### 数据管理
- **账单列表** — 按时间/分类/关键词筛选查看
- **数据导出** — CSV 格式导出全部账单记录
- **换机迁移** — 手机号绑定自动迁移旧设备数据

### 用户体验
- **免登录** — 微信小程序自动识别用户身份（OPENID）
- **主题切换** — 浅色 / 深色 / 跟随系统
- **骨架屏** — 加载状态优雅过渡

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | 微信小程序原生 | WXML + WXSS + JS，无框架依赖 |
| 后端 | 腾讯云开发（CloudBase） | 免服务器，按量计费 |
| 数据库 | CloudBase NoSQL | 文档型数据库，自动 OPENID 隔离 |
| AI 模型 | 混元大模型 | `hunyuan-2.0-instruct-20251111` |
| 语音识别 | 微信同声传译插件 | WechatSI 实时语音转文字 |

## 项目结构

```
微信小程序-快记/
├── miniprogram/                # 小程序前端
│   ├── pages/                  # 5 个 Tab 页面
│   │   ├── index/              # 记账（手动 + 语音 + 拍照）
│   │   ├── bill-list/          # 账单列表
│   │   ├── ai-analysis/        # AI 分析报告
│   │   ├── budget/             # 预算设置
│   │   └── profile/            # 我的
│   ├── components/             # 7 个可复用组件
│   ├── utils/                  # 工具函数
│   ├── mixins/                 # 行为混入
│   └── app-config.js           # 分类常量定义
├── cloudfunctions/             # 12 个云函数
│   ├── billCRUD/               # 账单增删改查
│   ├── getStatistics/          # 数据统计聚合
│   ├── aiParseVoice/           # AI 语音文本解析
│   ├── aiParseImage/           # AI 图片识别
│   ├── aiAnalyze/              # AI 消费分析
│   ├── aiSuggest/              # AI 省钱建议
│   ├── checkBudget/            # 预算检查
│   ├── getUserProfile/         # 用户信息管理
│   ├── sendFeedback/           # 意见反馈
│   └── shared/                 # 共享模块（分类、限流）
├── rules/                      # CloudBase 平台规则文档
└── docs/                       # 项目文档
```

## 云函数说明

| 函数 | 类型 | 功能 |
|------|------|------|
| `billCRUD` | Event | 账单的创建、更新、删除、查询、导出 |
| `getStatistics` | Event | 数据聚合统计（总额、分类、日汇总） |
| `aiParseVoice` | Event | AI 解析自然语言为账单记录 |
| `aiParseImage` | Event | AI 识别小票图片提取消费信息 |
| `aiAnalyze` | Event | AI 生成消费分析报告 |
| `aiSuggest` | Event | AI 生成省钱建议 |
| `checkBudget` | Event | 预算超支检查 |
| `getUserProfile` | Event | 用户信息管理 + 手机号绑定 |
| `sendFeedback` | Event | 用户反馈提交 |

## 数据库集合

| 集合 | 用途 |
|------|------|
| `bills` | 账单记录（amount 正=支出，负=收入） |
| `budgets` | 预算配置（日/月） |
| `users` | 用户信息 |
| `feedbacks` | 用户反馈 |
| `rate_limits` | AI 调用限流 |

## 部署指南

### 前置条件
- 微信开发者工具
- 腾讯云开发环境
- 微信小程序 AppID（需已认证才能使用手机号功能）

### 1. 配置云函数环境变量

登录 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)，找到以下云函数，配置环境变量：

| 云函数 | 环境变量 | 说明 |
|--------|----------|------|
| `aiParseVoice` / `aiParseImage` / `aiAnalyze` / `aiSuggest` | `TCB_ENV` | 自动注入，无需手动设置 |
| `getUserProfile` | `APPID` | 小程序 AppID |
| `getUserProfile` | `APPSECRET` | 小程序 AppSecret |

### 2. 部署云函数

在 CloudBase 控制台逐个上传 `cloudfunctions/` 目录下的函数。

### 3. 开通 AI 模型

[CloudBase 控制台](https://console.cloud.tencent.com/tcb) → 选择环境 → **AI+** → 开通混元模型。

### 4. 本地开发

1. 使用微信开发者工具打开项目根目录
2. 项目配置会自动识别 `miniprogram/` 为前端目录
3. 真机预览测试

## 开发说明

### 分类数据同步

分类定义存在于两个位置，修改时需同步：
- 前端：`miniprogram/app-config.js`
- 后端：`cloudfunctions/shared/categories.js`

### AI 调用模式

云函数使用双 SDK 初始化：
- `wx-server-sdk`：获取上下文和 OPENID
- `@cloudbase/node-sdk`：调用 AI 模型（`app.ai()`）

### 响应格式

所有云函数统一返回：`{ code: 0, data, message }`

### 金额约定

- 正数 = 支出
- 负数 = 收入
- 展示层反转符号显示

## 许可证

MIT License

---

> 基于 [CloudBase AI ToolKit](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit) 开发
