# 打砖块，一堵墙版

- **状态：** 可玩 · v0.1
- **语言：** HTML、CSS、JavaScript
- **引擎 / 运行时：** 浏览器；无构建步骤
- **源码：** [`docs/breakout.js`](../../docs/breakout.js) 和 [`docs/breakout.html`](../../docs/breakout.html)。可玩版本放在 `docs/`，因为 GitHub Pages 发布的是这个目录。
- **如何运行：** 直接打开 [`docs/breakout.html`](../../docs/breakout.html)，或者把发布目录跑起来：

  ```bash
  python3 -m http.server 8000 --directory docs
  # 然后打开 http://localhost:8000/breakout.html
  ```

- **操作：** A/D 或 ←/→ 移动。空格暂停，R 重开。触屏可以在球场上拖动，或按住下方两个按钮。
- **规则：** 用三条命清空一堵 8 × 5 的砖墙。每块砖 10 分；通关时每剩一条命再加 50 分。
- **资源与署名：** 无。球场、球拍、球和砖块都用 canvas 图元绘制。
- **我学到了什么：** 砖块碰撞的核心问题只有一个：翻 x 速度还是 y 速度。用上一帧位置判断能处理干净的正面碰撞，较小的重叠方向则决定角落碰撞。砖缝比球宽，侧向碰撞才有空间弹开；固定 120 Hz 步进可以防止球直接跳过砖块。
- **调参：** `docs/breakout.js` 里的 `BASE_SPEED`、`SPEED_PER_BRICK` 和 `MAX_SPEED` 控制难度曲线；`PADDLE_WIDTH` 和砖块网格是另外两个主要旋钮。
