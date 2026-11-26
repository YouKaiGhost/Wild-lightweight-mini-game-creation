# Games

One folder per game. Any language, any engine.

The current playable demos are the Snake and Pong recreations in [`docs/`](../docs/) because they also serve as the bilingual showcase site. That is an example, not a rule. A future prototype can be a Godot project, a Unity scene, a Pygame script, a LÖVE cartridge, a Raylib executable, a terminal game, or something stranger.

## Suggested layout

```text
games/
└── my-game/
    ├── README.md          # what it is, how to run it, controls, credits
    ├── src/               # source code, if the engine does not dictate a layout
    ├── project.godot      # or *.unity, *.uproject, main.py, ...
    └── assets/            # game-specific assets only
```

If several games share an asset, put it in the top-level [`assets/`](../assets/) folder instead.

## Game README template

```markdown
# Game name

- **Status:** prototype / playable / paused
- **Language:**
- **Engine / runtime:** version, if any
- **How to run:**
- **Controls:**
- **Assets and credits:**
- **What I learned:**
```

## Rules

- **One game per folder.** Keep the entry point obvious.
- **Document the toolchain.** Say which language/engine and version, so someone else can run it.
- **Explain how to run it.** A command, an editor version, or a build step. No assumed setup.
- **Keep generated output out of Git.** Use releases or a download link for large builds.
- **Credit assets.** Shared assets go in `../assets/`; add third-party credits to [`../assets/CREDITS.md`](../assets/CREDITS.md) or the game README.
- **Finish small.** The goal is a playable one-screen prototype, not a production pipeline.

No language or engine is required. The only requirement is that the game can be run and understood by someone else.
