(function () {
  // Memory v0.1: sixteen cards, eight pairs, and one lock flag.
  // No timer and no difficulty switch; the move count is the whole score.
  const board = document.getElementById('memory-board');
  if (!board) {
    return;
  }

  const startButton = document.getElementById('memory-start');
  const overlay = document.getElementById('memory-overlay');
  const overlayText = document.getElementById('memory-overlay-text');
  const movesEl = document.getElementById('memory-moves');
  const bestEl = document.getElementById('memory-best');

  const STORAGE_KEY = 'wlmg-memory-best-moves';
  const FLIP_BACK_MS = 750;

  const SYMBOLS = [
    { name: 'star', glyph: '★', color: '#e4572e' },
    { name: 'circle', glyph: '●', color: '#2f6b4f' },
    { name: 'triangle', glyph: '▲', color: '#1d4a36' },
    { name: 'square', glyph: '■', color: '#9a6b12' },
    { name: 'diamond', glyph: '◆', color: '#7aa95c' },
    { name: 'cross', glyph: '✚', color: '#c94c4c' },
    { name: 'moon', glyph: '☾', color: '#5f6b63' },
    { name: 'gem', glyph: '❖', color: '#c58b00' }
  ];

  const state = {
    phase: 'ready',
    cards: [],
    flipped: [],
    moves: 0,
    bestMoves: loadBest(),
    locked: false,
    newBest: false,
    flipTimer: null
  };

  function loadBest() {
    try {
      const value = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(value) && value > 0 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function saveBest() {
    try {
      localStorage.setItem(STORAGE_KEY, String(state.bestMoves));
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

  function isPlayInView() {
    const rect = board.getBoundingClientRect();
    if (rect.height === 0) {
      return true;
    }
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visible > rect.height * 0.25;
  }

  function makeDeck() {
    const deck = [];
    SYMBOLS.forEach((symbol) => {
      deck.push({ ...symbol, matched: false });
      deck.push({ ...symbol, matched: false });
    });

    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [deck[index], deck[swap]] = [deck[swap], deck[index]];
    }
    return deck;
  }

  function clearFlipTimer() {
    if (state.flipTimer !== null) {
      window.clearTimeout(state.flipTimer);
      state.flipTimer = null;
    }
  }

  function updateStats() {
    movesEl.textContent = String(state.moves);
    bestEl.textContent = state.bestMoves === null ? '—' : String(state.bestMoves);
  }

  function updateStartButton() {
    let key = 'memory.start';
    if (state.phase === 'playing') {
      key = 'memory.restart';
    } else if (state.phase === 'won') {
      key = 'memory.playAgain';
    }
    startButton.textContent = t(key);
  }

  function renderOverlayText() {
    if (state.phase === 'won') {
      const key = state.newBest ? 'memory.winNewBest' : 'memory.win';
      overlayText.textContent = format(t(key), { moves: state.moves });
      return;
    }
    overlayText.textContent = t('memory.ready');
  }

  function showOverlay() {
    renderOverlayText();
    overlay.classList.remove('is-hidden');
  }

  function hideOverlay() {
    overlay.classList.add('is-hidden');
  }

  function syncCards() {
    const buttons = board.querySelectorAll('.memory-card');
    buttons.forEach((button, index) => {
      const card = state.cards[index];
      if (!card) {
        return;
      }

      const revealed = state.flipped.includes(index) || card.matched;
      button.classList.toggle('is-revealed', revealed && !card.matched);
      button.classList.toggle('is-matched', card.matched);
      button.setAttribute('aria-disabled', card.matched ? 'true' : 'false');

      let label = t('memory.hiddenCard');
      if (revealed) {
        label = t(`memory.symbol.${card.name}`);
        if (card.matched) {
          label = `${label} — ${t('memory.matched')}`;
        }
      } else {
        label = format(label, { number: index + 1 });
      }
      button.setAttribute('aria-label', label);
    });

    board.setAttribute('aria-busy', state.locked ? 'true' : 'false');
  }

  function renderBoard() {
    board.textContent = '';

    state.cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'memory-card';
      button.dataset.index = String(index);

      const face = document.createElement('span');
      face.className = 'memory-card-face';
      face.setAttribute('aria-hidden', 'true');
      face.textContent = card.glyph;
      face.style.color = card.color;
      button.appendChild(face);

      board.appendChild(button);
    });

    syncCards();
  }

  function startGame() {
    clearFlipTimer();
    state.cards = makeDeck();
    state.flipped = [];
    state.moves = 0;
    state.locked = false;
    state.newBest = false;
    state.phase = 'playing';

    updateStats();
    updateStartButton();
    renderBoard();
    hideOverlay();
  }

  function focusFirstCard() {
    const first = board.querySelector('.memory-card');
    if (first) {
      first.focus();
    }
  }

  function winGame() {
    state.phase = 'won';
    state.newBest = state.bestMoves === null || state.moves < state.bestMoves;

    if (state.newBest) {
      state.bestMoves = state.moves;
      saveBest();
    }

    updateStats();
    updateStartButton();
    showOverlay();
    startButton.focus();
  }

  function handleCard(index) {
    if (state.phase === 'ready') {
      startGame();
      const nextButton = board.querySelector(`.memory-card[data-index="${index}"]`);
      if (nextButton) {
        nextButton.focus();
      }
    }
    if (state.phase !== 'playing' || state.locked) {
      return;
    }

    const card = state.cards[index];
    if (!card || card.matched || state.flipped.includes(index)) {
      return;
    }

    state.flipped.push(index);

    if (state.flipped.length === 1) {
      syncCards();
      return;
    }

    state.moves += 1;
    updateStats();

    const [first, second] = state.flipped;
    if (state.cards[first].name === state.cards[second].name) {
      state.cards[first].matched = true;
      state.cards[second].matched = true;
      state.flipped = [];
      syncCards();

      if (state.cards.every((item) => item.matched)) {
        winGame();
      }
      return;
    }

    state.locked = true;
    syncCards();
    state.flipTimer = window.setTimeout(() => {
      state.flipped = [];
      state.locked = false;
      state.flipTimer = null;
      syncCards();
    }, FLIP_BACK_MS);
  }

  board.addEventListener('click', (event) => {
    const button = event.target.closest('.memory-card');
    if (!button) {
      return;
    }
    handleCard(Number(button.dataset.index));
  });

  startButton.addEventListener('click', () => {
    startGame();
    focusFirstCard();
  });

  document.addEventListener('languagechange', () => {
    syncCards();
    renderOverlayText();
    updateStartButton();
  });

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const target = event.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }

    if (event.key.toLowerCase() === 'r') {
      const focusInGame = board.contains(document.activeElement) || document.activeElement === startButton;
      if (!isPlayInView() && !focusInGame) {
        return;
      }
      event.preventDefault();
      if (!event.repeat) {
        startGame();
        focusFirstCard();
      }
    }
  });

  window.addEventListener('beforeunload', clearFlipTimer);

  state.cards = makeDeck();
  renderBoard();
  updateStats();
  updateStartButton();
  showOverlay();
})();
