(function () {
  // Chess rules v0.1: pure board logic, no DOM and no engine.
  // Board rows run top (0, rank 8) to bottom (7, rank 1); white starts at the bottom.
  const SIZE = 8;
  const WHITE = 'white';
  const BLACK = 'black';
  const PROMOTIONS = ['Q', 'R', 'B', 'N'];

  function piece(type, color) {
    return { type, color };
  }

  function emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  function initialPosition() {
    const board = emptyBoard();
    const backRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

    backRank.forEach((type, column) => {
      board[0][column] = piece(type, BLACK);
      board[7][column] = piece(type, WHITE);
    });

    for (let column = 0; column < SIZE; column += 1) {
      board[1][column] = piece('P', BLACK);
      board[6][column] = piece('P', WHITE);
    }

    return {
      board,
      turn: WHITE,
      castling: {
        whiteKing: true,
        whiteQueen: true,
        blackKing: true,
        blackQueen: true
      },
      enPassant: null
    };
  }

  function cloneBoard(board) {
    return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  }

  function clonePosition(position) {
    return {
      board: cloneBoard(position.board),
      turn: position.turn,
      castling: { ...position.castling },
      enPassant: position.enPassant ? { ...position.enPassant } : null
    };
  }

  function inBounds(row, column) {
    return row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  }

  function otherColor(color) {
    return color === WHITE ? BLACK : WHITE;
  }

  function findKing(position, color) {
    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const current = position.board[row][column];
        if (current && current.type === 'K' && current.color === color) {
          return { row, column };
        }
      }
    }
    return null;
  }

  function isSquareAttacked(position, row, column, byColor) {
    const board = position.board;
    const pawnRow = byColor === WHITE ? row + 1 : row - 1;

    [-1, 1].forEach((offset) => {
      const source = inBounds(pawnRow, column + offset) ? board[pawnRow][column + offset] : null;
      if (source && source.color === byColor && source.type === 'P') {
        return true;
      }
    });

    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const sourceRow = row + dr;
      const sourceColumn = column + dc;
      if (!inBounds(sourceRow, sourceColumn)) {
        continue;
      }
      const source = board[sourceRow][sourceColumn];
      if (source && source.color === byColor && source.type === 'N') {
        return true;
      }
    }

    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const sourceRow = row + dr;
      const sourceColumn = column + dc;
      if (!inBounds(sourceRow, sourceColumn)) {
        continue;
      }
      const source = board[sourceRow][sourceColumn];
      if (source && source.color === byColor && source.type === 'K') {
        return true;
      }
    }

    const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of rookDirections) {
      let sourceRow = row + dr;
      let sourceColumn = column + dc;
      while (inBounds(sourceRow, sourceColumn)) {
        const source = board[sourceRow][sourceColumn];
        if (source) {
          if (source.color === byColor && (source.type === 'R' || source.type === 'Q')) {
            return true;
          }
          break;
        }
        sourceRow += dr;
        sourceColumn += dc;
      }
    }

    const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of bishopDirections) {
      let sourceRow = row + dr;
      let sourceColumn = column + dc;
      while (inBounds(sourceRow, sourceColumn)) {
        const source = board[sourceRow][sourceColumn];
        if (source) {
          if (source.color === byColor && (source.type === 'B' || source.type === 'Q')) {
            return true;
          }
          break;
        }
        sourceRow += dr;
        sourceColumn += dc;
      }
    }

    return false;
  }

  function isInCheck(position, color) {
    const king = findKing(position, color);
    if (!king) {
      return true;
    }
    return isSquareAttacked(position, king.row, king.column, otherColor(color));
  }

  function canCastle(position, color, side) {
    const board = position.board;
    const row = color === WHITE ? 7 : 0;
    const king = board[row][4];
    const right = color === WHITE
      ? (side === 'K' ? 'whiteKing' : 'whiteQueen')
      : (side === 'K' ? 'blackKing' : 'blackQueen');

    if (!position.castling[right] || !king || king.type !== 'K' || king.color !== color) {
      return false;
    }

    const rookColumn = side === 'K' ? 7 : 0;
    const rook = board[row][rookColumn];
    if (!rook || rook.type !== 'R' || rook.color !== color) {
      return false;
    }

    const emptyColumns = side === 'K' ? [5, 6] : [1, 2, 3];
    if (emptyColumns.some((column) => board[row][column])) {
      return false;
    }

    const enemy = otherColor(color);
    if (isSquareAttacked(position, row, 4, enemy)) {
      return false;
    }

    const safeColumns = side === 'K' ? [5, 6] : [2, 3];
    return safeColumns.every((column) => !isSquareAttacked(position, row, column, enemy));
  }

  function pseudoMoves(position, row, column) {
    const board = position.board;
    const current = board[row][column];
    if (!current) {
      return [];
    }

    const moves = [];
    const add = (toRow, toColumn, extra = {}) => {
      if (!inBounds(toRow, toColumn)) {
        return false;
      }
      const target = board[toRow][toColumn];
      if (target && target.color === current.color) {
        return false;
      }
      moves.push({
        from: { row, column },
        to: { row: toRow, column: toColumn },
        promotion: extra.promotion || null,
        castle: extra.castle || null,
        enPassant: Boolean(extra.enPassant)
      });
      return !target;
    };

    if (current.type === 'P') {
      const direction = current.color === WHITE ? -1 : 1;
      const startRow = current.color === WHITE ? 6 : 1;
      const promotionRow = current.color === WHITE ? 0 : 7;
      const nextRow = row + direction;

      if (inBounds(nextRow, column) && !board[nextRow][column]) {
        if (nextRow === promotionRow) {
          PROMOTIONS.forEach((promotion) => add(nextRow, column, { promotion }));
        } else {
          add(nextRow, column);
          const doubleRow = row + direction * 2;
          if (row === startRow && !board[doubleRow][column]) {
            add(doubleRow, column);
          }
        }
      }

      [-1, 1].forEach((offset) => {
        const targetColumn = column + offset;
        if (!inBounds(nextRow, targetColumn)) {
          return;
        }
        const target = board[nextRow][targetColumn];
        if (target && target.color !== current.color) {
          if (nextRow === promotionRow) {
            PROMOTIONS.forEach((promotion) => add(nextRow, targetColumn, { promotion }));
          } else {
            add(nextRow, targetColumn);
          }
          return;
        }
        if (!target
          && position.enPassant
          && position.enPassant.row === nextRow
          && position.enPassant.column === targetColumn) {
          add(nextRow, targetColumn, { enPassant: true });
        }
      });
    } else if (current.type === 'N') {
      [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
        add(row + dr, column + dc);
      });
    } else if (current.type === 'B' || current.type === 'R' || current.type === 'Q') {
      const directions = [];
      if (current.type === 'B' || current.type === 'Q') {
        directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (current.type === 'R' || current.type === 'Q') {
        directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      directions.forEach(([dr, dc]) => {
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
    } else if (current.type === 'K') {
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
        add(row + dr, column + dc);
      });

      const homeRow = current.color === WHITE ? 7 : 0;
      if (row === homeRow && column === 4) {
        if (canCastle(position, current.color, 'K')) {
          add(homeRow, 6, { castle: 'K' });
        }
        if (canCastle(position, current.color, 'Q')) {
          add(homeRow, 2, { castle: 'Q' });
        }
      }
    }

    return moves;
  }

  function applyMove(position, move) {
    const next = clonePosition(position);
    const board = next.board;
    const moving = board[move.from.row][move.from.column];
    const captured = board[move.to.row][move.to.column];

    if (move.enPassant) {
      board[move.from.row][move.to.column] = null;
    }

    board[move.to.row][move.to.column] = moving;
    board[move.from.row][move.from.column] = null;

    if (move.promotion) {
      board[move.to.row][move.to.column] = {
        type: move.promotion,
        color: moving.color
      };
    }

    if (move.castle) {
      const row = moving.color === WHITE ? 7 : 0;
      if (move.castle === 'K') {
        board[row][5] = board[row][7];
        board[row][7] = null;
      } else {
        board[row][3] = board[row][0];
        board[row][0] = null;
      }
    }

    const castling = next.castling;
    if (moving.type === 'K') {
      if (moving.color === WHITE) {
        castling.whiteKing = false;
        castling.whiteQueen = false;
      } else {
        castling.blackKing = false;
        castling.blackQueen = false;
      }
    } else if (moving.type === 'R') {
      if (moving.color === WHITE) {
        if (move.from.row === 7 && move.from.column === 0) castling.whiteQueen = false;
        if (move.from.row === 7 && move.from.column === 7) castling.whiteKing = false;
      } else {
        if (move.from.row === 0 && move.from.column === 0) castling.blackQueen = false;
        if (move.from.row === 0 && move.from.column === 7) castling.blackKing = false;
      }
    }

    if (captured && captured.type === 'R') {
      if (captured.color === WHITE) {
        if (move.to.row === 7 && move.to.column === 0) castling.whiteQueen = false;
        if (move.to.row === 7 && move.to.column === 7) castling.whiteKing = false;
      } else {
        if (move.to.row === 0 && move.to.column === 0) castling.blackQueen = false;
        if (move.to.row === 0 && move.to.column === 7) castling.blackKing = false;
      }
    }

    next.enPassant = moving.type === 'P' && Math.abs(move.to.row - move.from.row) === 2
      ? {
        row: (move.from.row + move.to.row) / 2,
        column: move.from.column
      }
      : null;

    next.turn = otherColor(position.turn);
    return next;
  }

  function legalMoves(position, color = position.turn) {
    const moves = [];
    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const current = position.board[row][column];
        if (!current || current.color !== color) {
          continue;
        }
        pseudoMoves(position, row, column).forEach((move) => {
          const next = applyMove(position, move);
          if (!isInCheck(next, color)) {
            moves.push(move);
          }
        });
      }
    }
    return moves;
  }

  function legalMovesForPiece(position, row, column) {
    const current = position.board[row][column];
    if (!current) {
      return [];
    }
    return pseudoMoves(position, row, column).filter((move) => (
      !isInCheck(applyMove(position, move), current.color)
    ));
  }

  function hasLegalMoves(position, color = position.turn) {
    for (let row = 0; row < SIZE; row += 1) {
      for (let column = 0; column < SIZE; column += 1) {
        const current = position.board[row][column];
        if (!current || current.color !== color) {
          continue;
        }
        if (pseudoMoves(position, row, column).some((move) => (
          !isInCheck(applyMove(position, move), color)
        ))) {
          return true;
        }
      }
    }
    return false;
  }

  function perft(position, depth) {
    if (depth === 0) {
      return 1;
    }
    let nodes = 0;
    legalMoves(position).forEach((move) => {
      const next = applyMove(position, move);
      nodes += depth === 1 ? 1 : perft(next, depth - 1);
    });
    return nodes;
  }

  window.ChessRules = {
    SIZE,
    WHITE,
    BLACK,
    PROMOTIONS,
    initialPosition,
    clonePosition,
    pseudoMoves,
    legalMoves,
    legalMovesForPiece,
    hasLegalMoves,
    isInCheck,
    isSquareAttacked,
    applyMove,
    findKing,
    perft
  };
})();
