# 记忆翻牌，小号版

- **状态：** 可玩 · v0.1
- **语言：** HTML、CSS、JavaScript
- **引擎 / 运行时：** 浏览器；无构建步骤
- **源码：** [`docs/memory.js`](../../docs/memory.js) 和 [`docs/memory.html`](../../docs/memory.html)。可玩版本放在 `docs/`，因为 GitHub Pages 发布的是这个目录。
- **如何运行：** 直接打开 [`docs/memory.html`](../../docs/memory.html)，或者把发布目录跑起来：

  ```bash
  python3 -m http.server 8000 --directory docs
  # 然后打开 http://localhost:8000/memory.html
  ```

- **操作：** 点两张牌。键盘：Tab 选牌，按 Enter 或空格翻开。R 重开。
- **规则：** 4 × 4 棋盘上有八对牌。翻开两张算一步，用尽量少的步数找齐所有对子。
- **资源与署名：** 无。牌面使用 Unicode 符号和站点配色。
- **我学到了什么：** 比较两张牌是一个状态，而不只是一个计时器。不匹配的牌展示期间锁住棋盘，可以避免经典的“第三张牌”bug。使用真正的按钮和标签，也让游戏支持键盘和屏幕阅读器。
- **调参：** `docs/memory.js` 里的 `FLIP_BACK_MS` 控制不匹配牌停留的时间；棋盘大小和符号列表是另外两个旋钮。
