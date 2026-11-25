# Pong, but fair

- **Status:** Playable · v0.1
- **Language:** HTML, CSS, JavaScript
- **Engine / runtime:** Browser; no build step
- **Source:** [`docs/pong.js`](../../docs/pong.js) and [`docs/pong.html`](../../docs/pong.html). The playable copy lives in `docs/` because GitHub Pages publishes that folder.
- **How to run:** Open [`docs/pong.html`](../../docs/pong.html) directly, or serve the published folder:

  ```bash
  python3 -m http.server 8000 --directory docs
  # then open http://localhost:8000/pong.html
  ```

- **Controls:** W/S or ↑/↓ to move. Space pauses, R restarts. On touch, drag on the court or hold the two on-screen buttons.
- **Rules:** First to 5 wins. The ball speeds up slightly on every paddle hit.
- **Assets and credits:** None. The court, paddles, and ball are drawn with canvas primitives.
- **What I learned:** Fixed-step simulation makes the ball behave the same at different refresh rates. A fair CPU is a set of limits — speed cap, reaction delay, and aim error — rather than perfect tracking.
- **Tuning:** The constants at the top of `docs/pong.js` control movement, bounce, and CPU fairness. Change one at a time and play a full match before changing another.
