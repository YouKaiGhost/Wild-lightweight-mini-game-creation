(function () {
  // Breakout v0.1: one wall, three lives, no power-ups.
  // Tuning lives in the constants below; see games/breakout/README.md.
  const canvas = document.getElementById('breakout-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const WIDTH = 800;
  const HEIGHT = 500;
  const PADDLE_WIDTH = 112;
  const PADDLE_HEIGHT = 14;
  const PADDLE_Y = 444;
  const PADDLE_SPEED = 620;
  const BALL_RADIUS = 8;
  const BASE_SPEED = 320;
  const SPEED_PER_BRICK = 5;
  const MAX_SPEED = 520;
  const START_LIVES = 3;
  const BRICK_COLS = 8;
  const BRICK_ROWS = 5;
  const BRICK_GAP = 18;
  const BRICK_HEIGHT = 26;
  const BRICK_TOP = 58;
  const BRICK_SIDE = 48;
  const BRICK_WIDTH = (WIDTH - BRICK_SIDE * 2 - BRICK_GAP * (BRICK_COLS - 1)) / BRICK_COLS;
  const TOTAL_BRICKS = BRICK_COLS * BRICK_ROWS;
  const MAX_BOUNCE = (60 * Math.PI) / 180;
  const STEP = 1 / 120;
  const STORAGE_KEY = 'wlmg-breakout-best';

  const COLORS = {
    court: '#f7f1e3',
    green: '#2f6b4f',
    lime: '#c7f36b',
    orange: '#e4572e'
  };

  const BRICK_COLORS = ['#e4572e', '#f2c14e', '#c7f36b', '#7aa95c', '#2f6b4f'];

  const startButton = document.getElementById('breakout-start');
  const restartButton = document.getElementById('breakout-restart');
  const overlay = document.getElementById('breakout-overlay');
  const overlayText = document.getElementById('breakout-overlay-text');
  const scoreEl = document.getElementById('breakout-score');
  const livesEl = document.getElementById('breakout-lives');
  const bestEl = document.getElementById('breakout-best');
  const leftButton = document.getElementById('breakout-left');
  const rightButton = document.getElementById('breakout-right');
  const gameSection = document.getElementById('play');

  const state = {
    phase: 'ready',
    paddleX: WIDTH / 2 - PADDLE_WIDTH / 2,
    ball: { x: WIDTH / 2, y: PADDLE_Y - BALL_RADIUS - 1, vx: 0, vy: 0 },
    bricks: [],
    score: 0,
    lives: START_LIVES,
    best: loadBest(),
    serveTimer: 0,
    newBest: false,
    keys: { left: false, right: false },
    touchDir: 0,
    pointerX: null,
    hitFlash: 0,
    lostFlash: 0,
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
      return Number.isFinite(value) && value >= 0 ? value : null;
    } catch (error) {
      return null;
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

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
    ));
  }

  function makeBricks() {
    const bricks = [];
    for (let row = 0; row < BRICK_ROWS; row += 1) {
      for (let column = 0; column < BRICK_COLS; column += 1) {
        bricks.push({
          x: BRICK_SIDE + column * (BRICK_WIDTH + BRICK_GAP),
          y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: BRICK_COLORS[row],
          alive: true
        });
      }
    }
    return bricks;
  }

  function aliveCount() {
    return state.bricks.reduce((count, brick) => count + (brick.alive ? 1 : 0), 0);
  }

  function currentSpeed() {
    const broken = TOTAL_BRICKS - aliveCount();
    return Math.min(BASE_SPEED + broken * SPEED_PER_BRICK, MAX_SPEED);
  }

  function updateStats() {
    scoreEl.textContent = String(state.score);
    livesEl.textContent = String(state.lives);
    bestEl.textContent = state.best === null ? '—' : String(state.best);
  }

  function updateStartButton() {
    let key = 'breakout.start';
    if (state.phase === 'running') {
      key = 'breakout.pause';
    } else if (state.phase === 'paused') {
      key = 'breakout.resume';
    }
    startButton.textContent = t(key);
  }

  function renderOverlayText() {
    let key = 'breakout.ready';
    if (state.phase === 'paused') {
      key = 'breakout.paused';
    } else if (state.phase === 'won') {
      key = state.newBest ? 'breakout.wonNewBest' : 'breakout.won';
    } else if (state.phase === 'over') {
      key = state.newBest ? 'breakout.overNewBest' : 'breakout.over';
    }
    overlayText.textContent = format(t(key), { score: state.score });
  }

  function showOverlay() {
    renderOverlayText();
    overlay.classList.remove('is-hidden');
  }

  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  function resetBall() {
    const center = state.paddleX + PADDLE_WIDTH / 2;
    state.ball.x = clamp(center, BALL_RADIUS, WIDTH - BALL_RADIUS);
    state.ball.y = PADDLE_Y - BALL_RADIUS - 1;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.serveTimer = 0;
  }

  function resetMatch() {
    state.score = 0;
    state.lives = START_LIVES;
    state.newBest = false;
    state.bricks = makeBricks();
    state.paddleX = WIDTH / 2 - PADDLE_WIDTH / 2;
    state.keys.left = false;
    state.keys.right = false;
    state.touchDir = 0;
    state.pointerX = null;
    state.hitFlash = 0;
    state.lostFlash = 0;
    state.phase = 'ready';
    state.accumulator = 0;
    state.lastTime = performance.now();

    resetBall();
    updateStats();
    updateStartButton();
    showOverlay();
    draw(performance.now());
  }

  function startGame() {
    if (state.phase === 'over' || state.phase === 'won') {
      resetMatch();
    }
    if (state.phase !== 'ready') {
      return;
    }

    state.phase = 'running';
    state.serveTimer = 0.8;
    state.accumulator = 0;
    state.lastTime = performance.now();
    state.ball.x = clamp(
      state.paddleX + PADDLE_WIDTH / 2,
      BALL_RADIUS,
      WIDTH - BALL_RADIUS
    );
    state.ball.y = PADDLE_Y - BALL_RADIUS - 1;
    hideOverlay();
    updateStartButton();
  }

  function togglePause() {
    if (state.phase === 'running') {
      state.phase = 'paused';
      showOverlay();
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

  function launchBall() {
    const angle = (Math.random() * 2 - 1) * 0.35;
    const speed = currentSpeed();
    state.ball.vx = Math.sin(angle) * speed;
    state.ball.vy = -Math.cos(angle) * speed;
  }

  function finishMatch(won) {
    if (state.phase === 'won' || state.phase === 'over') {
      return;
    }

    if (won) {
      state.score += state.lives * 50;
    }

    state.phase = won ? 'won' : 'over';
    state.newBest = state.score > 0
      && (state.best === null || state.score > state.best);

    if (state.newBest) {
      state.best = state.score;
      saveBest();
    }

    updateStats();
    updateStartButton();
    showOverlay();
  }

  function loseLife() {
    state.lives -= 1;
    state.lostFlash = 0.5;
    state.hitFlash = 0;
    updateStats();

    if (state.lives <= 0) {
      finishMatch(false);
      return;
    }

    resetBall();
    state.serveTimer = 1;
  }

  function setBallSpeed(speed) {
    const magnitude = Math.hypot(state.ball.vx, state.ball.vy);
    if (magnitude === 0) {
      return;
    }
    state.ball.vx = (state.ball.vx / magnitude) * speed;
    state.ball.vy = (state.ball.vy / magnitude) * speed;
  }

  function circleTouchesRect(rect) {
    const nearestX = clamp(state.ball.x, rect.x, rect.x + rect.width);
    const nearestY = clamp(state.ball.y, rect.y, rect.y + rect.height);
    const dx = state.ball.x - nearestX;
    const dy = state.ball.y - nearestY;
    return dx * dx + dy * dy <= BALL_RADIUS * BALL_RADIUS;
  }

  function findBrickHit(previousX, previousY) {
    for (let index = 0; index < state.bricks.length; index += 1) {
      const brick = state.bricks[index];
      if (!brick.alive || !circleTouchesRect(brick)) {
        continue;
      }

      const fromTop = state.ball.vy > 0
        && previousY + BALL_RADIUS <= brick.y
        && state.ball.y + BALL_RADIUS > brick.y;
      const fromBottom = state.ball.vy < 0
        && previousY - BALL_RADIUS >= brick.y + brick.height
        && state.ball.y - BALL_RADIUS < brick.y + brick.height;
      const fromLeft = state.ball.vx > 0
        && previousX + BALL_RADIUS <= brick.x
        && state.ball.x + BALL_RADIUS > brick.x;
      const fromRight = state.ball.vx < 0
        && previousX - BALL_RADIUS >= brick.x + brick.width
        && state.ball.x - BALL_RADIUS < brick.x + brick.width;

      const overlapX = Math.min(
        state.ball.x + BALL_RADIUS - brick.x,
        brick.x + brick.width - (state.ball.x - BALL_RADIUS)
      );
      const overlapY = Math.min(
        state.ball.y + BALL_RADIUS - brick.y,
        brick.y + brick.height - (state.ball.y - BALL_RADIUS)
      );

      let axis;
      if (fromTop || fromBottom) {
        axis = (fromLeft || fromRight) && overlapX < overlapY ? 'x' : 'y';
      } else if (fromLeft || fromRight) {
        axis = 'x';
      } else {
        axis = overlapX < overlapY ? 'x' : 'y';
      }

      return { brick, axis };
    }
    return null;
  }

  function breakBrick(hit) {
    const { brick, axis } = hit;
    brick.alive = false;
    state.score += 10;
    state.hitFlash = 0.16;

    if (axis === 'x') {
      state.ball.vx = -state.ball.vx;
      state.ball.x = state.ball.vx > 0
        ? brick.x + brick.width + BALL_RADIUS + 0.1
        : brick.x - BALL_RADIUS - 0.1;
    } else {
      state.ball.vy = -state.ball.vy;
      state.ball.y = state.ball.vy > 0
        ? brick.y + brick.height + BALL_RADIUS + 0.1
        : brick.y - BALL_RADIUS - 0.1;
    }

    setBallSpeed(currentSpeed());
    updateStats();

    if (aliveCount() === 0) {
      finishMatch(true);
    }
  }

  function ballTouchesPaddle() {
    return circleTouchesRect({
      x: state.paddleX,
      y: PADDLE_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    });
  }

  function bounceOffPaddle() {
    const center = state.paddleX + PADDLE_WIDTH / 2;
    const relative = clamp((state.ball.x - center) / (PADDLE_WIDTH / 2), -1, 1);
    let angle = relative * MAX_BOUNCE;

    if (Math.abs(angle) < 0.12) {
      angle = (relative === 0
        ? (Math.random() < 0.5 ? -1 : 1)
        : Math.sign(relative)) * 0.12;
    }

    const speed = currentSpeed();
    state.ball.vx = Math.sin(angle) * speed;
    state.ball.vy = -Math.abs(Math.cos(angle) * speed);
    state.ball.y = PADDLE_Y - BALL_RADIUS - 0.1;
    state.hitFlash = 0.16;
  }

  function updatePlayer(dt) {
    if (state.pointerX !== null) {
      state.paddleX = clamp(
        state.pointerX - PADDLE_WIDTH / 2,
        0,
        WIDTH - PADDLE_WIDTH
      );
      return;
    }

    let direction = 0;
    if (state.keys.left) {
      direction -= 1;
    }
    if (state.keys.right) {
      direction += 1;
    }
    direction += state.touchDir;
    direction = clamp(direction, -1, 1);

    state.paddleX = clamp(
      state.paddleX + direction * PADDLE_SPEED * dt,
      0,
      WIDTH - PADDLE_WIDTH
    );
  }

  function updateBall(dt) {
    if (state.serveTimer > 0) {
      state.ball.x = clamp(
        state.paddleX + PADDLE_WIDTH / 2,
        BALL_RADIUS,
        WIDTH - BALL_RADIUS
      );
      state.ball.y = PADDLE_Y - BALL_RADIUS - 1;
      state.serveTimer -= dt;
      if (state.serveTimer <= 0) {
        launchBall();
      }
      return;
    }

    const speed = Math.hypot(state.ball.vx, state.ball.vy);
    const substeps = Math.max(1, Math.ceil((speed * dt) / 6));
    const subDt = dt / substeps;

    for (let step = 0; step < substeps; step += 1) {
      const previousX = state.ball.x;
      const previousY = state.ball.y;

      state.ball.x += state.ball.vx * subDt;
      state.ball.y += state.ball.vy * subDt;

      if (state.ball.x - BALL_RADIUS < 0) {
        state.ball.x = BALL_RADIUS;
        state.ball.vx = Math.abs(state.ball.vx);
      }
      if (state.ball.x + BALL_RADIUS > WIDTH) {
        state.ball.x = WIDTH - BALL_RADIUS;
        state.ball.vx = -Math.abs(state.ball.vx);
      }
      if (state.ball.y - BALL_RADIUS < 0) {
        state.ball.y = BALL_RADIUS;
        state.ball.vy = Math.abs(state.ball.vy);
      }
      if (state.ball.y - BALL_RADIUS > HEIGHT) {
        loseLife();
        return;
      }

      if (state.ball.vy > 0 && ballTouchesPaddle()) {
        bounceOffPaddle();
      }

      const hit = findBrickHit(previousX, previousY);
      if (hit) {
        breakBrick(hit);
        if (state.phase !== 'running') {
          return;
        }
      }
    }
  }

  function update(dt) {
    if (state.phase !== 'running') {
      return;
    }

    state.hitFlash = Math.max(0, state.hitFlash - dt);
    state.lostFlash = Math.max(0, state.lostFlash - dt);
    updatePlayer(dt);
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
  }

  function drawLostFlash() {
    if (state.lostFlash <= 0) {
      return;
    }
    const alpha = Math.min(state.lostFlash / 0.5, 1) * 0.16;
    ctx.fillStyle = `rgba(228, 87, 46, ${alpha})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawBricks() {
    state.bricks.forEach((brick) => {
      if (!brick.alive) {
        return;
      }

      ctx.fillStyle = brick.color;
      roundedRect(brick.x, brick.y, brick.width, brick.height, 5);
      ctx.fill();

      ctx.strokeStyle = 'rgba(31, 42, 36, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      roundedRect(brick.x + 3, brick.y + 3, brick.width - 6, 5, 2.5);
      ctx.fill();
    });
  }

  function drawPaddle() {
    ctx.fillStyle = COLORS.green;
    roundedRect(state.paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, 7);
    ctx.fill();

    ctx.fillStyle = COLORS.lime;
    ctx.fillRect(state.paddleX + 5, PADDLE_Y + 4, PADDLE_WIDTH - 10, 3);
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
    drawLostFlash();
    drawBricks();
    drawPaddle();
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

  function eventToCourtX(event) {
    const rect = canvas.getBoundingClientRect();
    return clamp(((event.clientX - rect.left) / rect.width) * WIDTH, 0, WIDTH);
  }

  function movePaddleToPointer(event) {
    state.pointerX = eventToCourtX(event);
    state.paddleX = clamp(
      state.pointerX - PADDLE_WIDTH / 2,
      0,
      WIDTH - PADDLE_WIDTH
    );
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    event.preventDefault();
    movePaddleToPointer(event);

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
    if (state.pointerX === null) {
      return;
    }
    event.preventDefault();
    movePaddleToPointer(event);
  });

  function releasePointer(event) {
    state.pointerX = null;
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
      state.pointerX = null;
      state.touchDir = direction;
      state.paddleX = clamp(
        state.paddleX + direction * 10,
        0,
        WIDTH - PADDLE_WIDTH
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

      state.pointerX = null;
      state.paddleX = clamp(
        state.paddleX + direction * 40,
        0,
        WIDTH - PADDLE_WIDTH
      );

      if (state.phase === 'ready') {
        startGame();
      }
    });
  }

  bindHoldButton(leftButton, -1);
  bindHoldButton(rightButton, 1);

  const keyDirections = {
    arrowleft: 'left',
    a: 'left',
    arrowright: 'right',
    d: 'right'
  };

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

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

      state.pointerX = null;
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
    renderOverlayText();
    updateStartButton();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.phase === 'running') {
      togglePause();
    }
  });

  window.addEventListener('blur', () => {
    state.keys.left = false;
    state.keys.right = false;
    state.touchDir = 0;
    state.pointerX = null;
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
