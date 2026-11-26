(function () {
  const Rules = window.XiangqiRules;
  if (!Rules) {
    return;
  }

  const boardEl = document.getElementById('xiangqi-board');
  if (!boardEl) {
    return;
  }

  const overlay = document.getElementById('xiangqi-overlay');
  const overlayText = document.getElementById('xiangqi-overlay-text');
  const turnDot = document.getElementById('xiangqi-turn-dot');
  const turnText = document.getElementById('xiangqi-turn-text');
  const statusText = document.getElementById('xiangqi-status');
  const newGameButton = document.getElementById('xiangqi-new');

  const GLYPHS = {
    red: {
      K: '帥',
      A: '仕',
      E: '相',
      H: '傌',
      R: '俥',
      C: '炮',
      P: '兵'
    },
    black: {
      K: '將',
      A: '士',
      E: '象',
      H: '馬',
      R: '車',
      C: '砲',
      P: '卒'
    }
  };

  const state = {
    board: Rules.initialBoard(),
    turn: Rules.RED,
    selected: null,
    legalMoves: [],
    phase: 'playing',
    winner: null,
    reason: null,
    checkColor: null,
    lastMove: null,
    focus: { row: 9, column: 4 },
    buttons: []
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
    return color === Rules.RED ? Rules.BLACK : Rules.RED;
  }

  function colorLabel(color) {
    return t(color === Rules.RED ? 'xiangqi.red' : 'xiangqi.black');
  }

  function pieceName(piece) {
    return t(`xiangqi.name.${piece.color}.${piece.type}`);
  }

  function buttonAt(row, column) {
    return state.buttons[row * Rules.COLS + column];
  }

  function setTabStops() {
    state.buttons.forEach((button, index) => {
      const row = Math.floor(index / Rules.COLS);
      const column = index % Rules.COLS;
      button.tabIndex = row === state.focus.row && column === state.focus.column ? 0 : -1;
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

    for (let row = 0; row < Rules.ROWS; row += 1) {
      for (let column = 0; column < Rules.COLS; column += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'xiangqi-point';
        button.dataset.row = String(row);
        button.dataset.column = String(column);
        button.style.left = `${((column * 10 + 5) / 90) * 100}%`;
        button.style.top = `${((row * 10 + 5) / 100) * 100}%`;
        button.addEventListener('click', () => handlePoint(row, column));
        state.buttons.push(button);
        fragment.appendChild(button);
      }
    }

    boardEl.appendChild(fragment);
    setTabStops();
  }

  function resultText() {
    if (state.phase !== 'won') {
      return '';
    }
    const winner = colorLabel(state.winner);
    const loser = colorLabel(otherColor(state.winner));
    const key = state.reason === 'checkmate' ? 'xiangqi.checkmateWin' : 'xiangqi.stalemateWin';
    return format(t(key), { winner, loser });
  }

  function renderStatus() {
    turnDot.className = 'xiangqi-turn-dot';
    turnDot.classList.add(state.phase === 'won' ? state.winner : state.turn);

    if (state.phase === 'won') {
      turnText.textContent = t('xiangqi.gameOver');
      statusText.textContent = resultText();
      return;
    }

    turnText.textContent = state.turn === Rules.RED
      ? t('xiangqi.redToMove')
      : t('xiangqi.blackToMove');

    if (state.selected) {
      const piece = state.board[state.selected.row][state.selected.column];
      const name = piece ? pieceName(piece) : '';
      statusText.textContent = state.legalMoves.length === 0
        ? `${name} — ${t('xiangqi.noMoves')}`
        : `${name} — ${t('xiangqi.chooseDestination')}`;
      return;
    }

    if (state.checkColor === state.turn) {
      statusText.textContent = format(t('xiangqi.check'), { color: colorLabel(state.turn) });
      return;
    }

    statusText.textContent = t('xiangqi.selectPiece');
  }

  function renderBoard() {
    const lastFrom = state.lastMove ? state.lastMove.from : null;
    const lastTo = state.lastMove ? state.lastMove.to : null;
    const targetKeys = new Set(state.legalMoves.map((move) => `${move.to.row},${move.to.column}`));

    state.buttons.forEach((button, index) => {
      const row = Math.floor(index / Rules.COLS);
      const column = index % Rules.COLS;
      const piece = state.board[row][column];
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

      button.className = 'xiangqi-point';
      if (piece) {
        button.classList.add('has-piece');
        button.classList.add(piece.color);
        button.textContent = GLYPHS[piece.color][piece.type];
      } else {
        button.textContent = '';
      }
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-target', target);
      button.classList.toggle('is-capture', target && Boolean(piece));
      button.classList.toggle('is-last', isLast);
      button.classList.toggle('is-check', isCheck);
      button.setAttribute('aria-disabled', state.phase === 'won' ? 'true' : 'false');

      const square = format(t('xiangqi.square'), {
        column: column + 1,
        row: row + 1
      });
      let label = square;
      if (piece) {
        label = format(t('xiangqi.pieceAt'), {
          piece: pieceName(piece),
          square
        });
      }
      if (target) {
        label = `${label}, ${t('xiangqi.legalMove')}`;
      }
      if (isCheck) {
        label = `${label}, ${t('xiangqi.inCheck')}`;
      }
      button.setAttribute('aria-label', label);
    });

    setTabStops();
  }

  function renderOverlay() {
    if (state.phase !== 'won') {
      overlay.classList.add('is-hidden');
      return;
    }

    overlayText.textContent = resultText();
    overlay.classList.remove('is-hidden');
  }

  function render() {
    renderBoard();
    renderStatus();
    renderOverlay();
  }

  function clearSelection() {
    state.selected = null;
    state.legalMoves = [];
  }

  function selectPiece(row, column) {
    const piece = state.board[row][column];
    if (!piece || piece.color !== state.turn) {
      clearSelection();
      render();
      return;
    }

    state.selected = { row, column };
    state.legalMoves = Rules.legalMovesForPiece(state.board, row, column);
    render();
  }

  function makeMove(move) {
    const mover = state.turn;
    state.board = Rules.applyMove(state.board, move);
    state.lastMove = move;
    clearSelection();

    const opponent = otherColor(mover);
    const inCheck = Rules.isInCheck(state.board, opponent);
    const hasMoves = Rules.hasLegalMoves(state.board, opponent);

    state.turn = opponent;
    state.checkColor = inCheck ? opponent : null;

    if (!hasMoves) {
      state.phase = 'won';
      state.winner = mover;
      state.reason = inCheck ? 'checkmate' : 'stalemate';
      render();
      newGameButton.focus({ preventScroll: true });
      return;
    }

    render();
  }

  function handlePoint(row, column) {
    state.focus = { row, column };
    if (state.phase === 'won') {
      return;
    }

    const target = state.legalMoves.find((move) => (
      move.to.row === row && move.to.column === column
    ));
    if (target) {
      makeMove(target);
      return;
    }

    const piece = state.board[row][column];
    if (piece && piece.color === state.turn) {
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
    state.board = Rules.initialBoard();
    state.turn = Rules.RED;
    state.selected = null;
    state.legalMoves = [];
    state.phase = 'playing';
    state.winner = null;
    state.reason = null;
    state.checkColor = null;
    state.lastMove = null;
    state.focus = { row: 9, column: 4 };
    render();
    focusPoint(9, 4);
  }

  boardEl.addEventListener('focusin', (event) => {
    const button = event.target.closest('.xiangqi-point');
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
    if (!target || !target.classList || !target.classList.contains('xiangqi-point')) {
      return;
    }

    const row = Number(target.dataset.row);
    const column = Number(target.dataset.column);
    let nextRow = row;
    let nextColumn = column;

    if (event.key === 'ArrowUp') {
      nextRow = Math.max(0, row - 1);
    } else if (event.key === 'ArrowDown') {
      nextRow = Math.min(Rules.ROWS - 1, row + 1);
    } else if (event.key === 'ArrowLeft') {
      nextColumn = Math.max(0, column - 1);
    } else if (event.key === 'ArrowRight') {
      nextColumn = Math.min(Rules.COLS - 1, column + 1);
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

  newGameButton.addEventListener('click', newGame);

  document.addEventListener('languagechange', () => {
    render();
  });

  buildBoard();
  render();
})();
