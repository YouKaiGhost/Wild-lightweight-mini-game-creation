# 野生轻量小游戏制作

[English](README.md) · **中文**

> 小游戏。野想法。

一个新手用来练习小游戏和经典复刻的公开工坊。这里的一切都刻意保持轻量：一屏、一个机制、一口气能玩完。

[在线试玩](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/) · [设计笔记](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/#notes)

---

## 这是什么？

这个仓库是一份学习记录，不是一个工作室。我用原生 HTML、CSS 和 JavaScript 复刻小游戏，练习一个完整的循环：

1. 选一个机制。
2. 搭一个粗糙原型。
3. 玩一玩。
4. 记下哪里坏了。
5. 做一个更小、更好的版本。

不用引擎，不用构建，没有依赖。如果一个游戏需要菜单来解释自己，它大概应该留到下一个原型。

## 试玩

Demo 是一个小号贪吃蛇，支持键盘和触屏。

- **在线站点：** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/>
- **本地运行：** 直接打开 `docs/index.html`，或者起一个很小的服务器：

```bash
git clone https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation.git
cd Wild-lightweight-mini-game-creation
python3 -m http.server 8000 --directory docs
# 然后打开 http://localhost:8000
```

界面默认是英文，点击页眉的 **中文 / EN** 按钮可以切换语言，选择会保存在 `localStorage` 里。

## 仓库内容

| 路径 | 用途 |
| --- | --- |
| `docs/index.html` | 双语落地页和可玩的贪吃蛇 demo |
| `docs/styles.css` | 整套视觉：暖纸色、绿色墨水和一点橙色 |
| `docs/i18n.js` | 英文/中文字典和语言切换 |
| `docs/snake.js` | 贪吃蛇复刻：网格移动、食物、分数、暂停、触屏方向键 |
| `docs/app.js` | 不属于游戏本体的页面小交互 |
| `README.md` | 英文说明 |
| `README.zh-CN.md` | 中文说明 |
| `LICENSE` | MIT |

## 复刻记录

| 游戏 | 状态 | 在学什么 |
| --- | --- | --- |
| 贪吃蛇 | 可玩 · v0.1 | 网格移动、输入缓冲、擦边而过的感觉 |
| 乒乓 | 草图 | 球的物理不难，公平的球拍才难 |
| 打砖块 | 排队中 | 好关卡是节奏，不是一堵墙 |
| 记忆翻牌 | 排队中 | 牌少一点，游戏可能更好 |

游戏会一直留在队列里，直到能玩，而不是直到完美。

## 轻量设计规则

- **一个机制。** 每个原型只探索一个动词：移动、闪避、收集或反弹。
- **前 10 秒。** 玩家应该能在十秒内移动、理解目标并失败一次。
- **输入就是设计。** 缓存下一次转向、宽容一次擦边，比多做几关更重要。
- **做小一点。** 一个能结束的原型，比一个永远发不出的杰作更有价值。
- **记下失败。** 试玩后写两行笔记，比猜一个星期更有用。

## 新手承诺

代码是写给人读的。没有要先学会的框架，没有包管理器，也没有藏起来的构建流程。如果有哪里看不懂，欢迎开 issue，我会试着写清楚。如果你也在起步，欢迎 fork、改坏它，再做一个更小的版本。

## 许可

MIT。拿走有用的部分。
