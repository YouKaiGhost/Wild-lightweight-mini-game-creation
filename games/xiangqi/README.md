# Xiangqi, but local

- **Status:** Playable · v0.1
- **Language:** HTML, CSS, JavaScript
- **Engine / runtime:** Browser; no build step
- **Source:** [`docs/xiangqi-rules.js`](../../docs/xiangqi-rules.js) and [`docs/xiangqi.js`](../../docs/xiangqi.js). The playable copy lives in `docs/` because GitHub Pages publishes that folder.
- **How to run:** Open [`docs/xiangqi.html`](../../docs/xiangqi.html) directly, or serve the published folder:

  ```bash
  python3 -m http.server 8000 --directory docs
  # then open http://localhost:8000/xiangqi.html
  ```

- **Controls:** Click or tap a piece, then a highlighted point. Arrow keys move focus; Enter or Space selects or moves. New game resets the board.
- **Rules:** Local two-player Chinese chess. Red moves first. All legal moves, check, checkmate, and stalemate are handled. The side with no legal move loses.
- **Not in v0.1:** AI, clocks, undo, move notation, and repetition/perpetual-check rules.
- **Assets and credits:** None. Pieces use Unicode Xiangqi characters and the board is inline SVG.
- **What I learned:** The palace, river, horse leg, elephant eye, and cannon screen are all board constraints. Keeping the rules in a pure module made the perft checks possible: the initial position gives 44 / 1,920 / 79,666 nodes at depths 1–3.
- **Rules note:** The general and advisors stay in the 3 × 3 palace; elephants stay on their own side of the river; horses can be blocked at the leg; cannons need exactly one screen to capture; soldiers gain sideways moves after crossing the river. A position with the two generals facing on an open file is illegal.
- **Tuning:** Board interaction lives in `docs/xiangqi.js`; move generation and legal-move filtering live in `docs/xiangqi-rules.js`.
