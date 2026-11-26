(function () {
  const STORAGE_KEY = 'wlmg-lang';
  const SUPPORTED = ['en', 'zh'];

  const translations = {
    en: {
      'meta.title': 'Wild Lightweight Mini-Game Creation',
      'meta.description': "A beginner's engine-agnostic workshop for lightweight mini-games and classic recreation attempts, including tiny Snake, Pong, Memory, and Breakout demos.",
      'meta.pongTitle': 'Pong, but fair — Wild Lightweight Mini-Game Creation',
      'meta.pongDescription': 'A tiny Pong recreation with a fair CPU, fixed-step physics, and keyboard or touch controls.',
      'meta.memoryTitle': 'Memory, but tiny — Wild Lightweight Mini-Game Creation',
      'meta.memoryDescription': 'A tiny 4 × 4 memory game with eight pairs, a move counter, keyboard play, and a local best score.',
      'meta.breakoutTitle': 'Breakout, but one wall — Wild Lightweight Mini-Game Creation',
      'meta.breakoutDescription': 'A one-wall Breakout recreation with fixed-step physics, three lives, and no power-ups.',
      'skip': 'Skip to content',
      'nav.snake': 'Snake',
      'nav.pong': 'Pong',
      'nav.memory': 'Memory',
      'nav.breakout': 'Breakout',
      'nav.log': 'Recreation log',
      'nav.notes': 'Design notes',
      'nav.assets': 'Assets',
      'nav.about': 'About',
      'lang.switchToChinese': 'Switch to Chinese',
      'lang.switchToEnglish': 'Switch to English',

      'hero.kicker': "A beginner's tiny-game workshop",
      'hero.title1': 'Small games.',
      'hero.title2': 'Wild ideas.',
      'hero.lead': 'I am learning game-making by rebuilding tiny classics, one screen at a time. The tools can change — a browser, a game engine, a terminal — but the goal stays small: readable code and games you can finish in a coffee break.',
      'hero.ctaPlay': 'Play the Snake demo',
      'hero.ctaNotes': 'Read the design notes',
      'hero.meta': 'Any language · Any engine · Beginner-friendly',

      'about.kicker': 'What this is',
      'about.title': 'A public notebook for lightweight game design',
      'about.p1': 'This repository collects small, finishable game experiments. The goal is not to ship a commercial title. The goal is to practice the whole loop: choose one mechanic, build a rough prototype, play it, write down what broke, and try again.',
      'about.p2': 'Everything here is intentionally modest: each demo opens as a plain HTML file, the rules fit on one screen, and the code stays short enough to read in one sitting. Future prototypes may use a different language or engine, but the same size limit applies.',
      'about.card1.title': 'One mechanic',
      'about.card1.text': 'Each prototype explores a single verb: move, dodge, collect, or bounce. Depth comes from constraints, not feature lists.',
      'about.card2.title': 'Recreate first',
      'about.card2.text': 'Rebuilding a classic is an honest way to learn. The rules are known, so the lesson is in the implementation and the feel.',
      'about.card3.title': 'Finish small',
      'about.card3.text': 'A prototype that ends is worth more than a masterpiece that never ships. One screen, one score, one more try.',

      'stack.kicker': 'Any stack',
      'stack.title': 'Any language. Any engine.',
      'stack.lead': 'The goal is to finish a small game, not to defend a tool. Use Godot, Unity, Pygame, LÖVE, Raylib, plain web, or something else — if it helps you ship one screen, it belongs here.',
      'stack.note': 'The current Snake, Pong, Memory, and Breakout demos are vanilla web because they run anywhere. The next prototype does not have to be.',
      'stack.tagsLabel': 'Example tools and engines',
      'stack.tag.web': 'Plain web',
      'stack.tag.terminal': 'Terminal',

      'game.kicker': 'Recreation 01',
      'game.title': 'Snake, but tiny',
      'game.lead': 'Arrow keys / WASD to steer. Space to pause. The canvas is the whole game.',
      'game.overlayTitle': 'SNAKE',
      'game.ready': 'Press Start or an arrow key.',
      'game.caption': 'A 20 × 20 grid, three starting segments, and no mercy at the walls.',
      'game.score': 'Score',
      'game.best': 'Best',
      'game.start': 'Start',
      'game.pause': 'Pause',
      'game.resume': 'Resume',
      'game.restart': 'Restart',
      'game.controls': 'Keyboard: arrows / WASD · Space: pause · R: restart',
      'game.touch': 'Touch: use the pad below',
      'game.note': 'The best score is stored only in your browser.',
      'game.up': 'Up',
      'game.down': 'Down',
      'game.left': 'Left',
      'game.right': 'Right',
      'game.boardLabel': 'Snake game board',
      'game.touchLabel': 'Touch controls',
      'game.paused': 'Paused.',
      'game.over': 'Game over. Press Start to try again.',
      'game.newBest': 'New best!',
      'game.newBestOver': 'New best! Press Start for another run.',
      'game.nextPong': 'Next: Pong, but fair →',

      'pong.kicker': 'Recreation 02',
      'pong.title': 'Pong, but fair',
      'pong.lead': 'First to 5. You get one paddle; the CPU gets limits, a reaction delay, and a small aim error.',
      'pong.overlayTitle': 'PONG',
      'pong.ready': 'Press Start or move your paddle.',
      'pong.caption': 'First to 5. The ball gets faster on every paddle hit.',
      'pong.you': 'You',
      'pong.cpu': 'CPU',
      'pong.firstTo': 'First to',
      'pong.bestRally': 'Best rally',
      'pong.start': 'Start',
      'pong.pause': 'Pause',
      'pong.resume': 'Resume',
      'pong.restart': 'Restart',
      'pong.controls': 'Keyboard: W/S or ↑/↓ · Space: pause · R: restart',
      'pong.touch': 'Touch: drag on the court, or hold the buttons below',
      'pong.note': 'Your best rally is stored only in your browser.',
      'pong.up': 'Move up',
      'pong.down': 'Move down',
      'pong.boardLabel': 'Pong game court',
      'pong.touchLabel': 'Touch paddle controls',
      'pong.paused': 'Paused.',
      'pong.youWin': 'You win the match. Press Start for a rematch.',
      'pong.cpuWin': 'CPU wins the match. Press Start for a rematch.',
      'pong.notesKicker': 'Prototype notes',
      'pong.notesTitle': 'What this one is teaching me',
      'pong.notesLead': 'Two things I had to fix before the rally felt fair.',
      'pong.note1Title': 'Fixed step first',
      'pong.note1Text': 'Draw at the screen rate, simulate at 120 Hz. The ball behaves the same on a 60 Hz and a 144 Hz display, and small steps make tunnelling impossible at this speed.',
      'pong.note2Title': 'Fair is not perfect',
      'pong.note2Text': 'The CPU has a speed cap, a reaction delay, and a small aim error. Losing should feel like a mistake you can learn from, not a trick.',
      'pong.nextMemory': 'Next: Memory, but tiny →',

      'memory.kicker': 'Recreation 03',
      'memory.title': 'Memory, but tiny',
      'memory.lead': 'Eight pairs, sixteen cards, one sitting. Find them in as few moves as you can.',
      'memory.overlayTitle': 'MEMORY',
      'memory.ready': 'Press Start, or tap a card.',
      'memory.caption': 'A 4 × 4 board. A move is two cards.',
      'memory.moves': 'Moves',
      'memory.bestMoves': 'Best moves',
      'memory.start': 'Start',
      'memory.restart': 'Restart',
      'memory.playAgain': 'Play again',
      'memory.controls': 'Keyboard: Tab to a card, Enter or Space to flip · R: restart',
      'memory.touch': 'Touch: tap two cards.',
      'memory.note': 'Your best moves are stored only in your browser.',
      'memory.boardLabel': 'Memory card board',
      'memory.hiddenCard': 'Hidden card {number}',
      'memory.matched': 'matched',
      'memory.win': 'All 8 pairs found in {moves} moves. Press Play again for another board.',
      'memory.winNewBest': 'New best! All 8 pairs found in {moves} moves. Press Play again for another board.',
      'memory.symbol.star': 'Star',
      'memory.symbol.circle': 'Circle',
      'memory.symbol.triangle': 'Triangle',
      'memory.symbol.square': 'Square',
      'memory.symbol.diamond': 'Diamond',
      'memory.symbol.cross': 'Cross',
      'memory.symbol.moon': 'Moon',
      'memory.symbol.gem': 'Gem',
      'memory.notesKicker': 'Prototype notes',
      'memory.notesTitle': 'What this one is teaching me',
      'memory.notesLead': 'Two small rules that keep a memory game from feeling broken.',
      'memory.note1Title': 'Lock the board',
      'memory.note1Text': 'Comparing two cards is a state, not a timeout. The board ignores taps while a mismatch is showing. One locked flag prevents the classic third-card bug.',
      'memory.note2Title': 'Fewer cards',
      'memory.note2Text': 'A 4 × 4 board is enough. Eight pairs fit one screen and one sitting; more cards would make the game longer, not deeper.',
      'memory.nextBreakout': 'Next: Breakout, but one wall →',

      'breakout.kicker': 'Recreation 04',
      'breakout.title': 'Breakout, but one wall',
      'breakout.lead': 'One wall, three lives, no power-ups. Clear every brick.',
      'breakout.overlayTitle': 'BREAKOUT',
      'breakout.ready': 'Press Start or move the paddle.',
      'breakout.caption': 'One 8 × 5 wall, three lives, no power-ups.',
      'breakout.score': 'Score',
      'breakout.lives': 'Lives',
      'breakout.best': 'Best',
      'breakout.start': 'Start',
      'breakout.pause': 'Pause',
      'breakout.resume': 'Resume',
      'breakout.restart': 'Restart',
      'breakout.scoring': '10 per brick · +50 per life left',
      'breakout.controls': 'Keyboard: A/D or ←/→ · Space: pause · R: restart',
      'breakout.touch': 'Touch: drag on the court, or hold the buttons below',
      'breakout.note': 'Your best score is stored only in your browser.',
      'breakout.boardLabel': 'Breakout game court',
      'breakout.touchLabel': 'Touch paddle controls',
      'breakout.left': 'Move left',
      'breakout.right': 'Move right',
      'breakout.paused': 'Paused.',
      'breakout.over': 'Game over. Score {score}. Press Start to try again.',
      'breakout.overNewBest': 'New best! Score {score}. Press Start to try again.',
      'breakout.won': 'Wall cleared! Score {score}. Press Start for another wall.',
      'breakout.wonNewBest': 'New best! Wall cleared with {score}. Press Start for another wall.',
      'breakout.notesKicker': 'Prototype notes',
      'breakout.notesTitle': 'What this one is teaching me',
      'breakout.notesLead': 'Two rules that keep the wall from feeling random.',
      'breakout.note1Title': 'Bounce by the smaller overlap',
      'breakout.note1Text': 'The ball picks the axis with the smaller penetration, so a corner hit flips one direction instead of both. Previous-position checks handle clean face hits, and the gaps are wider than the ball so a side hit has room to bounce away.',
      'breakout.note2Title': 'One wall is enough',
      'breakout.note2Text': 'Five rows and three lives make a complete game. More rows would make it longer, not better; power-ups belong to another prototype.',

      'log.kicker': 'Recreation log',
      'log.title': 'What I have rebuilt so far',
      'log.lead': 'A public list, including the failures. A game stays in the queue until it is playable, not until it is perfect.',
      'log.game': 'Game',
      'log.status': 'Status',
      'log.lesson': 'Lesson',
      'log.snake': 'Snake',
      'log.snakeStatus': 'Playable · v0.1',
      'log.snakeLesson': 'Grid movement and input buffering are most of the feel.',
      'log.pong': 'Pong',
      'log.pongStatus': 'Playable · v0.1',
      'log.pongLesson': 'Continuous collision, and a fair CPU built from limits.',
      'log.breakout': 'Breakout',
      'log.breakoutStatus': 'Playable · v0.1',
      'log.breakoutLesson': 'Brick collisions are mostly one question: which axis to flip.',
      'log.memory': 'Memory',
      'log.memoryStatus': 'Playable · v0.1',
      'log.memoryLesson': 'Turn-based state and accessibility are the whole game.',

      'notes.kicker': 'Tiny design notes',
      'notes.title': 'Rules I keep relearning',
      'notes.lead': 'Short notes from building small games. They are opinions, not laws.',
      'notes.card1.title': 'The first 10 seconds',
      'notes.card1.text': 'If a player cannot move, understand the goal, and fail once within ten seconds, the prototype is too slow.',
      'notes.card2.title': 'Input is design',
      'notes.card2.text': 'Buffering the next turn, forgiving a near miss, and showing why you died matter more than extra levels.',
      'notes.card3.title': 'Scope is a mechanic',
      'notes.card3.text': 'Every feature must earn its place on the one screen. If it needs a menu, it probably belongs in the next prototype.',
      'notes.card4.title': 'Write down the failure',
      'notes.card4.text': 'A two-line note after playtesting is worth more than a week of guessing. The log is part of the game.',

      'assets.kicker': 'Shared resources',
      'assets.title': 'A home for assets',
      'assets.lead': 'Images, audio, fonts, models, and references live in the top-level assets/ folder. Every file should have a source and a license.',
      'assets.note': 'The folder is engine-agnostic. Its README explains naming, formats, credits, and the GitHub Pages caveat.',
      'assets.cta': 'Open the assets folder',
      'assets.guide': 'Read the asset guide →',

      'maker.kicker': 'About the maker',
      'maker.title': 'A beginner, in public',
      'maker.p1': 'I am not a professional game designer. This repository is a way to learn in public: small commits, plain code, and notes that admit what I do not know yet.',
      'maker.p2': 'If you are also starting out, fork it, break it, and make a smaller version. That is the whole point.',
      'maker.link': 'See the source on GitHub →',

      'footer.note': 'This site is built with plain HTML, CSS, and JavaScript. No trackers, no build step. The games can use anything.',
      'footer.repo': 'Source on GitHub',
      'footer.assets': 'Assets guide',
      'footer.license': 'MIT licensed. Take what is useful.'
    },

    zh: {
      'meta.title': '野生轻量小游戏制作',
      'meta.description': '一个新手用来练习轻量小游戏和经典复刻的公开工坊，不限语言，不限引擎，包含贪吃蛇、乒乓、记忆翻牌和打砖块小 demo。',
      'meta.pongTitle': '乒乓，公平版 —— 野生轻量小游戏制作',
      'meta.pongDescription': '一个很小的乒乓复刻：公平的电脑对手、固定时间步物理，支持键盘和触屏。',
      'meta.memoryTitle': '记忆翻牌，小号版 —— 野生轻量小游戏制作',
      'meta.memoryDescription': '一个很小的 4 × 4 记忆翻牌游戏：八对牌、步数统计、键盘操作和本地最佳成绩。',
      'meta.breakoutTitle': '打砖块，一堵墙版 —— 野生轻量小游戏制作',
      'meta.breakoutDescription': '一个只有一堵墙的打砖块复刻：固定时间步物理、三条命、没有道具。',
      'skip': '跳到正文',
      'nav.snake': '贪吃蛇',
      'nav.pong': '乒乓',
      'nav.memory': '记忆翻牌',
      'nav.breakout': '打砖块',
      'nav.log': '复刻记录',
      'nav.notes': '设计笔记',
      'nav.assets': '资源',
      'nav.about': '关于',
      'lang.switchToChinese': '切换到中文',
      'lang.switchToEnglish': 'Switch to English',

      'hero.kicker': '一个新手的小游戏工坊',
      'hero.title1': '小游戏。',
      'hero.title2': '野想法。',
      'hero.lead': '我在用复刻小经典的方式学习做游戏，一次只做一屏。工具可以换——浏览器、游戏引擎、终端都行——目标始终很小：读得懂的代码，和一杯咖啡时间就能玩完的游戏。',
      'hero.ctaPlay': '试玩贪吃蛇',
      'hero.ctaNotes': '看看设计笔记',
      'hero.meta': '不限语言 · 不限引擎 · 新手友好',

      'about.kicker': '这是什么',
      'about.title': '一本公开的轻量游戏设计笔记',
      'about.p1': '这个仓库收集小而能做完的游戏实验。目标不是做商业作品，而是练习完整的小循环：选一个机制，搭一个粗糙原型，玩一玩，记下哪里坏了，再试一次。',
      'about.p2': '这里的一切都刻意保持轻量：每个 demo 都是可以直接打开的 HTML 文件，规则能写在一屏里，代码短到可以一口气读完。以后的原型可以换语言或引擎，但体量限制不变。',
      'about.card1.title': '一个机制',
      'about.card1.text': '每个原型只探索一个动词：移动、闪避、收集或反弹。深度来自约束，而不是功能清单。',
      'about.card2.title': '先复刻',
      'about.card2.text': '复刻经典是诚实的学习方式。规则是已知的，所以功课在实现和手感上。',
      'about.card3.title': '做小一点',
      'about.card3.text': '一个能结束的原型，比一个永远发不出的杰作更有价值。一屏、一分、再来一次。',

      'stack.kicker': '不限技术栈',
      'stack.title': '任何语言。任何引擎。',
      'stack.lead': '目标是做完一个小游戏，不是捍卫某个工具。Godot、Unity、Pygame、LÖVE、Raylib、原生网页，或者别的什么——只要能帮你做完一屏，都可以放进来。',
      'stack.note': '当前的贪吃蛇、乒乓、记忆翻牌和打砖块 demo 用原生网页，只是因为它们到处都能跑。下一个原型不必如此。',
      'stack.tagsLabel': '工具和引擎示例',
      'stack.tag.web': '原生网页',
      'stack.tag.terminal': '终端',

      'game.kicker': '复刻 01',
      'game.title': '贪吃蛇，小号版',
      'game.lead': '方向键 / WASD 控制方向，空格暂停。整个游戏就是一块画布。',
      'game.overlayTitle': '贪吃蛇',
      'game.ready': '按开始，或按方向键。',
      'game.caption': '20 × 20 的网格，初始三节，撞墙没有商量。',
      'game.score': '得分',
      'game.best': '最高',
      'game.start': '开始',
      'game.pause': '暂停',
      'game.resume': '继续',
      'game.restart': '重开',
      'game.controls': '键盘：方向键 / WASD · 空格：暂停 · R：重开',
      'game.touch': '触屏：使用下方方向键',
      'game.note': '最高分只保存在你的浏览器里。',
      'game.up': '上',
      'game.down': '下',
      'game.left': '左',
      'game.right': '右',
      'game.boardLabel': '贪吃蛇游戏棋盘',
      'game.touchLabel': '触屏方向键',
      'game.paused': '已暂停。',
      'game.over': '游戏结束。按开始再来一局。',
      'game.newBest': '新纪录！',
      'game.newBestOver': '新纪录！按开始再来一局。',
      'game.nextPong': '下一个：乒乓，公平版 →',

      'pong.kicker': '复刻 02',
      'pong.title': '乒乓，公平版',
      'pong.lead': '先到 5 分。你只有一块球拍；电脑有速度上限、反应延迟和一点瞄准误差。',
      'pong.overlayTitle': '乒乓',
      'pong.ready': '按开始，或移动球拍。',
      'pong.caption': '先到 5 分。每次被球拍击中，球都会更快一点。',
      'pong.you': '你',
      'pong.cpu': '电脑',
      'pong.firstTo': '先到',
      'pong.bestRally': '最长回合',
      'pong.start': '开始',
      'pong.pause': '暂停',
      'pong.resume': '继续',
      'pong.restart': '重开',
      'pong.controls': '键盘：W/S 或 ↑/↓ · 空格：暂停 · R：重开',
      'pong.touch': '触屏：在球场上拖动，或按住下方按钮',
      'pong.note': '最长回合只保存在你的浏览器里。',
      'pong.up': '向上移动',
      'pong.down': '向下移动',
      'pong.boardLabel': '乒乓游戏球场',
      'pong.touchLabel': '触屏球拍控制',
      'pong.paused': '已暂停。',
      'pong.youWin': '你赢下了这一局。按开始再来一场。',
      'pong.cpuWin': '电脑赢下了这一局。按开始再来一场。',
      'pong.notesKicker': '原型笔记',
      'pong.notesTitle': '这个小游戏教会我的事',
      'pong.notesLead': '让回合变得公平之前，我先修了这两件事。',
      'pong.note1Title': '先固定时间步',
      'pong.note1Text': '画面按屏幕刷新率绘制，物理按 120 Hz 模拟。球在 60 Hz 和 144 Hz 屏幕上表现一致，小步进也让这个速度下的穿模不可能发生。',
      'pong.note2Title': '公平不等于完美',
      'pong.note2Text': '电脑有速度上限、反应延迟和一点瞄准误差。输球应该像一次可以学习的失误，而不是被耍了。',
      'pong.nextMemory': '下一个：记忆翻牌，小号版 →',

      'memory.kicker': '复刻 03',
      'memory.title': '记忆翻牌，小号版',
      'memory.lead': '八对牌，十六张，一口气玩完。用尽量少的步数找齐它们。',
      'memory.overlayTitle': '记忆翻牌',
      'memory.ready': '按开始，或直接点一张牌。',
      'memory.caption': '4 × 4 的棋盘。翻开两张牌算一步。',
      'memory.moves': '步数',
      'memory.bestMoves': '最少步数',
      'memory.start': '开始',
      'memory.restart': '重开',
      'memory.playAgain': '再来一局',
      'memory.controls': '键盘：Tab 选牌，Enter 或空格翻开 · R：重开',
      'memory.touch': '触屏：点两张牌。',
      'memory.note': '最少步数只保存在你的浏览器里。',
      'memory.boardLabel': '记忆翻牌棋盘',
      'memory.hiddenCard': '第 {number} 张牌，未翻开',
      'memory.matched': '已配对',
      'memory.win': '用 {moves} 步找齐了 8 对。按“再来一局”换一副牌。',
      'memory.winNewBest': '新纪录！用 {moves} 步找齐了 8 对。按“再来一局”换一副牌。',
      'memory.symbol.star': '星星',
      'memory.symbol.circle': '圆点',
      'memory.symbol.triangle': '三角',
      'memory.symbol.square': '方块',
      'memory.symbol.diamond': '菱形',
      'memory.symbol.cross': '十字',
      'memory.symbol.moon': '月亮',
      'memory.symbol.gem': '宝石',
      'memory.notesKicker': '原型笔记',
      'memory.notesTitle': '这个小游戏教会我的事',
      'memory.notesLead': '两条小规则，让记忆游戏不至于“坏了”。',
      'memory.note1Title': '锁住棋盘',
      'memory.note1Text': '比较两张牌是一个状态，而不是一个计时器。不匹配的牌展示期间，棋盘忽略点击。一个 locked 标记就能避免经典的“第三张牌”bug。',
      'memory.note2Title': '牌少一点',
      'memory.note2Text': '4 × 4 就够了。八对牌刚好一屏、一口气能玩完；再加牌只会让游戏更长，不会更深。',
      'memory.nextBreakout': '下一个：打砖块，一堵墙版 →',

      'breakout.kicker': '复刻 04',
      'breakout.title': '打砖块，一堵墙版',
      'breakout.lead': '一堵墙，三条命，没有道具。把每块砖都清掉。',
      'breakout.overlayTitle': '打砖块',
      'breakout.ready': '按开始，或移动球拍。',
      'breakout.caption': '一堵 8 × 5 的墙，三条命，没有道具。',
      'breakout.score': '分数',
      'breakout.lives': '生命',
      'breakout.best': '最高',
      'breakout.start': '开始',
      'breakout.pause': '暂停',
      'breakout.resume': '继续',
      'breakout.restart': '重开',
      'breakout.scoring': '每块砖 10 分 · 每剩一条命 +50 分',
      'breakout.controls': '键盘：A/D 或 ←/→ · 空格：暂停 · R：重开',
      'breakout.touch': '触屏：在球场上拖动，或按住下方按钮',
      'breakout.note': '最高分只保存在你的浏览器里。',
      'breakout.boardLabel': '打砖块游戏球场',
      'breakout.touchLabel': '触屏球拍控制',
      'breakout.left': '向左移动',
      'breakout.right': '向右移动',
      'breakout.paused': '已暂停。',
      'breakout.over': '游戏结束。得分 {score}。按开始再试一次。',
      'breakout.overNewBest': '新纪录！得分 {score}。按开始再试一次。',
      'breakout.won': '清空砖墙！得分 {score}。按开始再来一堵墙。',
      'breakout.wonNewBest': '新纪录！清空砖墙，得分 {score}。按开始再来一堵墙。',
      'breakout.notesKicker': '原型笔记',
      'breakout.notesTitle': '这个小游戏教会我的事',
      'breakout.notesLead': '两条规则，让砖墙不至于显得随机。',
      'breakout.note1Title': '按较小的重叠方向反弹',
      'breakout.note1Text': '球会选择重叠更小的轴，所以擦到角落时只翻转一个方向，而不是两个都翻。用上一帧位置判断，则能处理干净的正面碰撞；砖缝比球宽，侧向碰撞才有空间弹开。',
      'breakout.note2Title': '一堵墙就够了',
      'breakout.note2Text': '五行砖加三条命，已经是一个完整的游戏。再加行数只会让它更长，不会更好；道具属于下一个原型。',

      'log.kicker': '复刻记录',
      'log.title': '目前复刻了什么',
      'log.lead': '一份公开清单，失败也算。游戏会一直留在队列里，直到能玩，而不是直到完美。',
      'log.game': '游戏',
      'log.status': '状态',
      'log.lesson': '收获',
      'log.snake': '贪吃蛇',
      'log.snakeStatus': '可玩 · v0.1',
      'log.snakeLesson': '网格移动和输入缓冲决定了大部分手感。',
      'log.pong': '乒乓',
      'log.pongStatus': '可玩 · v0.1',
      'log.pongLesson': '连续碰撞，以及用限制调出来的公平电脑。',
      'log.breakout': '打砖块',
      'log.breakoutStatus': '可玩 · v0.1',
      'log.breakoutLesson': '砖块碰撞的核心问题只有一个：该翻哪个轴。',
      'log.memory': '记忆翻牌',
      'log.memoryStatus': '可玩 · v0.1',
      'log.memoryLesson': '回合制状态和无障碍，就是这个游戏的全部。',

      'notes.kicker': '轻量设计笔记',
      'notes.title': '我反复学到的规则',
      'notes.lead': '做小游戏时记下的短笔记。是观点，不是定律。',
      'notes.card1.title': '前 10 秒',
      'notes.card1.text': '如果玩家不能在十秒内移动、理解目标并失败一次，这个原型就太慢了。',
      'notes.card2.title': '输入就是设计',
      'notes.card2.text': '缓存下一次转向、宽容一次擦边、说明你为什么死了，比多做几关更重要。',
      'notes.card3.title': '范围也是机制',
      'notes.card3.text': '每个功能都要在一屏里证明自己。如果需要菜单，它大概属于下一个原型。',
      'notes.card4.title': '记下失败',
      'notes.card4.text': '试玩后写两行笔记，比猜一个星期更有用。记录也是游戏的一部分。',

      'assets.kicker': '共享资源',
      'assets.title': '资源的家',
      'assets.lead': '图片、音频、字体、模型和参考资料都放在顶层 assets/ 文件夹。每个文件都应该有来源和许可证。',
      'assets.note': '这个文件夹不绑定引擎。里面的说明写了命名、格式、署名方式，以及 GitHub Pages 的发布边界。',
      'assets.cta': '打开资源文件夹',
      'assets.guide': '阅读资源说明 →',

      'maker.kicker': '关于作者',
      'maker.title': '新手，公开练习',
      'maker.p1': '我不是职业游戏设计师。这个仓库是公开学习的方式：小步提交、朴素代码，以及承认自己还不知道什么的笔记。',
      'maker.p2': '如果你也在起步，欢迎 fork、改坏它，再做一个更小的版本。这就是全部意义。',
      'maker.link': '在 GitHub 看源码 →',

      'footer.note': '本站用原生 HTML、CSS 和 JavaScript 构建。没有追踪器，没有构建步骤。游戏本身可以用任何技术。',
      'footer.repo': 'GitHub 源码',
      'footer.assets': '资源说明',
      'footer.license': 'MIT 许可。拿走有用的部分。'
    }
  };

  function readStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(stored)) {
        return stored;
      }
    } catch (error) {
      // localStorage can be unavailable in private mode; fall back to English.
    }
    return 'en';
  }

  let current = readStoredLang();

  function t(key) {
    const table = translations[current] || translations.en;
    return table[key] || translations.en[key] || key;
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });

    const root = document.documentElement;
    const titleKey = root.dataset.titleKey || 'meta.title';
    const descriptionKey = root.dataset.descriptionKey || 'meta.description';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', t(descriptionKey));
    }

    document.title = t(titleKey);
    root.lang = current === 'zh' ? 'zh-CN' : 'en';

    const button = document.getElementById('lang-toggle');
    if (button) {
      button.textContent = current === 'zh' ? 'EN' : '中文';
      button.setAttribute('aria-label', t(current === 'zh' ? 'lang.switchToEnglish' : 'lang.switchToChinese'));
    }

    const guideUrl = current === 'zh'
      ? 'https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation/blob/main/assets/README.zh-CN.md'
      : 'https://github.com/YouKaiGhost/Wild-lightweight-mini-game-creation/blob/main/assets/README.md';
    ['assets-guide-link', 'footer-assets-link'].forEach((id) => {
      const link = document.getElementById(id);
      if (link) {
        link.href = guideUrl;
      }
    });

    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: current } }));
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === current) {
      return;
    }
    current = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // The page still switches; only persistence is unavailable.
    }
    apply();
  }

  function toggle() {
    setLang(current === 'zh' ? 'en' : 'zh');
  }

  window.I18N = {
    t,
    setLang,
    toggle,
    apply,
    get lang() {
      return current;
    }
  };

  function init() {
    const button = document.getElementById('lang-toggle');
    if (button) {
      button.addEventListener('click', toggle);
    }
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
