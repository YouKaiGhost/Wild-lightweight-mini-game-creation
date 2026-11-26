# 中国象棋，本地版

- **状态：** 可玩 · v0.1
- **语言：** HTML、CSS、JavaScript
- **引擎 / 运行时：** 浏览器；无构建步骤
- **源码：** [`docs/xiangqi-rules.js`](../../docs/xiangqi-rules.js) 和 [`docs/xiangqi.js`](../../docs/xiangqi.js)。可玩版本放在 `docs/`，因为 GitHub Pages 发布的是这个目录。
- **如何运行：** 直接打开 [`docs/xiangqi.html`](../../docs/xiangqi.html)，或者把发布目录跑起来：

  ```bash
  python3 -m http.server 8000 --directory docs
  # 然后打开 http://localhost:8000/xiangqi.html
  ```

- **操作：** 点选棋子，再点高亮落点。方向键移动焦点，Enter 或空格选择/落子。新开一局重置棋盘。
- **规则：** 本地双人中国象棋，红方先行。支持完整合法走法、将军、将死和困毙；无棋可走的一方判负。
- **v0.1 不做：** AI、棋钟、悔棋、记谱，以及重复局面/长将规则。
- **资源与署名：** 无。棋子使用 Unicode 中国象棋字符，棋盘是内联 SVG。
- **我学到了什么：** 九宫、河界、马腿、象眼和炮架都是棋盘约束。把规则放进纯模块后，才能跑 perft：初始局面深度 1–3 分别是 44 / 1,920 / 79,666 个节点。
- **规则备注：** 将帅和士不出九宫；象不过河；马会蹩腿；炮吃子必须正好一个炮架；兵卒过河后才能横走。将帅在同一列且中间无子属于非法局面。
- **调参：** 棋盘交互在 `docs/xiangqi.js`；走子生成和合法走法过滤在 `docs/xiangqi-rules.js`。
