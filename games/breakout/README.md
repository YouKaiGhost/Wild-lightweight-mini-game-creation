# Breakout, but one wall

- **Status:** Playable · v0.1
- **Language:** HTML, CSS, JavaScript
- **Engine / runtime:** Browser; no build step
- **Source:** [`docs/breakout.js`](../../docs/breakout.js) and [`docs/breakout.html`](../../docs/breakout.html). The playable copy lives in `docs/` because GitHub Pages publishes that folder.
- **How to run:** Open [`docs/breakout.html`](../../docs/breakout.html) directly, or serve the published folder:

  ```bash
  python3 -m http.server 8000 --directory docs
  # then open http://localhost:8000/breakout.html
  ```

- **Controls:** A/D or ←/→ to move. Space pauses, R restarts. On touch, drag on the court or hold the two on-screen buttons.
- **Rules:** Clear one 8 × 5 wall with three lives. Each brick is 10 points; each life left at the end is worth 50 more.
- **Assets and credits:** None. The court, paddle, ball, and bricks are drawn with canvas primitives.
- **What I learned:** A brick collision is one question — flip the x velocity or the y velocity. Previous-position checks handle clean face hits; the smaller overlap decides corner hits. The gaps are wider than the ball so a side hit has room to bounce away, and fixed 120 Hz steps keep the ball from skipping over a brick.
- **Tuning:** `BASE_SPEED`, `SPEED_PER_BRICK`, and `MAX_SPEED` in `docs/breakout.js` control the difficulty curve. `PADDLE_WIDTH` and the brick grid are the other main knobs.
