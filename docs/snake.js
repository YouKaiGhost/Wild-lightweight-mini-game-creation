(function () {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const COLS = 20;
  const ROWS = 20;
  const CELL = canvas.width / COLS;
  const STORAGE_KEY = 'wlmg-snake-best';

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const overlay = document.getElementById('game-overlay');
  const overlayText = document.getElementById('overlay-text');
  const gameSection = document.getElementById('play');

  const state = {
    snake: [],
    direction: { x: 1, y: 0 },
    directionQueue: [],
    food: { x: 0, y: 0 },
    score: 0,
    best: loadBest(),
    phase: 'ready',
    timer: null,
    stepMs: 140,
    messageKey: 'game.ready',
    newBest: false,
    recordBroken: false,
    gameInView: false
  };

  function loadBest() {
    try {
      const value = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBest() {
    try {
      localStorage.setItem(STORAGE_KEY, String(state.best));
    } catch (error) {
      // The game still works if storage is unavailable.
    }
  }

  function t(key) {
    return window.I18N ? window.I18N.t(key) : key;
  }

  function sameCell(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function randomFood() {
    const free = [];
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (!state.snake.some((segment) => segment.x === x && segment.y === y)) {
          free.push({ x, y });
        }
      }
    }
    if (free.length === 0) {
      return null;
    }
    return free[Math.floor(Math.random() * free.length)];
  }

  function clearTimer() {
    if (state.timer !== null) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function schedule() {
    clearTimer();
    state.timer = window.setInterval(step, state.stepMs);
  }

  function updateScore() {
    scoreEl.textContent = String(state.score);
    bestEl.textContent = String(state.best);
  }

  function updateButton() {
    let key = 'game.start';
    if (state.phase === 'running') {
      key = 'game.pause';
    } else if (state.phase === 'paused') {
      key = 'game.resume';
    }
    startButton.textContent = t(key);
  }

  function renderOverlayText() {
    const base = t(state.messageKey);
    overlayText.textContent = state.newBest && state.phase === 'over'
      ? t('game.newBestOver')
      : base;
  }

  function showOverlay(key) {
    state.messageKey = key;
    renderOverlayText();
    overlay.classList.remove('is-hidden');
  }

  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  function reset() {
    clearTimer();
    state.snake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 }
    ];
    state.direction = { x: 1, y: 0 };
    state.directionQueue = [];
    state.food = randomFood();
    state.score = 0;
    state.stepMs = 140;
    state.phase = 'ready';
    state.newBest = false;
    state.recordBroken = false;
    updateScore();
    updateButton();
    showOverlay('game.ready');
    draw(performance.now());
  }

  function startGame() {
    if (state.phase === 'over') {
      reset();
    }
    if (state.phase !== 'ready') {
      return;
    }
    state.phase = 'running';
    hideOverlay();
    updateButton();
    schedule();
  }

  function togglePause() {
    if (state.phase === 'running') {
      state.phase = 'paused';
      clearTimer();
      showOverlay('game.paused');
      updateButton();
      return;
    }
    if (state.phase === 'paused') {
      state.phase = 'running';
      hideOverlay();
      updateButton();
      schedule();
    }
  }

  function primaryAction() {
    if (state.phase === 'running' || state.phase === 'paused') {
      togglePause();
      return;
    }
    startGame();
  }

  function restart() {
    reset();
    startGame();
  }

  function gameOver() {
    clearTimer();
    state.phase = 'over';
    state.newBest = state.recordBroken;
    updateScore();
    updateButton();
    showOverlay('game.over');
  }

  function setDirection(x, y) {
    const last = state.directionQueue.length > 0
      ? state.directionQueue[state.directionQueue.length - 1]
      : state.direction;

    if (x === -last.x && y === -last.y) {
      return;
    }

    if (x === last.x && y === last.y) {
      if (state.phase === 'paused') {
        togglePause();
      }
      return;
    }

    if (state.directionQueue.length >= 2) {
      return;
    }

    state.directionQueue.push({ x, y });

    if (state.phase === 'ready') {
      startGame();
    } else if (state.phase === 'paused') {
      togglePause();
    }
  }

  function step() {
    if (state.directionQueue.length > 0) {
      state.direction = state.directionQueue.shift();
    }

    const head = state.snake[0];
    const next = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y
    };

    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      gameOver();
      return;
    }

    const willEat = sameCell(next, state.food);
    const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
    if (bodyToCheck.some((segment) => sameCell(segment, next))) {
      gameOver();
      return;
    }

    state.snake.unshift(next);

    if (willEat) {
      state.score += 1;
      state.food = randomFood();

      if (state.score > state.best) {
        state.best = state.score;
        state.recordBroken = true;
        saveBest();
      }

      updateScore();

      if (!state.food) {
        gameOver();
        return;
      }

      if (state.score % 3 === 0 && state.stepMs > 80) {
        state.stepMs -= 8;
        schedule();
      }
    } else {
      state.snake.pop();
    }

    draw(performance.now());
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function drawGrid() {
    ctx.fillStyle = '#f7f1e3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(31, 42, 36, 0.055)';
    ctx.lineWidth = 1;
    for (let x = 1; x < COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 1; y < ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }
  }

  function drawSnake() {
    state.snake.forEach((segment, index) => {
      const x = segment.x * CELL + 2;
      const y = segment.y * CELL + 2;
      const size = CELL - 4;

      ctx.fillStyle = index === 0 ? '#1d4a36' : (index % 2 === 0 ? '#357a5a' : '#2f6b4f');
      roundedRect(x, y, size, size, 7);
      ctx.fill();

      if (index === 0) {
        const centerX = segment.x * CELL + CELL / 2;
        const centerY = segment.y * CELL + CELL / 2;
        const dir = state.direction;
        const eyeOffset = 5.5;
        const eyeRadius = 2.6;
        let eyes;

        if (dir.x === 1) {
          eyes = [{ x: centerX + eyeOffset, y: centerY - 4.5 }, { x: centerX + eyeOffset, y: centerY + 4.5 }];
        } else if (dir.x === -1) {
          eyes = [{ x: centerX - eyeOffset, y: centerY - 4.5 }, { x: centerX - eyeOffset, y: centerY + 4.5 }];
        } else if (dir.y === -1) {
          eyes = [{ x: centerX - 4.5, y: centerY - eyeOffset }, { x: centerX + 4.5, y: centerY - eyeOffset }];
        } else {
          eyes = [{ x: centerX - 4.5, y: centerY + eyeOffset }, { x: centerX + 4.5, y: centerY + eyeOffset }];
        }

        ctx.fillStyle = '#f7f1e3';
        eyes.forEach((eye) => {
          ctx.beginPath();
          ctx.arc(eye.x, eye.y, eyeRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }

  function drawFood(time) {
    if (!state.food || state.food.x < 0) {
      return;
    }

    const centerX = state.food.x * CELL + CELL / 2;
    const centerY = state.food.y * CELL + CELL / 2;
    const pulse = 1 + Math.sin((time || 0) / 280) * 0.055;
    const radius = 8.4 * pulse;

    ctx.fillStyle = '#e4572e';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 1.5, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7aa95c';
    ctx.beginPath();
    ctx.ellipse(centerX + 4, centerY - 7.5, 5.2, 2.8, -0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#5c3b2e';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 6);
    ctx.lineTo(centerX, centerY - 10);
    ctx.stroke();
  }

  function draw(time) {
    drawGrid();
    drawFood(time);
    drawSnake();
  }

  function frame(time) {
    draw(time);
    window.requestAnimationFrame(frame);
  }

  startButton.addEventListener('click', primaryAction);
  restartButton.addEventListener('click', restart);

  document.querySelectorAll('[data-dir]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const direction = button.dataset.dir;
      if (direction === 'up') {
        setDirection(0, -1);
      } else if (direction === 'down') {
        setDirection(0, 1);
      } else if (direction === 'left') {
        setDirection(-1, 0);
      } else if (direction === 'right') {
        setDirection(1, 0);
      }
    });
  });

  const keyDirections = {
    arrowup: [0, -1],
    w: [0, -1],
    arrowdown: [0, 1],
    s: [0, 1],
    arrowleft: [-1, 0],
    a: [-1, 0],
    arrowright: [1, 0],
    d: [1, 0]
  };

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }

    const key = event.key.toLowerCase();
    const direction = keyDirections[key];
    const isGameKey = Boolean(direction) || key === ' ' || key === 'r';

    if (!isGameKey) {
      return;
    }

    const active = state.phase === 'running' || state.phase === 'paused';
    if (!active && !state.gameInView) {
      return;
    }

    if (direction) {
      event.preventDefault();
      setDirection(direction[0], direction[1]);
      return;
    }

    if (key === ' ') {
      event.preventDefault();
      primaryAction();
      return;
    }

    if (key === 'r') {
      event.preventDefault();
      restart();
    }
  });

  document.addEventListener('languagechange', () => {
    renderOverlayText();
    updateButton();
  });

  if ('IntersectionObserver' in window && gameSection) {
    const observer = new IntersectionObserver((entries) => {
      state.gameInView = entries[0].isIntersecting;
    }, { threshold: 0.35 });
    observer.observe(gameSection);
  } else {
    state.gameInView = true;
  }

  reset();
  window.requestAnimationFrame(frame);
})();
