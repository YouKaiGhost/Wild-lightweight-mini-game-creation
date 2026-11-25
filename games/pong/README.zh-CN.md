# 乒乓，公平版

- **状态：** 可玩 · v0.1
- **语言：** HTML、CSS、JavaScript
- **引擎 / 运行时：** 浏览器；无构建步骤
- **源码：** [`docs/pong.js`](../../docs/pong.js) 和 [`docs/pong.html`](../../docs/pong.html)。可玩版本放在 `docs/`，因为 GitHub Pages 发布的是这个目录。
- **如何运行：** 直接打开 [`docs/pong.html`](../../docs/pong.html)，或者把发布目录跑起来：

  ```bash
  python3 -m http.server 8000 --directory docs
  # 然后打开 http://localhost:8000/pong.html
  ```

- **操作：** W/S 或 ↑/↓ 移动。空格暂停，R 重开。触屏可以在球场上拖动，或按住下方两个按钮。
- **规则：** 先到 5 分获胜。每次被球拍击中，球都会稍微加速。
- **资源与署名：** 无。球场、球拍和球都用 canvas 图元绘制。
- **我学到了什么：** 固定时间步让球在不同刷新率下表现一致。公平的电脑不是完美追踪，而是一组限制：速度上限、反应延迟和瞄准误差。
- **调参：** `docs/pong.js` 顶部的常量控制移动、反弹和电脑的公平程度。一次只改一个，打完整一局再改下一个。
