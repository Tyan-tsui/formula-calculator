# 公式计算器 · Formula Calculator

一款**完全离线**的物理 / 数学公式查询与应用工具。内置 **900+ 条公式**，覆盖数理化生、医学、药学、工程、经济等 **30 余个分类**。

界面是一个单文件 HTML（HTML + CSS + JS + 公式数据全部内联），由 Electron 封装为 Windows 桌面应用 —— 无网络依赖，打开即用。

## ✨ 功能

| 功能 | 说明 |
|---|---|
| 📚 **公式库** | 900+ 条公式，30+ 分类，全部离线内置 |
| 🔍 **智能搜索** | 按名称、别名搜索，也可直接输入公式写法（如 `e=mc2`、`U=IR`） |
| 🧮 **逐变量代入计算** | 填入变量值即时出结果；聚焦变量框时，公式中对应符号会高亮 |
| ✍️ **公式美化器** | 把粗糙写法（如 `RV= UV×R/(US−UV)`）自动转成标准格式，并一键复制为<br>纯文本 / UnicodeMath / LaTeX / **Word 公式对象（OMML，Word 直接粘贴成公式）** |
| ⚡ **快速计算器** | 直接输入任意表达式求值，如 `sqrt(9^2+12^2)`、`2*pi*5` |
| 🎨 **三套主题** | 深色科技 / 精致纸张 / 工程蓝图，一键切换并自动记忆 |
| ⭐ **收藏与最近** | 收藏常用公式、记录最近浏览 |
| ➕ **自定义公式** | 添加自己的公式，支持**编辑和删除** |
| 🔢 **有效数字** | 结果保留 2 / 3 / 4 位有效数字可选 |
| ⌨️ **快捷键** | `/` 或 `Ctrl+K` 快速聚焦搜索框 |

## 📸 截图

### 深色科技
![深色科技](docs/screenshots/theme-dark.png)

### 精致纸张
![精致纸张](docs/screenshots/theme-paper.png)

### 工程蓝图
![工程蓝图](docs/screenshots/theme-blueprint.png)

## 🚀 使用

### 方式一：直接下载成品（推荐普通用户）

前往 [Releases](../../releases) 页面，下载最新的 Windows 安装包或免安装版，双击即可使用。

### 方式二：直接用浏览器打开（最简单）

应用本体就是一个单文件 HTML，无需安装任何东西：

> 双击 `物理数学公式计算器.html`

在浏览器中即可使用绝大多数功能（搜索、计算、复制 LaTeX 等）。
*注：复制「Word 公式对象」等富文本功能在 Chromium 内核的浏览器 / Electron 中体验最佳。*

### 方式三：用 Electron 运行（完整桌面体验）

需要 [Node.js](https://nodejs.org/) 18 及以上：

```bash
npm install
npm start
```

## 📦 打包成 exe

```bash
npm install
npm run dist
```

产物输出在 `dist/` 目录。

## 📁 项目结构

```
.
├── main.js                    # Electron 主进程（创建窗口、加载界面）
├── package.json
├── 物理数学公式计算器.html      # 应用本体：HTML + CSS + JS + 全部公式数据
├── paper.jpg                  # 「精致纸张」主题的纸张纹理
├── build/
│   └── icon.ico               # 应用图标
└── tools/
    └── asar.js                # app.asar 解包 / 打包工具
```

## 🔧 关于 app.asar

Electron 打包后，源码会被封进 `resources/app.asar`。想查看或修改里面内容，可用附带的工具：

```bash
# 解包
node tools/asar.js unpack "<安装目录>/resources/app.asar" ./unpacked

# 改完后重新打包
node tools/asar.js pack ./unpacked "<安装目录>/resources/app.asar"
```

> 提示：替换 app.asar 前建议先备份原文件。若程序正在运行，请先关闭。

## 📄 许可

本项目基于 [MIT License](LICENSE) 开源，可自由使用、修改和分发。
