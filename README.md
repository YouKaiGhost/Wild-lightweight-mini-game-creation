# Wild Lightweight Mini-Game Creation

**English** · [中文](README.zh-CN.md)

> Small games. Wild ideas.

A beginner's public workshop for tiny games and classic recreation attempts — in any language, on any engine. Everything is intentionally small: one screen, one mechanic, one sitting.

[Play Snake](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/) · [Play Pong](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/pong.html) · [Play Memory](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/memory.html) · [Play Breakout](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/breakout.html) · [Read the design notes](https://youkaighost.github.io/Wild-lightweight-mini-game-creation/#notes) · [Asset guide](assets/README.md)

---

## What is this?

This repository is a learning log, not a studio. I am rebuilding small games with whatever is smallest for the job — currently plain HTML, CSS, and JavaScript — to practice the whole loop:

1. Pick one mechanic.
2. Build a rough prototype.
3. Play it.
4. Write down what broke.
5. Make a smaller, better version.

The rule is not "use this stack." The rule is "finish something small." If a game needs a menu to explain itself, it probably belongs in the next prototype.

## Any language, any engine

The workshop is deliberately engine-agnostic. The current Snake, Pong, Memory, and Breakout demos are vanilla web because they run anywhere, but that is an example, not a requirement. Godot, Unity, Unreal, Pygame, LÖVE, Raylib, a terminal, or something strange you found on itch.io — if it helps you ship one screen, it belongs here.

- **Current demos:** `docs/` — a bilingual page and playable Snake, Pong, Memory, and Breakout recreations.
- **Future prototypes:** one folder per game under [`games/`](games/), with a README that explains the language, engine, run steps, controls, and credits.
- **Shared resources:** [`assets/`](assets/) — images, audio, fonts, models, references, and license records.

There is no required language, engine, or build system.

## Play the current demos

The demos are small Snake, Pong, Memory, and Breakout recreations with keyboard and touch controls.

- **Live site:** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/>
- **Pong:** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/pong.html>
- **Memory:** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/memory.html>
- **Breakout:** <https://youkaighost.github.io/Wild-lightweight-mini-game-creation/breakout.html>
- **Local:** open `docs/index.html`, `docs/pong.html`, `docs/memory.html`, or `docs/breakout.html` directly, or run a tiny server:

```bash
git clone https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation.git
cd Wild-lightweight-mini-game-creation
python3 -m http.server 8000 --directory docs
# then open http://localhost:8000, /pong.html, /memory.html, or /breakout.html
```

The interface is English by default. Use the **中文 / EN** button in the header to switch languages. The choice is stored in `localStorage`.

## Project layout

```text
.
├── assets/              # shared images, audio, fonts, models, references, credits
├── docs/                # bilingual showcase site + playable Snake, Pong, Memory, and Breakout demos
├── games/               # one folder per prototype, any language or engine
├── README.md
├── README.zh-CN.md
└── LICENSE
```

## Assets

All shared resources live in [`assets/`](assets/). The folder guide explains naming, formats, licenses, size limits, and how to credit third-party work:

- [Asset guide (English)](assets/README.md)
- [资源说明（中文）](assets/README.zh-CN.md)
- [Credits log](assets/CREDITS.md)

The short version: only commit assets you have the right to use, add every third-party file to `assets/CREDITS.md`, prefer engine-neutral formats, and keep large raw exports out of Git. If a web game published from `docs/` needs an asset at runtime, copy it into the published folder — GitHub Pages does not serve the top-level `assets/` directory.

## Recreation log

| Game | Status | What I am learning |
| --- | --- | --- |
| Snake | Playable · v0.1 | Grid movement, input buffering, the feeling of a near miss |
| Pong | Playable · v0.1 | Continuous collision, and a fair CPU built from limits |
| Memory | Playable · v0.1 | Turn-based state and accessibility are the whole game |
| Breakout | Playable · v0.1 | Brick collisions are mostly one question: which axis to flip |

A game stays in the queue until it is playable, not until it is perfect.

## Tiny design rules

- **One mechanic.** Each prototype explores a single verb: move, dodge, collect, or bounce.
- **The first ten seconds.** A player should be able to move, understand the goal, and fail once within ten seconds.
- **Input is design.** Buffering the next turn and forgiving a near miss matter more than extra levels.
- **Finish small.** A prototype that ends is worth more than a masterpiece that never ships.
- **Write down the failure.** A two-line note after playtesting is worth more than a week of guessing.

## Beginner promise

The code is meant to be read. The current demos have no framework to learn first, no package manager, and no hidden build pipeline. Future prototypes can use an engine; each game's README should say how to run it. If something is confusing, open an issue and I will try to make it clearer. If you are also starting out, fork it, break it, and build a smaller version.

## License

MIT. Take what is useful.
