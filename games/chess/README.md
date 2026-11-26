# Chess, but local

- **Status:** Playable · v0.1
- **Language:** HTML, CSS, JavaScript
- **Engine / runtime:** Browser; no build step
- **Source:** [`docs/chess-rules.js`](../../docs/chess-rules.js) and [`docs/chess.js`](../../docs/chess.js). The playable copy lives in `docs/` because GitHub Pages publishes that folder.
- **How to run:** Open [`docs/chess.html`](../../docs/chess.html) directly, or serve the published folder:

  ```bash
  python3 -m http.server 8000 --directory docs
  # then open http://localhost:8000/chess.html
  ```

- **Controls:** Click or tap a piece, then a highlighted square. Arrow keys move focus; Enter or Space selects or moves. New game resets the board.
- **Rules:** Local two-player chess. White moves first. Castling, en passant, promotion (queen/rook/bishop/knight), check, checkmate, and stalemate are handled.
- **Not in v0.1:** AI, clocks, move notation, threefold repetition, the fifty-move rule, and insufficient-material draws.
- **Assets and credits:** None. Pieces use Unicode chess glyphs and the board uses CSS.
- **What I learned:** Castling is three separate checks: the king cannot start in check, cross an attacked square, or land in check. En passant is a one-ply ghost square with a captured pawn beside the destination. Keeping both in the position object made the perft checks possible: the initial position gives 20 / 400 / 8,902 / 197,281 nodes at depths 1–4.
- **Tuning:** Board interaction lives in `docs/chess.js`; move generation, castling rights, en passant, promotion, and legal filtering live in `docs/chess-rules.js`.
