# Wild Lightweight Mini-Game Creation

**English** · [中文](README.zh-CN.md)

> Small games. Wild ideas.

A beginner's public workshop for tiny games and classic recreation attempts. Everything here is intentionally small: one screen, one mechanic, one sitting.

[Play the live demo](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/) · [Read the design notes](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/#notes)

---

## What is this?

This repository is a learning log, not a studio. I am rebuilding small games with plain HTML, CSS, and JavaScript to practice the whole loop:

1. Pick one mechanic.
2. Build a rough prototype.
3. Play it.
4. Write down what broke.
5. Make a smaller, better version.

No engine, no build step, no dependencies. If a game needs a menu to explain itself, it probably belongs in the next prototype.

## Play

The demo is a small Snake recreation with keyboard and touch controls.

- **Live site:** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/>
- **Local:** open `docs/index.html` directly, or run a tiny server:

```bash
git clone https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation.git
cd Wild-lightweight-mini-game-creation
python3 -m http.server 8000 --directory docs
# then open http://localhost:8000
```

The interface is English by default. Use the **中文 / EN** button in the header to switch languages. The choice is stored in `localStorage`.

## What is inside

| Path | Purpose |
| --- | --- |
| `docs/index.html` | The bilingual landing page and playable Snake demo |
| `docs/styles.css` | The whole visual system: warm paper, green ink, one orange accent |
| `docs/i18n.js` | English/Chinese dictionary and language toggle |
| `docs/snake.js` | The Snake recreation: grid movement, food, score, pause, touch pad |
| `docs/app.js` | Small page interactions that are not part of the game |
| `README.md` | English overview |
| `README.zh-CN.md` | Chinese overview |
| `LICENSE` | MIT |

## Recreation log

| Game | Status | What I am learning |
| --- | --- | --- |
| Snake | Playable · v0.1 | Grid movement, input buffering, the feeling of a near miss |
| Pong | Sketch | Ball physics is easy; fair paddles are not |
| Breakout | Queued | A good level is a rhythm, not a wall |
| Memory | Queued | Fewer cards can make a better game |

A game stays in the queue until it is playable, not until it is perfect.

## Tiny design rules

- **One mechanic.** Each prototype explores a single verb: move, dodge, collect, or bounce.
- **The first ten seconds.** A player should be able to move, understand the goal, and fail once within ten seconds.
- **Input is design.** Buffering the next turn and forgiving a near miss matter more than extra levels.
- **Finish small.** A prototype that ends is worth more than a masterpiece that never ships.
- **Write down the failure.** A two-line note after playtesting is worth more than a week of guessing.

## Beginner promise

The code is meant to be read. There is no framework to learn first, no package manager, and no hidden build pipeline. If something is confusing, open an issue and I will try to make it clearer. If you are also starting out, fork it, break it, and build a smaller version.

## License

MIT. Take what is useful.
