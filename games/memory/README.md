# Memory, but tiny

- **Status:** Playable · v0.1
- **Language:** HTML, CSS, JavaScript
- **Engine / runtime:** Browser; no build step
- **Source:** [`docs/memory.js`](../../docs/memory.js) and [`docs/memory.html`](../../docs/memory.html). The playable copy lives in `docs/` because GitHub Pages publishes that folder.
- **How to run:** Open [`docs/memory.html`](../../docs/memory.html) directly, or serve the published folder:

  ```bash
  python3 -m http.server 8000 --directory docs
  # then open http://localhost:8000/memory.html
  ```

- **Controls:** Tap or click two cards. Keyboard: Tab to a card, then Enter or Space to flip. R restarts.
- **Rules:** Eight pairs on a 4 × 4 board. A move is two cards. Match every pair in as few moves as possible.
- **Assets and credits:** None. The cards use Unicode symbols and the site palette.
- **What I learned:** A comparison is a state, not just a timeout. Locking the board while a mismatch is visible prevents the classic third-card bug. Using real buttons and labels also makes the game work with a keyboard and a screen reader.
- **Tuning:** `FLIP_BACK_MS` in `docs/memory.js` controls how long a mismatch stays visible. The board size and symbol list are the other two knobs.
