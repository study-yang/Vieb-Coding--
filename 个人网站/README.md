# 个人网站

刘志洋的作品与技术主页 —— 展示可验证的项目成果与学习笔记。

![HTML](https://img.shields.io/badge/HTML5-CSS3-JavaScript-orange)
![依赖](https://img.shields.io/badge/%E4%BE%9D%E8%B5%96-%E9%9B%B6-brightgreen)
![构建](https://img.shields.io/badge/%E6%9E%84%E5%BB%BA-%E6%97%A0%E9%9C%80-blue)

## 特点

### 单文件，零构建，零外部请求

- 全部内容在 `index.html` 一个文件里：结构、样式、脚本、SVG 图形，以及内联的 three.js 构建产物
- 不加载任何网络字体、图标库或 CDN
- 直接双击 `index.html` 即可打开，**不需要服务器**

### Liquid Glass 玻璃质感

- 三层固定背景叠出底色：
  1. 彩色极光 mesh —— 7 个低饱和色相，`blur(72px) saturate(1.24)`，颜色互相融进彼此
  2. 极淡噪点 —— SVG `feTurbulence`，`opacity: .05`，用来杀死大渐变的色带
  3. 纸色渐隐纱罩 —— 顶部让极光透出来，往下逐渐盖回纸底，保证正文可读
- 玻璃元素用 `backdrop-filter: blur() saturate()`，背后的颜色会作为色调透进来
- 深浅双主题；切换靠 `data-theme` 属性，JS 生成的图形用 `MutationObserver` 声明式重画

### 首屏 3D 真折射透镜

- 原生 Three.js（不使用 React / R3F / drei），`LatheGeometry` 程序化车削出双凸透镜
- `MeshPhysicalMaterial` 的 `transmission` + `ior` + `thickness` + `dispersion`——
  真正的屏幕空间折射与色散，这是 CSS 的 `backdrop-filter` 做不到的
- 启用条件：WebGL 可用 && 宽度 > 860px && 指针设备 && 未开启减弱动效
- 任一条件不满足就**静默退回 CSS 玻璃**，页面不会报错或降级失败

### 交互细节

- 5 张项目卡带鼠标跟随光斑，垫在封面之上、玻璃信息条之下——
  玻璃的 `backdrop-filter` 会真的把这块移动的光糊一遍
- Hero 数据面板进入视口后数字滚动递增；光斑跟手时带约 0.16s 滞后
- 以上动效均遵循 `prefers-reduced-motion`，触屏设备不挂指针交互

## 访问性

- 语义化标签 + `aria-label`，卡片可键盘 Tab 聚焦
- `prefers-reduced-motion` 下关闭过渡与跟手动画，保留静态呈现
- 移动端 / 触屏自动停用 WebGL，回到纯 CSS 实现

## 内容来源

站内所有数字（检索召回提升、mAP50、P/R 等）均取自简历与项目原始记录，
口径可追溯，**不含估算与推测值**。

## 本地打开

```bash
# 克隆
git clone https://github.com/study-yang/Vieb-Coding--.git
cd Vieb-Coding--/个人网站

# 方式一：直接双击 index.html（推荐，无需服务器）

# 方式二：如偏好本地服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 文件说明

```
index.html    # 全站唯一文件。约 620 KB，其中约 526 KB 是内联的 three.js 构建产物
README.md     # 本文件
```

> `index.html` 末尾那段 three.js 是打包生成物（esbuild 打成 IIFE，暴露 `window.THREE`），
> 文件中已用注释标出边界。改样式或逻辑请改上面的透镜脚本，不要动那段产物。
