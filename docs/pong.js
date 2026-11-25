(function () {
  // Pong v0.1: fixed-step physics, a deliberately limited CPU, and no dependencies.
  // Tuning lives in the constants below; see games/pong/README.md for the notes.
  const canvas = document.getElementById('pong-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const WIDTH = 800;
  const HEIGHT = 500;
  const PADDLE_WIDTH = 14;
  const PADDLE_HEIGHT = 88;
  const PADDLE_INSET = 32;
  const BALL_RADIUS = 10;
  const WIN_SCORE = 5;
  const BASE_SPEED = 340;
  const MAX_SPEED = 620;
  const SPEED_UP = 1.055;
  const PLAYER_SPEED = 560;
  // Fairness is a set of limits: the CPU is slower than the player,
  // thinks in short bursts, and aims with a small error.
  const CPU_SPEED = 400;
  const MAX_BOUNCE = (55 * Math.PI) / 180;
  const MIN_BOUNCE = (12 * Math.PI) / 180;
  const STEP = 1 / 120;
  const STORAGE_KEY = 'wlmg-pong-best-rally';

  const PLAYER_X = PADDLE_INSET;
  const CPU_X = WIDTH - PADDLE_INSET - PADDLE_WIDTH;

  const COLORS = {
    court: '#f7f1e3',
    green: '#2f6b4f',
    greenDark: '#1d4a36',
    lime: '#c7f36b',
    orange: '#e4572e'
  };

  const startButton = document.getElementById('pong-start');
  const restartButton = document.getElementById('pong-restart');
  const overlay = document.getElementById('pong-overlay');
  const overlayText = document.getElementById('pong-overlay-text');
  const playerScoreEl = document.getElementById('pong-player-score');
  const cpuScoreEl = document.getElementById('pong-cpu-score');
  const bestRallyEl = document.getElementById('pong-best-rally');
  const winScoreEl = document.getElementById('pong-win-score');
  const upButton = document.getElementById('pong-up');
  const downButton = document.getElementById('pong-down');
  const gameSection = document.getElementById('play');

  const state = {
    phase: 'ready',
    playerY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    cpuY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ball: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 },
    playerScore: 0,
    cpuScore: 0,
    rally: 0,
    bestRally: loadBest(),
    serveTimer: 0,
    messageKey: 'pong.ready',
    keys: { up: false, down: false },
    touchDir: 0,
    pointerY: null,
    cpuTarget: HEIGHT / 2,
    cpuThink: 0,
    hitFlash: 0,
    pointFlash: 0,
    flashSide: 'player',
    accumulator: 0,
    lastTime: 0,
    gameInView: false
  };

  const reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

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
      localStorage.setItem(STORAGE_KEY, String(state.bestRally));
    } catch (error) {
      // The game still works if storage is unavailable.
    }
  }

  function t(key) {
    return window.I18N ? window.I18N.t(key) : key;
  }

  function updateScore() {
    playerScoreEl.textContent = String(state.playerScore);
    cpuScoreEl.textContent = String(state.cpuScore);
    bestRallyEl.textContent = String(state.bestRally);
    if (winScoreEl) {
      winScoreEl.textContent = String(WIN_SCORE);
    }
  }

  function updateStartButton() {
    let key = 'pong.start';
    if (state.phase === 'running') {
      key = 'pong.pause';
    } else if (state.phase === 'paused') {
      key = 'pong.resume';
    }
    startButton.textContent = t(key);
  }

  function showOverlay(key) {
    state.messageKey = key;
    overlayText.textContent = t(key);
    overlay.classList.remove('is-hidden');
  }

  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  function resetBall(direction) {
    const angle = (Math.random() * 2 - 1) * 0.35;

    state.ball.x = WIDTH / 2;
    state.ball.y = HEIGHT / 2;
    state.ball.vx = Math.cos(angle) * BASE_SPEED * direction;
    state.ball.vy = Math.sin(angle) * BASE_SPEED;
    state.serveTimer = 0;
    state.cpuTarget = HEIGHT / 2;
    state.cpuThink = 0.1;
  }

  function resetMatch() {
    state.playerScore = 0;
    state.cpuScore = 0;
    state.rally = 0;
    state.playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    state.cpuY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    state.keys.up = false;
    state.keys.down = false;
    state.touchDir = 0;
    state.pointerY = null;
    state.hitFlash = 0;
    state.pointFlash = 0;
    state.phase = 'ready';
    state.accumulator = 0;
    state.lastTime = performance.now();

    resetBall(Math.random() < 0.5 ? -1 : 1);
    updateScore();
    updateStartButton();
    showOverlay('pong.ready');
    draw(performance.now());
  }

  function startGame() {
    if (state.phase === 'over') {
      resetMatch();
    }
    if (state.phase !== 'ready') {
      return;
    }

    state.phase = 'running';
    state.serveTimer = 0.75;
    state.accumulator = 0;
    state.lastTime = performance.now();
    hideOverlay();
    updateStartButton();
  }

  function togglePause() {
    if (state.phase === 'running') {
      state.phase = 'paused';
      showOverlay('pong.paused');
      updateStartButton();
      return;
    }

    if (state.phase === 'paused') {
      state.phase = 'running';
      state.accumulator = 0;
      state.lastTime = performance.now();
      hideOverlay();
      updateStartButton();
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
    resetMatch();
    startGame();
  }

  function endMatch(winner) {
    state.phase = 'over';
    updateStartButton();
    showOverlay(winner === 'player' ? 'pong.youWin' : 'pong.cpuWin');
  }

  function scorePoint(scorer) {
    if (state.rally > state.bestRally) {
      state.bestRally = state.rally;
      saveBest();
    }

    state.rally = 0;
    state.hitFlash = 0;
    state.pointFlash = 0.55;
    state.flashSide = scorer;

    if (scorer === 'player') {
      state.playerScore += 1;
    } else {
      state.cpuScore += 1;
    }

    updateScore();

    if (state.playerScore >= WIN_SCORE || state.cpuScore >= WIN_SCORE) {
      endMatch(scorer);
      return;
    }

    // Serve toward the player who just conceded.
    resetBall(scorer === 'player' ? 1 : -1);
    state.serveTimer = 0.9;
  }

  function ballTouchesPaddle(side) {
    const paddleX = side === 'player' ? PLAYER_X : CPU_X;
    const paddleY = side === 'player' ? state.playerY : state.cpuY;
    const nearestX = clamp(state.ball.x, paddleX, paddleX + PADDLE_WIDTH);
    const nearestY = clamp(state.ball.y, paddleY, paddleY + PADDLE_HEIGHT);
    const dx = state.ball.x - nearestX;
    const dy = state.ball.y - nearestY;
    return dx * dx + dy * dy <= BALL_RADIUS * BALL_RADIUS;
  }

  function bounceOffPaddle(side) {
    const paddleY = side === 'player' ? state.playerY : state.cpuY;
    const relative = clamp(
      (state.ball.y - (paddleY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2),
      -1,
      1
    );

    let angle = relative * MAX_BOUNCE;
    if (Math.abs(angle) < MIN_BOUNCE) {
      const sign = relative === 0
        ? (Math.random() < 0.5 ? -1 : 1)
        : Math.sign(relative);
      angle = sign * MIN_BOUNCE;
    }

    const speed = Math.min(Math.hypot(state.ball.vx, state.ball.vy) * SPEED_UP, MAX_SPEED);
    const direction = side === 'player' ? 1 : -1;

    state.ball.vx = Math.cos(angle) * speed * direction;
    state.ball.vy = Math.sin(angle) * speed;
    state.ball.x = side === 'player'
      ? PLAYER_X + PADDLE_WIDTH + BALL_RADIUS
      : CPU_X - BALL_RADIUS;

    state.rally += 1;
    state.hitFlash = 0.16;

    if (state.rally > state.bestRally) {
      state.bestRally = state.rally;
      saveBest();
      updateScore();
    }
  }

  function updatePlayer(dt) {
    if (state.pointerY !== null) {
      state.playerY = clamp(state.pointerY - PADDLE_HEIGHT / 2, 0, HEIGHT - PADDLE_HEIGHT);
      return;
    }

    let direction = 0;
    if (state.keys.up) {
      direction -= 1;
    }
    if (state.keys.down) {
      direction += 1;
    }
    direction += state.touchDir;
    direction = clamp(direction, -1, 1);

    state.playerY = clamp(
      state.playerY + direction * PLAYER_SPEED * dt,
      0,
      HEIGHT - PADDLE_HEIGHT
    );
  }

  function updateCpu(dt) {
    state.cpuThink -= dt;

    if (state.cpuThink <= 0) {
      state.cpuThink = 0.09 + Math.random() * 0.08;
      state.cpuTarget = state.ball.vx > 0
        ? state.ball.y + (Math.random() * 2 - 1) * 24
        : HEIGHT / 2;
    }

    const center = state.cpuY + PADDLE_HEIGHT / 2;
    const difference = state.cpuTarget - center;
    if (Math.abs(difference) > 5) {
      const step = Math.sign(difference) * Math.min(Math.abs(difference), CPU_SPEED * dt);
      state.cpuY = clamp(state.cpuY + step, 0, HEIGHT - PADDLE_HEIGHT);
    }
  }

  function updateBall(dt) {
    if (state.serveTimer > 0) {
      state.serveTimer -= dt;
      if (state.serveTimer > 0) {
        return;
      }
    }

    const speed = Math.hypot(state.ball.vx, state.ball.vy);
    const substeps = Math.max(1, Math.ceil((speed * dt) / 6));
    const subDt = dt / substeps;

    for (let step = 0; step < substeps; step += 1) {
      state.ball.x += state.ball.vx * subDt;
      state.ball.y += state.ball.vy * subDt;

      if (state.ball.y - BALL_RADIUS < 0) {
        state.ball.y = BALL_RADIUS;
        if (state.ball.vy < 0) {
          state.ball.vy = -state.ball.vy;
        }
      } else if (state.ball.y + BALL_RADIUS > HEIGHT) {
        state.ball.y = HEIGHT - BALL_RADIUS;
        if (state.ball.vy > 0) {
          state.ball.vy = -state.ball.vy;
        }
      }

      if (state.ball.vx < 0 && ballTouchesPaddle('player')) {
        bounceOffPaddle('player');
      } else if (state.ball.vx > 0 && ballTouchesPaddle('cpu')) {
        bounceOffPaddle('cpu');
      }

      if (state.ball.x + BALL_RADIUS < 0) {
        scorePoint('cpu');
        return;
      }
      if (state.ball.x - BALL_RADIUS > WIDTH) {
        scorePoint('player');
        return;
      }
    }
  }

  function update(dt) {
    if (state.phase !== 'running') {
      return;
    }

    state.hitFlash = Math.max(0, state.hitFlash - dt);
    state.pointFlash = Math.max(0, state.pointFlash - dt);
    updatePlayer(dt);
    updateCpu(dt);
    updateBall(dt);
  }

  function fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(WIDTH * dpr);
    const height = Math.round(HEIGHT * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

  function drawCourt() {
    ctx.fillStyle = COLORS.court;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'rgba(31, 42, 36, 0.055)';
    for (let y = 18; y < HEIGHT; y += 28) {
      for (let x = 18; x < WIDTH; x += 28) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    ctx.strokeStyle = 'rgba(31, 42, 36, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, WIDTH - 36, HEIGHT - 36);

    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 26);
    ctx.lineTo(WIDTH / 2, HEIGHT - 26);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, 52, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawPointFlash() {
    if (state.pointFlash <= 0) {
      return;
    }

    const alpha = Math.min(state.pointFlash / 0.55, 1) * 0.14;
    const color = state.flashSide === 'player' ? '199, 243, 107' : '228, 87, 46';
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawPaddles() {
    ctx.fillStyle = COLORS.green;
    roundedRect(PLAYER_X, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
    ctx.fill();

    ctx.fillStyle = COLORS.greenDark;
    roundedRect(CPU_X, state.cpuY, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
    ctx.fill();

    ctx.fillStyle = COLORS.lime;
    ctx.fillRect(PLAYER_X + 3, state.playerY + 7, 3, PADDLE_HEIGHT - 14);

    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(CPU_X + PADDLE_WIDTH - 6, state.cpuY + 7, 3, PADDLE_HEIGHT - 14);
  }

  function drawBall(time) {
    const pulse = state.serveTimer > 0 && !reduceMotion
      ? 1 + Math.sin(time / 110) * 0.09
      : 1;

    if (state.hitFlash > 0) {
      const progress = 1 - state.hitFlash / 0.16;
      ctx.strokeStyle = `rgba(199, 243, 107, ${0.7 * (1 - progress)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS + progress * 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.shadowColor = 'rgba(228, 87, 46, 0.35)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = COLORS.orange;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(state.ball.x - 3, state.ball.y - 3, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(time) {
    drawCourt();
    drawPointFlash();
    drawPaddles();
    drawBall(time);
  }

  function frame(now) {
    if (!state.lastTime) {
      state.lastTime = now;
    }

    let delta = (now - state.lastTime) / 1000;
    state.lastTime = now;

    if (delta > 0.1) {
      delta = 0.1;
    }

    if (state.phase === 'running') {
      state.accumulator += delta;
      while (state.accumulator >= STEP && state.phase === 'running') {
        update(STEP);
        state.accumulator -= STEP;
      }
    } else {
      state.accumulator = 0;
    }

    draw(now);
    window.requestAnimationFrame(frame);
  }

  function eventToCourtY(event) {
    const rect = canvas.getBoundingClientRect();
    return clamp(((event.clientY - rect.top) / rect.height) * HEIGHT, 0, HEIGHT);
  }

  function movePlayerToPointer(event) {
    state.pointerY = eventToCourtY(event);
    state.playerY = clamp(state.pointerY - PADDLE_HEIGHT / 2, 0, HEIGHT - PADDLE_HEIGHT);
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    event.preventDefault();
    movePlayerToPointer(event);

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }

    if (state.phase === 'ready') {
      startGame();
    } else if (state.phase === 'paused') {
      togglePause();
    }
  });

  canvas.addEventListener('pointermove', (event) => {
    if (state.pointerY === null) {
      return;
    }
    event.preventDefault();
    movePlayerToPointer(event);
  });

  function releasePointer(event) {
    state.pointerY = null;
    if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);

  function bindHoldButton(button, direction) {
    if (!button) {
      return;
    }

    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      state.pointerY = null;
      state.touchDir = direction;
      state.playerY = clamp(
        state.playerY + direction * 8,
        0,
        HEIGHT - PADDLE_HEIGHT
      );

      if (state.phase === 'ready') {
        startGame();
      } else if (state.phase === 'paused') {
        togglePause();
      }
    });

    const release = () => {
      if (state.touchDir === direction) {
        state.touchDir = 0;
      }
    };

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);

    button.addEventListener('click', (event) => {
      if (event.detail !== 0) {
        return;
      }

      state.pointerY = null;
      state.playerY = clamp(
        state.playerY + direction * 32,
        0,
        HEIGHT - PADDLE_HEIGHT
      );

      if (state.phase === 'ready') {
        startGame();
      }
    });
  }

  bindHoldButton(upButton, -1);
  bindHoldButton(downButton, 1);

  const keyDirections = {
    arrowup: 'up',
    w: 'up',
    arrowdown: 'down',
    s: 'down'
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

    if (target && target.tagName === 'BUTTON' && key === ' ') {
      return;
    }

    const active = state.phase === 'running' || state.phase === 'paused';
    if (!active && !state.gameInView) {
      return;
    }

    if (direction) {
      event.preventDefault();
      if (event.repeat) {
        return;
      }

      state.pointerY = null;
      state.keys[direction] = true;

      if (state.phase === 'ready') {
        startGame();
      } else if (state.phase === 'paused') {
        togglePause();
      }
      return;
    }

    if (key === ' ') {
      event.preventDefault();
      if (!event.repeat) {
        primaryAction();
      }
      return;
    }

    if (key === 'r') {
      event.preventDefault();
      if (!event.repeat) {
        restart();
      }
    }
  });

  document.addEventListener('keyup', (event) => {
    const direction = keyDirections[event.key.toLowerCase()];
    if (direction) {
      state.keys[direction] = false;
    }
  });

  startButton.addEventListener('click', primaryAction);
  restartButton.addEventListener('click', restart);

  document.addEventListener('languagechange', () => {
    overlayText.textContent = t(state.messageKey);
    updateStartButton();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.phase === 'running') {
      togglePause();
    }
  });

  window.addEventListener('blur', () => {
    state.keys.up = false;
    state.keys.down = false;
    state.touchDir = 0;
    state.pointerY = null;
    if (state.phase === 'running') {
      togglePause();
    }
  });

  window.addEventListener('resize', fitCanvas);

  if ('IntersectionObserver' in window && gameSection) {
    const observer = new IntersectionObserver((entries) => {
      state.gameInView = entries[0].isIntersecting;
    }, { threshold: 0.35 });
    observer.observe(gameSection);
  } else {
    state.gameInView = true;
  }

  fitCanvas();
  resetMatch();
  window.requestAnimationFrame(frame);
})();
