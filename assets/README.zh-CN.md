# 共享资源

这个文件夹是仓库里所有游戏的公共资源架，不限定语言，也不限定引擎。

规则很简单：如果不止一个原型可能用到它，就放在这里；如果某个资源只属于一个游戏，就放在那个游戏自己的文件夹里。

## 目录说明

| 文件夹 | 放什么 | 推荐格式 |
| --- | --- | --- |
| `images/` | 精灵图、纹理、背景、UI、图标 | SVG、PNG、WebP |
| `audio/` | 音乐、音效、环境声 | OGG、WAV、MP3 |
| `fonts/` | 游戏或站点使用的字体 | WOFF2、TTF、OTF |
| `models/` | 3D 模型、骨骼、动画 | glTF / GLB、OBJ、FBX |
| `references/` | 情绪板、设计笔记、链接、截图 | Markdown、PDF、PNG |
| `licenses/` | 需要保留完整许可证文本的资源 | TXT、Markdown |

`CREDITS.md` 是署名记录。每个第三方文件在提交前都要在表里加一行。

## 规则

1. **先看许可证。** 只提交自己创作的、或有权再分发的资源。
2. **第三方资源必须署名。** 在 [`CREDITS.md`](CREDITS.md) 里写清楚：文件、作者、来源链接、许可证、用在哪里。
3. **优先使用引擎中立格式。** glTF 优先于私有场景文件，PNG/SVG 优先于分层编辑器源文件，OGG/WAV 优先于私有编码。
4. **控制体积。** 提交前压缩图片和音频。原始导出文件太大就放在 Git 之外，在游戏 README 里给链接，或者使用 Git LFS。
5. **命名给人看。** 用小写 kebab-case，加上简短类别前缀，例如 `images/ui-button-primary.svg`、`audio/sfx-pickup-01.ogg`。
6. **不要放密钥和个人数据。** 不放 API key、私人录音、个人照片。
7. **尽量保留源文件。** 如果分层源文件有用且体积合理，可以和导出文件放在一起。
8. **注意发布边界。** GitHub Pages 只发布 `docs/` 文件夹。如果 `docs/` 里的网页游戏要在运行时加载某个资源，请把资源复制到发布目录，或从稳定 URL 加载。顶层 `assets/` 是资源源头，不是公共 CDN。

## 建议结构

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

## 清单模板

每个第三方资源都在 `CREDITS.md` 里加一行：

| 文件 | 作者 | 来源 | 许可证 | 用于 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `images/example.png` | 示例作者 | https://example.com | CC BY 4.0 | `games/my-game` | 裁切并改色 |

如果是自己做的资源，作者写 `Original`，并为仓库选择一个许可证（MIT 覆盖代码；美术资源可以单独声明）。

## 在游戏里使用资源

- **Godot / Unity / Unreal：** 从这个文件夹导入，或把需要的文件复制进项目；在游戏 README 里记录版本和导入设置。
- **Pygame / LÖVE / Raylib：** 从游戏文件夹用相对路径加载。如果游戏单独发布，把需要的资源一起打包。
- **Web：** 从页面引用资产，或复制进 `docs/`；注意上面的 GitHub Pages 边界。

拿不准时，就在 `CREDITS.md` 加一行，再在游戏 README 里补一句。未来的你会感谢现在的你。
