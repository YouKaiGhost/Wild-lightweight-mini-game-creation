(function () {
  // Xiangqi rules v0.1: pure board logic, no DOM and no AI.
  // Board rows run top (0) to bottom (9); red starts at the bottom.
  const ROWS = 10;
  const COLS = 9;
  const RED = 'red';
  const BLACK = 'black';

  const BACK_RANK = ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R'];

  function piece(type, color) {
    return { type, color };
  }

  function emptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function initialBoard() {
    const board = emptyBoard();

    BACK_RANK.forEach((type, column) => {
      board[0][column] = piece(type, BLACK);
      board[9][column] = piece(type, RED);
    });

    board[2][1] = piece('C', BLACK);
    board[2][7] = piece('C', BLACK);
    board[7][1] = piece('C', RED);
    board[7][7] = piece('C', RED);

    [0, 2, 4, 6, 8].forEach((column) => {
      board[3][column] = piece('P', BLACK);
      board[6][column] = piece('P', RED);
    });

    return board;
  }

  function cloneBoard(board) {
    return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  }

  function inBounds(row, column) {
    return row >= 0 && row < ROWS && column >= 0 && column < COLS;
  }

  function otherColor(color) {
    return color === RED ? BLACK : RED;
  }

  function inPalace(color, row, column) {
    if (column < 3 || column > 5) {
      return false;
    }
    return color === RED ? row >= 7 : row <= 2;
  }

  function crossedRiver(color, row) {
    return color === RED ? row <= 4 : row >= 5;
  }

  function onOwnSide(color, row) {
    return color === RED ? row >= 5 : row <= 4;
  }

  function findGeneral(board, color) {
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const current = board[row][column];
        if (current && current.type === 'K' && current.color === color) {
          return { row, column };
        }
      }
    }
    return null;
  }

  function pseudoMoves(board, row, column) {
    const current = board[row][column];
    if (!current) {
      return [];
    }

    const moves = [];
    const add = (targetRow, targetColumn) => {
      if (!inBounds(targetRow, targetColumn)) {
        return false;
      }
      const target = board[targetRow][targetColumn];
      if (target && target.color === current.color) {
        return false;
      }
      moves.push({
        from: { row, column },
        to: { row: targetRow, column: targetColumn }
      });
      return !target;
    };

    if (current.type === 'K') {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        const nextRow = row + dr;
        const nextColumn = column + dc;
        if (inPalace(current.color, nextRow, nextColumn)) {
          add(nextRow, nextColumn);
        }
      });
    } else if (current.type === 'A') {
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => {
        const nextRow = row + dr;
        const nextColumn = column + dc;
        if (inPalace(current.color, nextRow, nextColumn)) {
          add(nextRow, nextColumn);
        }
      });
    } else if (current.type === 'E') {
      [[-2, -2], [-2, 2], [2, -2], [2, 2]].forEach(([dr, dc]) => {
        const nextRow = row + dr;
        const nextColumn = column + dc;
        if (!inBounds(nextRow, nextColumn) || !onOwnSide(current.color, nextRow)) {
          return;
        }
        const eyeRow = row + dr / 2;
        const eyeColumn = column + dc / 2;
        if (!board[eyeRow][eyeColumn]) {
          add(nextRow, nextColumn);
        }
      });
    } else if (current.type === 'H') {
      [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]].forEach(([dr, dc]) => {
        const legRow = row + (Math.abs(dr) === 2 ? dr / 2 : 0);
        const legColumn = column + (Math.abs(dc) === 2 ? dc / 2 : 0);
        if (inBounds(row + dr, column + dc) && !board[legRow][legColumn]) {
          add(row + dr, column + dc);
        }
      });
    } else if (current.type === 'R') {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        let nextRow = row + dr;
        let nextColumn = column + dc;
        while (inBounds(nextRow, nextColumn)) {
          const target = board[nextRow][nextColumn];
          if (!target) {
            add(nextRow, nextColumn);
          } else {
            if (target.color !== current.color) {
              add(nextRow, nextColumn);
            }
            break;
          }
          nextRow += dr;
          nextColumn += dc;
        }
      });
    } else if (current.type === 'C') {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        let nextRow = row + dr;
        let nextColumn = column + dc;
        let screen = false;

        while (inBounds(nextRow, nextColumn)) {
          const target = board[nextRow][nextColumn];

          if (!screen) {
            if (!target) {
              add(nextRow, nextColumn);
            } else {
              screen = true;
            }
          } else if (target) {
            if (target.color !== current.color) {
              add(nextRow, nextColumn);
            }
            break;
          }

          nextRow += dr;
          nextColumn += dc;
        }
      });
    } else if (current.type === 'P') {
      const forward = current.color === RED ? -1 : 1;
      add(row + forward, column);
      if (crossedRiver(current.color, row)) {
        add(row, column - 1);
        add(row, column + 1);
      }
    }

    return moves;
  }

  function isGeneralsFacing(board) {
    const red = findGeneral(board, RED);
    const black = findGeneral(board, BLACK);
    if (!red || !black || red.column !== black.column) {
      return false;
    }

    const start = Math.min(red.row, black.row) + 1;
    const end = Math.max(red.row, black.row);
    for (let row = start; row < end; row += 1) {
      if (board[row][red.column]) {
        return false;
      }
    }
    return true;
  }

  function isInCheck(board, color) {
    const general = findGeneral(board, color);
    if (!general) {
      return true;
    }
    if (isGeneralsFacing(board)) {
      return true;
    }

    const enemy = otherColor(color);
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const current = board[row][column];
        if (!current || current.color !== enemy) {
          continue;
        }
        const moves = pseudoMoves(board, row, column);
        if (moves.some((move) => (
          move.to.row === general.row && move.to.column === general.column
        ))) {
          return true;
        }
      }
    }
    return false;
  }

  function applyMove(board, move) {
    const next = cloneBoard(board);
    next[move.to.row][move.to.column] = next[move.from.row][move.from.column];
    next[move.from.row][move.from.column] = null;
    return next;
  }

  function legalMovesForPiece(board, row, column) {
    const current = board[row][column];
    if (!current) {
      return [];
    }
    return pseudoMoves(board, row, column).filter((move) => (
      !isInCheck(applyMove(board, move), current.color)
    ));
  }

  function allLegalMoves(board, color) {
    const moves = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const current = board[row][column];
        if (current && current.color === color) {
          moves.push(...legalMovesForPiece(board, row, column));
        }
      }
    }
    return moves;
  }

  function hasLegalMoves(board, color) {
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const current = board[row][column];
        if (!current || current.color !== color) {
          continue;
        }
        if (pseudoMoves(board, row, column).some((move) => (
          !isInCheck(applyMove(board, move), color)
        ))) {
          return true;
        }
      }
    }
    return false;
  }

  function perft(board, color, depth) {
    if (depth === 0) {
      return 1;
    }
    let nodes = 0;
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLS; column += 1) {
        const current = board[row][column];
        if (!current || current.color !== color) {
          continue;
        }
        pseudoMoves(board, row, column).forEach((move) => {
          const next = applyMove(board, move);
          if (!isInCheck(next, color)) {
            nodes += depth === 1 ? 1 : perft(next, otherColor(color), depth - 1);
          }
        });
      }
    }
    return nodes;
  }

  window.XiangqiRules = {
    ROWS,
    COLS,
    RED,
    BLACK,
    initialBoard,
    cloneBoard,
    pseudoMoves,
    legalMovesForPiece,
    allLegalMoves,
    hasLegalMoves,
    isInCheck,
    isGeneralsFacing,
    applyMove,
    findGeneral,
    perft
  };
})();
