(function () {
  const STORAGE_KEY = 'wlmg-lang';
  const SUPPORTED = ['en', 'zh'];

  const translations = {
    en: {
      'meta.title': 'Wild Lightweight Mini-Game Creation',
      'meta.description': "A beginner's wild workshop for lightweight mini-games and classic recreation attempts.",
      'skip': 'Skip to content',
      'nav.play': 'Play',
      'nav.log': 'Recreation log',
      'nav.notes': 'Design notes',
      'nav.about': 'About',
      'lang.switchToChinese': 'Switch to Chinese',
      'lang.switchToEnglish': 'Switch to English',

      'hero.kicker': "A beginner's tiny-game workshop",
      'hero.title1': 'Small games.',
      'hero.title2': 'Wild ideas.',
      'hero.lead': 'I am learning game-making by rebuilding tiny classics, one screen at a time. No engine, no build step, no grand promise — just readable code and games you can finish in a coffee break.',
      'hero.ctaPlay': 'Play the Snake demo',
      'hero.ctaNotes': 'Read the design notes',
      'hero.meta': 'Vanilla HTML/CSS/JS · No dependencies · Beginner-friendly',

      'about.kicker': 'What this is',
      'about.title': 'A public notebook for lightweight game design',
      'about.p1': 'This repository collects small, finishable game experiments. The goal is not to ship a commercial title. The goal is to practice the whole loop: choose one mechanic, build a rough prototype, play it, write down what broke, and try again.',
      'about.p2': 'Everything here is intentionally modest: a single HTML file can be opened directly, the rules fit on one screen, and the code stays short enough to read in one sitting.',
      'about.card1.title': 'One mechanic',
      'about.card1.text': 'Each prototype explores a single verb: move, dodge, collect, or bounce. Depth comes from constraints, not feature lists.',
      'about.card2.title': 'Recreate first',
      'about.card2.text': 'Rebuilding a classic is an honest way to learn. The rules are known, so the lesson is in the implementation and the feel.',
      'about.card3.title': 'Finish small',
      'about.card3.text': 'A prototype that ends is worth more than a masterpiece that never ships. One screen, one score, one more try.',

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
      'log.pongStatus': 'Sketch',
      'log.pongLesson': 'Ball physics is easy; fair paddles are not.',
      'log.breakout': 'Breakout',
      'log.breakoutStatus': 'Queued',
      'log.breakoutLesson': 'A good level is a rhythm, not a wall.',
      'log.memory': 'Memory',
      'log.memoryStatus': 'Queued',
      'log.memoryLesson': 'Fewer cards can make a better game.',

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

      'maker.kicker': 'About the maker',
      'maker.title': 'A beginner, in public',
      'maker.p1': 'I am not a professional game designer. This repository is a way to learn in public: small commits, plain code, and notes that admit what I do not know yet.',
      'maker.p2': 'If you are also starting out, fork it, break it, and make a smaller version. That is the whole point.',
      'maker.link': 'See the source on GitHub →',

      'footer.note': 'Built with plain HTML, CSS, and JavaScript. No trackers, no build step.',
      'footer.repo': 'Source on GitHub',
      'footer.license': 'MIT licensed. Take what is useful.'
    },

    zh: {
      'meta.title': '野生轻量小游戏制作',
      'meta.description': '一个新手用来练习轻量小游戏和经典复刻的公开工坊。',
      'skip': '跳到正文',
      'nav.play': '试玩',
      'nav.log': '复刻记录',
      'nav.notes': '设计笔记',
      'nav.about': '关于',
      'lang.switchToChinese': '切换到中文',
      'lang.switchToEnglish': 'Switch to English',

      'hero.kicker': '一个新手的小游戏工坊',
      'hero.title1': '小游戏。',
      'hero.title2': '野想法。',
      'hero.lead': '我在用复刻小经典的方式学习做游戏，一次只做一屏。不用引擎，不用构建，没有宏大的承诺——只有读得懂的代码，和一杯咖啡时间就能玩完的游戏。',
      'hero.ctaPlay': '试玩贪吃蛇',
      'hero.ctaNotes': '看看设计笔记',
      'hero.meta': '原生 HTML/CSS/JS · 无依赖 · 新手友好',

      'about.kicker': '这是什么',
      'about.title': '一本公开的轻量游戏设计笔记',
      'about.p1': '这个仓库收集小而能做完的游戏实验。目标不是做商业作品，而是练习完整的小循环：选一个机制，搭一个粗糙原型，玩一玩，记下哪里坏了，再试一次。',
      'about.p2': '这里的一切都刻意保持轻量：一个 HTML 文件可以直接打开，规则能写在一屏里，代码短到可以一口气读完。',
      'about.card1.title': '一个机制',
      'about.card1.text': '每个原型只探索一个动词：移动、闪避、收集或反弹。深度来自约束，而不是功能清单。',
      'about.card2.title': '先复刻',
      'about.card2.text': '复刻经典是诚实的学习方式。规则是已知的，所以功课在实现和手感上。',
      'about.card3.title': '做小一点',
      'about.card3.text': '一个能结束的原型，比一个永远发不出的杰作更有价值。一屏、一分、再来一次。',

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
      'log.pongStatus': '草图',
      'log.pongLesson': '球的物理不难，公平的球拍才难。',
      'log.breakout': '打砖块',
      'log.breakoutStatus': '排队中',
      'log.breakoutLesson': '好关卡是节奏，不是一堵墙。',
      'log.memory': '记忆翻牌',
      'log.memoryStatus': '排队中',
      'log.memoryLesson': '牌少一点，游戏可能更好。',

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

      'maker.kicker': '关于作者',
      'maker.title': '新手，公开练习',
      'maker.p1': '我不是职业游戏设计师。这个仓库是公开学习的方式：小步提交、朴素代码，以及承认自己还不知道什么的笔记。',
      'maker.p2': '如果你也在起步，欢迎 fork、改坏它，再做一个更小的版本。这就是全部意义。',
      'maker.link': '在 GitHub 看源码 →',

      'footer.note': '用原生 HTML、CSS 和 JavaScript 构建。没有追踪器，没有构建步骤。',
      'footer.repo': 'GitHub 源码',
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

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', t('meta.description'));
    }

    document.title = t('meta.title');
    document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';

    const button = document.getElementById('lang-toggle');
    if (button) {
      button.textContent = current === 'zh' ? 'EN' : '中文';
      button.setAttribute('aria-label', t(current === 'zh' ? 'lang.switchToEnglish' : 'lang.switchToChinese'));
    }

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
