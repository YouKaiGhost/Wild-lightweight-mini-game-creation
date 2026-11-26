(function () {
  const Rules = window.ChessRules;
  if (!Rules) {
    return;
  }

  const boardEl = document.getElementById('chess-board');
  if (!boardEl) {
    return;
  }

  const overlay = document.getElementById('chess-overlay');
  const overlayText = document.getElementById('chess-overlay-text');
  const promotionEl = document.getElementById('chess-promotion');
  const promotionOptions = Array.from(promotionEl.querySelectorAll('.chess-promotion-option'));
  const turnDot = document.getElementById('chess-turn-dot');
  const turnText = document.getElementById('chess-turn-text');
  const statusText = document.getElementById('chess-status');
  const newGameButton = document.getElementById('chess-new');

  const GLYPHS = {
    K: '♚',
    Q: '♛',
    R: '♜',
    B: '♝',
    N: '♞',
    P: '♟'
  };

  const FILES = 'abcdefgh';

  const state = {
    position: Rules.initialPosition(),
    selected: null,
    legalMoves: [],
    phase: 'playing',
    winner: null,
    reason: null,
    checkColor: null,
    lastMove: null,
    focus: { row: 7, column: 4 },
    buttons: [],
    pendingPromotions: null,
    pendingFrom: null,
    pendingTo: null,
    promotionColor: null
  };

  function t(key) {
    return window.I18N ? window.I18N.t(key) : key;
  }

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
    ));
  }

  function otherColor(color) {
    return color === Rules.WHITE ? Rules.BLACK : Rules.WHITE;
  }

  function colorLabel(color) {
    return t(color === Rules.WHITE ? 'chess.white' : 'chess.black');
  }

  function pieceName(piece) {
    return t(`chess.name.${piece.color}.${piece.type}`);
  }

  function squareName(row, column) {
    return `${FILES[column]}${8 - row}`;
  }

  function buttonAt(row, column) {
    return state.buttons[row * Rules.SIZE + column];
  }

  function setTabStops() {
    state.buttons.forEach((button, index) => {
      const row = Math.floor(index / Rules.SIZE);
      const column = index % Rules.SIZE;
      const isFocus = row === state.focus.row && column === state.focus.column;
      button.tabIndex = !state.pendingPromotions && isFocus ? 0 : -1;
    });
  }

  function focusPoint(row, column) {
    state.focus = { row, column };
    setTabStops();
    const button = buttonAt(row, column);
    if (button) {
      button.focus();
    }
  }

  function buildBoard() {
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < Rules.SIZE; row += 1) {
      for (let column = 0; column < Rules.SIZE; column += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `chess-square ${(row + column) % 2 === 0 ? 'light' : 'dark'}`;
        button.dataset.row = String(row);
        button.dataset.column = String(column);
        button.addEventListener('click', () => handlePoint(row, column));
        state.buttons.push(button);
        fragment.appendChild(button);
      }
    }

    boardEl.appendChild(fragment);
    setTabStops();
  }

  function resultText() {
    if (state.phase !== 'over') {
      return '';
    }
    if (state.reason === 'checkmate') {
      return format(t('chess.checkmateWin'), { winner: colorLabel(state.winner) });
    }
    return t('chess.stalemateDraw');
  }

  function renderStatus() {
    turnDot.className = 'chess-turn-dot';
    turnDot.classList.add(state.phase === 'over' ? (state.winner || 'draw') : state.position.turn);

    if (state.phase === 'over') {
      turnText.textContent = t('chess.gameOver');
      statusText.textContent = resultText();
      return;
    }

    turnText.textContent = state.position.turn === Rules.WHITE
      ? t('chess.whiteToMove')
      : t('chess.blackToMove');

    if (state.pendingPromotions) {
      statusText.textContent = t('chess.promotionStatus');
      return;
    }

    if (state.selected) {
      const piece = state.position.board[state.selected.row][state.selected.column];
      const name = piece ? pieceName(piece) : '';
      statusText.textContent = state.legalMoves.length === 0
        ? `${name} — ${t('chess.noMoves')}`
        : `${name} — ${t('chess.chooseDestination')}`;
      return;
    }

    if (state.checkColor === state.position.turn) {
      statusText.textContent = format(t('chess.check'), { color: colorLabel(state.position.turn) });
      return;
    }

    statusText.textContent = t('chess.selectPiece');
  }

  function renderBoard() {
    const lastFrom = state.lastMove ? state.lastMove.from : null;
    const lastTo = state.lastMove ? state.lastMove.to : null;
    const targetKeys = new Set(state.legalMoves.map((move) => `${move.to.row},${move.to.column}`));

    state.buttons.forEach((button, index) => {
      const row = Math.floor(index / Rules.SIZE);
      const column = index % Rules.SIZE;
      const piece = state.position.board[row][column];
      const target = targetKeys.has(`${row},${column}`);
      const selected = state.selected
        && state.selected.row === row
        && state.selected.column === column;
      const isLast = Boolean(
        (lastFrom && lastFrom.row === row && lastFrom.column === column)
        || (lastTo && lastTo.row === row && lastTo.column === column)
      );
      const isCheck = Boolean(
        piece
        && piece.type === 'K'
        && state.checkColor === piece.color
      );

      button.className = `chess-square ${(row + column) % 2 === 0 ? 'light' : 'dark'}`;
      button.textContent = '';

      if (piece) {
        button.classList.add('has-piece');
        button.classList.add(piece.color);
        const disc = document.createElement('span');
        disc.className = `chess-piece ${piece.color}`;
        disc.textContent = GLYPHS[piece.type];
        disc.setAttribute('aria-hidden', 'true');
        button.appendChild(disc);
      }

      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-target', target);
      button.classList.toggle('is-capture', target && Boolean(piece));
      button.classList.toggle('is-last', isLast);
      button.classList.toggle('is-check', isCheck);
      button.setAttribute(
        'aria-disabled',
        state.phase === 'over' || state.pendingPromotions ? 'true' : 'false'
      );

      const square = squareName(row, column);
      let label = piece
        ? format(t('chess.pieceAt'), { piece: pieceName(piece), square })
        : format(t('chess.emptySquare'), { square });
      if (target) {
        label = `${label}, ${t('chess.legalMove')}`;
      }
      if (isCheck) {
        label = `${label}, ${t('chess.inCheck')}`;
      }
      button.setAttribute('aria-label', label);
    });

    boardEl.setAttribute('aria-busy', state.pendingPromotions ? 'true' : 'false');
    setTabStops();
  }

  function renderOverlay() {
    if (state.phase !== 'over') {
      overlay.classList.add('is-hidden');
      return;
    }
    overlayText.textContent = resultText();
    overlay.classList.remove('is-hidden');
  }

  function renderPromotion() {
    if (!state.pendingPromotions) {
      promotionEl.classList.add('is-hidden');
      return;
    }

    promotionEl.classList.remove('is-hidden');
    promotionOptions.forEach((button) => {
      const type = button.dataset.promotion;
      button.className = `chess-promotion-option ${state.promotionColor}`;
      const glyph = button.querySelector('.chess-promotion-glyph');
      const name = button.querySelector('.chess-promotion-name');
      glyph.textContent = GLYPHS[type];
      name.textContent = t(`chess.promotion.${type}`);
      button.setAttribute('aria-label', format(t('chess.promoteTo'), {
        piece: t(`chess.promotion.${type}`)
      }));
    });
  }

  function render() {
    renderBoard();
    renderStatus();
    renderOverlay();
    renderPromotion();
  }

  function clearSelection() {
    state.selected = null;
    state.legalMoves = [];
  }

  function selectPiece(row, column) {
    const piece = state.position.board[row][column];
    if (!piece || piece.color !== state.position.turn) {
      clearSelection();
      render();
      return;
    }

    state.selected = { row, column };
    state.legalMoves = Rules.legalMovesForPiece(state.position, row, column);
    render();
  }

  function closePromotion() {
    state.pendingPromotions = null;
    state.pendingFrom = null;
    state.pendingTo = null;
    state.promotionColor = null;
    promotionEl.classList.add('is-hidden');
  }

  function openPromotion(moves, from, to) {
    state.pendingPromotions = moves;
    state.pendingFrom = from;
    state.pendingTo = to;
    state.promotionColor = state.position.turn;
    state.legalMoves = moves;
    render();
    const first = promotionOptions[0];
    if (first) {
      first.focus();
    }
  }

  function choosePromotion(type) {
    if (!state.pendingPromotions) {
      return;
    }
    const move = state.pendingPromotions.find((candidate) => candidate.promotion === type);
    if (!move) {
      return;
    }
    const target = { ...move.to };
    closePromotion();
    makeMove(move);
    if (state.phase !== 'over') {
      focusPoint(target.row, target.column);
    }
  }

  function cancelPromotion() {
    if (!state.pendingPromotions) {
      return;
    }
    const origin = state.pendingFrom ? { ...state.pendingFrom } : null;
    closePromotion();
    clearSelection();
    render();
    if (origin) {
      focusPoint(origin.row, origin.column);
    }
  }

  function makeMove(move) {
    const mover = state.position.turn;
    state.position = Rules.applyMove(state.position, move);
    state.lastMove = move;
    clearSelection();

    const opponent = otherColor(mover);
    const inCheck = Rules.isInCheck(state.position, opponent);
    const hasMoves = Rules.hasLegalMoves(state.position, opponent);

    state.checkColor = inCheck ? opponent : null;

    if (!hasMoves) {
      state.phase = 'over';
      state.winner = inCheck ? mover : null;
      state.reason = inCheck ? 'checkmate' : 'stalemate';
      render();
      newGameButton.focus({ preventScroll: true });
      return;
    }

    state.phase = 'playing';
    render();
  }

  function handlePoint(row, column) {
    state.focus = { row, column };
    if (state.phase === 'over' || state.pendingPromotions) {
      return;
    }

    const moves = state.legalMoves.filter((move) => (
      move.to.row === row && move.to.column === column
    ));
    if (moves.length > 0) {
      if (moves.length > 1 && moves[0].promotion) {
        openPromotion(moves, state.selected, { row, column });
        return;
      }
      makeMove(moves[0]);
      return;
    }

    const piece = state.position.board[row][column];
    if (piece && piece.color === state.position.turn) {
      if (state.selected
        && state.selected.row === row
        && state.selected.column === column) {
        clearSelection();
        render();
        return;
      }
      selectPiece(row, column);
      return;
    }

    clearSelection();
    render();
  }

  function newGame() {
    closePromotion();
    state.position = Rules.initialPosition();
    state.selected = null;
    state.legalMoves = [];
    state.phase = 'playing';
    state.winner = null;
    state.reason = null;
    state.checkColor = null;
    state.lastMove = null;
    state.focus = { row: 7, column: 4 };
    render();
    focusPoint(7, 4);
  }

  boardEl.addEventListener('focusin', (event) => {
    const button = event.target.closest('.chess-square');
    if (!button) {
      return;
    }
    state.focus = {
      row: Number(button.dataset.row),
      column: Number(button.dataset.column)
    };
    setTabStops();
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!target || !target.classList || !target.classList.contains('chess-square')) {
      return;
    }

    const row = Number(target.dataset.row);
    const column = Number(target.dataset.column);
    let nextRow = row;
    let nextColumn = column;

    if (event.key === 'ArrowUp') {
      nextRow = Math.max(0, row - 1);
    } else if (event.key === 'ArrowDown') {
      nextRow = Math.min(Rules.SIZE - 1, row + 1);
    } else if (event.key === 'ArrowLeft') {
      nextColumn = Math.max(0, column - 1);
    } else if (event.key === 'ArrowRight') {
      nextColumn = Math.min(Rules.SIZE - 1, column + 1);
    } else if (event.key === 'Escape') {
      clearSelection();
      render();
      return;
    } else {
      return;
    }

    event.preventDefault();
    focusPoint(nextRow, nextColumn);
  });

  promotionEl.addEventListener('keydown', (event) => {
    if (!state.pendingPromotions) {
      return;
    }

    const currentIndex = promotionOptions.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelPromotion();
      return;
    }

    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) || (event.key === 'Tab' && event.shiftKey)
      ? -1
      : 1;
    const start = currentIndex < 0 ? 0 : currentIndex;
    const next = (start + direction + promotionOptions.length) % promotionOptions.length;
    promotionOptions[next].focus();
  });

  promotionOptions.forEach((button) => {
    button.addEventListener('click', () => choosePromotion(button.dataset.promotion));
  });

  newGameButton.addEventListener('click', newGame);

  document.addEventListener('languagechange', () => {
    render();
    if (state.pendingPromotions && promotionOptions[0]) {
      promotionOptions[0].focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (state.pendingPromotions && event.key === 'Escape') {
      event.preventDefault();
      cancelPromotion();
    }
  });

  buildBoard();
  render();
})();
