# 🎋 AI诗词生成器

一个精美的在线诗词生成工具，支持普通诗词和藏头诗创作，采用纯前端技术栈实现。

![Python](https://img.shields.io/badge/HTML5-CSS3-JavaScript-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stars](https://img.shields.io/github/stars/yourusername/poem-generator?style=social)

## ✨ 功能特点

### 📝 诗词生成
- **普通诗词生成**：基于关键词和主题生成意境优美的诗词
- **藏头诗生成**：输入任意关键词，自动生成每句首字对应的藏头诗
- **多种格式支持**：五言绝句、七言绝句、五言律诗、七言律诗

### 🎨 精美界面
- **水墨风格设计**：传统中国风配色，朱砂红点缀
- **宣纸质感背景**：复古书法风格展示诗词
- **响应式布局**：完美适配桌面端和移动端
- **流畅动画效果**：优雅的交互动画

### 💾 实用功能
- **一键复制**：快速复制生成的诗词
- **历史记录**：保存和查看历史作品
- **本地存储**：数据保存在浏览器本地，隐私安全

## 🚀 快速开始

### 方式一：直接打开
无需安装任何软件，直接在浏览器中打开 `index.html` 文件即可使用。

```bash
# 克隆项目
git clone https://github.com/yourusername/poem-generator.git

# 进入项目目录
cd poem-generator

# 直接在浏览器中打开 index.html
```

### 方式二：使用本地服务器
如果你想使用本地服务器运行：

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 然后在浏览器中访问 http://localhost:8000
```

## 📖 使用指南

### 普通诗词生成
1. 选择「普通诗词」模式
2. 选择诗词格式（五言绝句/七言绝句/五言律诗/七言律诗）
3. 输入关键词（可选，用逗号分隔）
4. 点击「生成诗词」按钮
5. 查看生成的诗词，点击「复制」或「保存」

### 藏头诗生成
1. 选择「藏头诗」模式
2. 选择诗词格式
3. 输入藏头的字（支持两种格式）：
   - 逐字输入：`春,风,得,意`
   - 直接输入：`春风得意`
4. 点击「生成诗词」按钮

## 🛠️ 技术栈

- **HTML5**：语义化页面结构
- **CSS3**：精美样式和动画效果
  - Flexbox 布局
  - CSS Grid 响应式设计
  - CSS 变量管理主题色
  - 丰富的动画效果
- **JavaScript**：原生 ES6+ 实现
  - 无外部依赖
  - 模块化函数设计
  - LocalStorage 数据持久化
- **字体**：Google Fonts - Noto Serif SC（思源宋体）

## 📁 项目结构

```
poem-generator/
├── index.html      # 主页面
├── styles.css     # 样式文件
├── script.js      # 核心逻辑
├── README.md      # 项目说明
├── .gitignore     # Git忽略规则
└── .git/          # Git仓库
```

## 🎯 核心模块

### 1. 词汇库（vocabulary）
```javascript
vocabulary = {
    themes: {
        spring: { nouns: [...], verbs: [...], adjectives: [...] },
        summer: { ... },
        // ... 9个主题
    },
    collocations: ['春风拂面', '秋月照人', ...],  // 60个经典搭配
    patterns: ['形容词+名词+动词+名词', ...],      // 15种句式
    // 向后兼容的通用词汇...
}
```

### 2. 诗词生成算法
- **主题系统**：9大主题（春夏秋冬、山水田园、风月、送别、抒情）
- **风格模板**：3种风格（写景、抒情、送别），每种有起句和收句句式
- **智能拼接**：基于字符数动态选择最优句式组合

### 3. 功能模块
```javascript
// 藏头诗生成
function generateAcrosticPoem(poemType, headWords)

// 普通诗词生成
function generateNormalPoem(poemType, keywords)

// 复制功能
function copyPoem()

// 保存历史
function savePoem()

// 加载历史
function loadHistory()
```

## 🎨 设计亮点

### 色彩系统
```css
--color-bg: #f8f5f0;           /* 米白背景 */
--color-paper: #fdfcfa;        /* 宣纸白 */
--color-text: #2d2d2d;         /* 深灰文字 */
--color-accent: #c41e3a;       /* 朱砂红 */
--color-accent-light: #e85a6b; /* 浅朱红 */
```

### 布局结构
- **头部**：标题和副标题，渐变装饰
- **主区域**：左右分栏
  - 左侧：控制面板 + 历史记录
  - 右侧：诗词展示区
- **底部**：版权信息

## 📚 学习价值

这个项目非常适合前端入门学习：

1. **HTML基础**：语义化标签、表单元素、链接脚本
2. **CSS进阶**：
   - CSS变量和主题系统
   - Flexbox和Grid布局
   - 响应式设计
   - 动画和过渡效果
   - CSS伪元素和装饰
3. **JavaScript核心**：
   - 函数和模块化编程
   - DOM操作
   - 事件处理
   - LocalStorage API
   - 数据结构和算法
4. **项目工程化**：
   - Git版本控制
   - Markdown文档编写
   - 代码组织结构

## 🔧 自定义扩展

### 添加新主题
```javascript
vocabulary.themes.newTheme = {
    nouns: ['新词汇1', '新词汇2', ...],
    verbs: ['新动词1', '新动词2', ...],
    adjectives: ['新形容词1', '新形容词2', ...]
}
```

### 修改诗词格式
```javascript
const poemTemplates = {
    'newFormat': { lines: 6, charsPerLine: 7 }
}
```

### 添加新的诗词风格
```javascript
poemStyleTemplates['新风格'] = {
    themes: ['theme1', 'theme2'],
    openings: { 5: ['句式1', '句式2'], 7: ['句式3'] },
    closings: { 5: ['句式4'], 7: ['句式5'] }
}
```

## 🐛 问题反馈

如果你发现了bug或有新的功能建议，欢迎：

1. **提交Issue**：在GitHub仓库中创建新的Issue
2. **Pull Request**：提交代码改进
3. **邮箱联系**：your.email@example.com

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源，你可以：

- ✅ 自由使用和修改
- ✅ 商业用途
- ✅ 私有化部署
- ✅ 分发和销售
- ⚠️ 需要保留原作者署名
- ⚠️ 开源协议全文

## 🙏 致谢

- [Google Fonts](https://fonts.google.com/) - 提供优雅的中文字体
- 所有诗词爱好者的支持与反馈

---

## 📬 联系方式

- **GitHub**: [yourusername/poem-generator](https://github.com/yourusername/poem-generator)
- **邮箱**: your.email@example.com

---

Made with ❤️ for poetry lovers 🎋
