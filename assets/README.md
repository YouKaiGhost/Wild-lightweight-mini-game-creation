# Shared Assets

This folder is the common resource shelf for every game in the repository, regardless of language or engine.

The rule is simple: if more than one prototype might use it, it belongs here. If an asset is specific to one game, keep it next to that game instead.

## What goes where

| Folder | Contents | Preferred formats |
| --- | --- | --- |
| `images/` | Sprites, textures, backgrounds, UI art, icons | SVG, PNG, WebP |
| `audio/` | Music, sound effects, ambience | OGG, WAV, MP3 |
| `fonts/` | Fonts used by games or the site | WOFF2, TTF, OTF |
| `models/` | 3D models, rigs, animations | glTF / GLB, OBJ, FBX |
| `references/` | Mood boards, design notes, links, screenshots | Markdown, PDF, PNG |
| `licenses/` | Full license texts when an asset requires one | TXT, Markdown |

`CREDITS.md` is the attribution log. Every third-party file gets a row there before it is committed.

## Rules

1. **License first.** Only commit assets you created or have the right to redistribute.
2. **Credit every third-party asset.** Add a row to [`CREDITS.md`](CREDITS.md): file, author, source URL, license, and where it is used.
3. **Prefer engine-neutral formats.** glTF over a proprietary scene file, PNG/SVG over a layered editor file, OGG/WAV over a proprietary codec.
4. **Keep it small.** Optimize images and audio before committing. If a raw export is large, keep it out of Git and link to it from the game README, or use Git LFS.
5. **Name for humans.** Use lowercase kebab-case and a short category prefix, for example `images/ui-button-primary.svg` or `audio/sfx-pickup-01.ogg`.
6. **No secrets or personal data.** No API keys, private recordings, or personal photos.
7. **Keep source files when practical.** A layered source file can live beside the export if it is useful and reasonably small.
8. **Mind the publishing boundary.** GitHub Pages serves only the `docs/` folder. If a web game in `docs/` needs an asset at runtime, copy the asset into the published folder (or load it from a stable URL). The top-level `assets/` folder is the source of truth, not a public CDN.

## Suggested layout

```text
assets/
├── README.md
├── README.zh-CN.md
├── CREDITS.md
├── images/
├── audio/
├── fonts/
├── models/
├── references/
└── licenses/
```

## Manifest template

Copy this row into `CREDITS.md` for each third-party asset:

| File | Author | Source | License | Used in | Notes |
| --- | --- | --- | --- | --- | --- |
| `images/example.png` | Example Artist | https://example.com | CC BY 4.0 | `games/my-game` | Cropped and recolored |

If you made the asset yourself, write `Original` in the Author column and choose a license for the repository (MIT covers code; art may need its own license statement).

## Using assets from a game

- **Godot / Unity / Unreal:** import from this folder or copy the needed files into the project; document the version and import settings in the game README.
- **Pygame / LÖVE / Raylib:** load files with relative paths from the game folder. If the game is distributed separately, include the assets it needs.
- **Web:** reference the asset from the page or copy it into `docs/`; remember the GitHub Pages boundary above.

When in doubt, add a line to `CREDITS.md` and a note to the game README. Future you will thank present you.
