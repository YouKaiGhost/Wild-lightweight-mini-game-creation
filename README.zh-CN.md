# 野生轻量小游戏制作

[English](README.md) · **中文**

> 小游戏。野想法。

一个新手用来练习小游戏和经典复刻的公开工坊——不限语言，不限引擎。这里的一切都刻意保持轻量：一屏、一个机制、一口气能玩完。

[试玩贪吃蛇](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/) · [试玩乒乓](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/pong.html) · [试玩记忆翻牌](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/memory.html) · [设计笔记](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/#notes) · [资源说明](assets/README.zh-CN.md)

---

## 这是什么？

这个仓库是一份学习记录，不是一个工作室。我在用当下最轻的方式复刻小游戏——目前是原生 HTML、CSS 和 JavaScript——练习一个完整的循环：

1. 选一个机制。
2. 搭一个粗糙原型。
3. 玩一玩。
4. 记下哪里坏了。
5. 做一个更小、更好的版本。

规则不是“必须用这个技术栈”，而是“做完一个小东西”。如果一个游戏需要菜单来解释自己，它大概应该留到下一个原型。

## 不限语言，不限引擎

这个工坊刻意不绑定引擎。当前的贪吃蛇、乒乓和记忆翻牌 demo 用原生网页技术，只是因为它们到处都能跑；那是一个例子，不是要求。Godot、Unity、Unreal、Pygame、LÖVE、Raylib、终端，甚至某个在 itch.io 上捡到的奇怪小引擎——只要能帮你做完一屏，都可以放进来。

- **当前 demo：** `docs/`——双语页面，以及可玩的贪吃蛇、乒乓和记忆翻牌复刻。
- **以后的原型：** 放在 [`games/`](games/) 下，一个游戏一个文件夹；README 写清语言、引擎、启动方式、操作和资源署名。
- **共享资源：** [`assets/`](assets/)——图片、音频、字体、模型、参考资料和许可证记录。

不要求任何语言、引擎或构建系统。

## 试玩当前 demo

Demo 包括小号贪吃蛇、乒乓和记忆翻牌，支持键盘和触屏。

- **在线站点：** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/>
- **乒乓：** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/pong.html>
- **记忆翻牌：** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/memory.html>
- **本地运行：** 直接打开 `docs/index.html`、`docs/pong.html` 或 `docs/memory.html`，或者起一个很小的服务器：

```bash
git clone https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation.git
cd Wild-lightweight-mini-game-creation
python3 -m http.server 8000 --directory docs
# 然后打开 http://localhost:8000、/pong.html 或 /memory.html
```

界面默认是英文，点击页眉的 **中文 / EN** 按钮可以切换语言，选择会保存在 `localStorage` 里。

## 仓库结构

```text
.
├── assets/              # 共享图片、音频、字体、模型、参考资料和署名
├── docs/                # 双语展示站 + 可玩的贪吃蛇、乒乓和记忆翻牌 demo
├── games/               # 一个游戏一个文件夹，不限语言或引擎
├── README.md
├── README.zh-CN.md
└── LICENSE
```

## 资源

所有共享资源都放在 [`assets/`](assets/)。文件夹里的说明写了命名、格式、许可证、体积限制和第三方资源署名方式：

- [Asset guide (English)](assets/README.md)
- [资源说明（中文）](assets/README.zh-CN.md)
- [署名记录](assets/CREDITS.md)

一句话版本：只提交自己有权使用的资源；每个第三方文件都记到 `assets/CREDITS.md`；优先使用引擎中立格式；大的原始导出不要塞进 Git。如果 `docs/` 里的网页游戏要在运行时加载资源，请复制到发布目录——GitHub Pages 不会发布顶层 `assets/`。

## 复刻记录

| 游戏 | 状态 | 在学什么 |
| --- | --- | --- |
| 贪吃蛇 | 可玩 · v0.1 | 网格移动、输入缓冲、擦边而过的感觉 |
| 乒乓 | 可玩 · v0.1 | 连续碰撞，以及用限制调出来的公平电脑 |
| 记忆翻牌 | 可玩 · v0.1 | 回合制状态和无障碍，就是这个游戏的全部 |
| 打砖块 | 排队中 | 好关卡是节奏，不是一堵墙 |

游戏会一直留在队列里，直到能玩，而不是直到完美。

## 轻量设计规则

- **一个机制。** 每个原型只探索一个动词：移动、闪避、收集或反弹。
- **前 10 秒。** 玩家应该能在十秒内移动、理解目标并失败一次。
- **输入就是设计。** 缓存下一次转向、宽容一次擦边，比多做几关更重要。
- **做小一点。** 一个能结束的原型，比一个永远发不出的杰作更有价值。
- **记下失败。** 试玩后写两行笔记，比猜一个星期更有用。

## 新手承诺

代码是写给人读的。当前 demo 没有要先学会的框架，没有包管理器，也没有藏起来的构建流程。以后的原型可以用引擎；每个游戏的 README 要写清怎么运行。如果有哪里看不懂，欢迎开 issue，我会试着写清楚。如果你也在起步，欢迎 fork、改坏它，再做一个更小的版本。

## 许可

MIT。拿走有用的部分。
