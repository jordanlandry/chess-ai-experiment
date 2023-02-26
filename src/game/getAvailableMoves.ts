import properties, { blankPiece, kingPositions, Moves, PiecesType, PieceType, Teams } from "../properties";

export default function getAvailableMoves(board: PieceType[][], pos: { x: number; y: number }, team: Teams) {
  const availableMoves: Moves[] = [];

  const moveFunctions = {
    [PiecesType.Pawn]: pawn,
    [PiecesType.Rook]: rook,
    [PiecesType.Knight]: knight,
    [PiecesType.Bishop]: bishop,
    [PiecesType.Queen]: queen,
    [PiecesType.King]: king,
  };

  const { x, y } = pos;
  const { piece, color } = board[y][x];
  if (piece === PiecesType.None || color !== team) return availableMoves;

  moveFunctions[piece](board, { x, y }, availableMoves, color);

  return availableMoves;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function inBounds(pos: { x: number; y: number }) {
  return pos.x >= 0 && pos.x <= 7 && pos.y >= 0 && pos.y <= 7;
}

function empty(board: PieceType[][], pos: { x: number; y: number }) {
  if (!inBounds(pos)) return false;
  return board[pos.y][pos.x].piece === PiecesType.None;
}

function addIfLegal(board: PieceType[][], move: Moves, availableMoves: Moves[]) {
  const color = move.piece.color;

  // Update kings positions
  if (board[move.from.y][move.from.x].piece === PiecesType.King) kingPositions[color] = move.to;

  // Make the move
  const testBoard = board.map((row) => row.slice());
  testBoard[move.to.y][move.to.x] = testBoard[move.from.y][move.from.x];
  testBoard[move.from.y][move.from.x] = blankPiece;

  // See if the king is in check
  // Find the king
  let kingX = 0;
  let kingY = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (testBoard[y][x].piece === PiecesType.King && testBoard[y][x].color === color) {
        kingX = x;
        kingY = y;
        break;
      }
    }
  }

  const kingPos = { x: kingX, y: kingY };
  if (squareUnderAttack(testBoard, kingPos)) return;

  // Add the move
  availableMoves.push(move);
}

function pawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  if (color === Teams.White) whitePawn(board, pos, availableMoves);
  else blackPawn(board, pos, availableMoves);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function whitePawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[]) {
  const { x, y } = pos;

  const promotion = y === 1;
  // 1 Square Forward
  if (empty(board, { x, y: y - 1 })) addIfLegal(board, { from: { x, y }, to: { x, y: y - 1 }, piece: board[y][x], promotion }, availableMoves);

  // 2 Squares Forward
  if (y === 6 && empty(board, { x, y: y - 1 }) && empty(board, { x, y: y - 2 }))
    addIfLegal(board, { from: { x, y }, to: { x, y: y - 2 }, piece: board[y][x], promotion }, availableMoves);

  // Capture Left
  const left = { x: x - 1, y: y - 1 };
  if (inBounds(left) && !empty(board, left) && board[left.y][left.x].color === Teams.Black)
    addIfLegal(board, { from: { x, y }, to: left, piece: board[y][x], promotion }, availableMoves);

  // Capture Right
  const right = { x: x + 1, y: y - 1 };
  if (inBounds(right) && !empty(board, right) && board[right.y][right.x].color === Teams.Black)
    addIfLegal(board, { from: { x, y }, to: right, piece: board[y][x], promotion }, availableMoves);

  const boardHistory = properties.boardHistory;

  // En Passant
  if (y === 3 && boardHistory.length > 1) {
    const lastBoard = boardHistory[boardHistory.length - 2];

    const xOffsets = [-1, 1];
    xOffsets.forEach((xOffset) => {
      if (
        board[3][x + xOffset].piece === PiecesType.Pawn && // Pawn in correct spot
        board[3][x + xOffset].color === Teams.Black && // Pawn is opposite color
        board[1][x + xOffset].piece === PiecesType.None && // No pawn at the original spot (needs to have moved)
        lastBoard[3][x + xOffset].piece === PiecesType.None && // Last board has no pawn at target spot
        lastBoard[2][x + xOffset].piece === PiecesType.None && // No piece in front of the pawn last turn
        lastBoard[1][x + xOffset].piece === PiecesType.Pawn && // Pawn in original spot on last board
        lastBoard[2][x + xOffset].color === Teams.Black // Pawn is opposite color
      ) {
        addIfLegal(board, { from: { x, y }, to: { x: x + xOffset, y: y - 1 }, piece: board[y][x], enPassant: true }, availableMoves);
      }
    });
  }
}

function blackPawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[]) {
  const { x, y } = pos;

  const promotion = y === 6;
  // 1 Square Forward
  if (empty(board, { x, y: y + 1 })) addIfLegal(board, { from: { x, y }, to: { x, y: y + 1 }, piece: board[y][x], promotion }, availableMoves);

  // 2 Squares Forward
  if (y === 1 && empty(board, { x, y: y + 1 }) && empty(board, { x, y: y + 2 }))
    addIfLegal(board, { from: { x, y }, to: { x, y: y + 2 }, piece: board[y][x], promotion }, availableMoves);

  // Capture Left
  const left = { x: x - 1, y: y + 1 };
  if (inBounds(left) && !empty(board, left) && board[left.y][left.x].color === Teams.White)
    addIfLegal(board, { from: { x, y }, to: left, piece: board[y][x], promotion }, availableMoves);

  // Capture Right
  const right = { x: x + 1, y: y + 1 };
  if (inBounds(right) && !empty(board, right) && board[right.y][right.x].color === Teams.White)
    addIfLegal(board, { from: { x, y }, to: right, piece: board[y][x], promotion }, availableMoves);

  // En Passant
  const boardHistory = properties.boardHistory;
  if (y === 4 && boardHistory.length > 1) {
    const lastBoard = boardHistory[boardHistory.length - 2];

    const xOffsets = [-1, 1]; // Left and Right
    xOffsets.forEach((xOffset) => {
      if (
        board[4][x + xOffset].piece === PiecesType.Pawn && // Pawn in correct spot
        board[4][x + xOffset].color === Teams.White && // Pawn is opposite color
        board[6][x + xOffset].piece === PiecesType.None && // No pawn at the original spot (needs to have moved)
        lastBoard[4][x + xOffset].piece === PiecesType.None && // Last board has no pawn at target spot
        lastBoard[5][x + xOffset].piece === PiecesType.None && // No piece in front of the pawn last turn
        lastBoard[6][x + xOffset].piece === PiecesType.Pawn && // Pawn in original spot on last board
        lastBoard[5][x + xOffset].color === Teams.White // Pawn is opposite color
      ) {
        addIfLegal(board, { from: { x, y }, to: { x: x + xOffset, y: y + 1 }, piece: board[y][x], enPassant: true }, availableMoves);
      }
    });
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function rook(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  const { x, y } = pos;
  const offsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  offsets.forEach((offset) => {
    let i = 1;
    while (x + offset.x * i >= 0 && x + offset.x * i <= 7 && y + offset.y * i >= 0 && y + offset.y * i <= 7) {
      if (empty(board, { x: x + offset.x * i, y: y + offset.y * i })) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] }, availableMoves);
      }
      // Capture
      else if (board[y + offset.y * i][x + offset.x * i].color !== color) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] }, availableMoves);
        break;
      } else break;

      i++;
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function knight(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  const { x, y } = pos;
  const offsets = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: 1, y: -2 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: 2 },
  ];

  offsets.forEach((offset) => {
    if (x + offset.x >= 0 && x + offset.x <= 7 && y + offset.y >= 0 && y + offset.y <= 7) {
      if (empty(board, { x: x + offset.x, y: y + offset.y })) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] }, availableMoves);
      } else if (board[y + offset.y][x + offset.x].color !== color) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] }, availableMoves);
      }
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function bishop(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  const { x, y } = pos;
  const offsets = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  offsets.forEach((offset) => {
    let i = 1;
    while (x + offset.x * i >= 0 && x + offset.x * i <= 7 && y + offset.y * i >= 0 && y + offset.y * i <= 7) {
      if (empty(board, { x: x + offset.x * i, y: y + offset.y * i })) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] }, availableMoves);
      } else if (board[y + offset.y * i][x + offset.x * i].color !== color) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] }, availableMoves);
        break;
      } else break;
      i++;
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function queen(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  rook(board, pos, availableMoves, color);
  bishop(board, pos, availableMoves, color);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function king(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  const { x, y } = pos;
  const offsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  offsets.forEach((offset) => {
    if (x + offset.x >= 0 && x + offset.x <= 7 && y + offset.y >= 0 && y + offset.y <= 7) {
      if (empty(board, { x: x + offset.x, y: y + offset.y })) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] }, availableMoves);
      } else if (board[y + offset.y][x + offset.x].color !== color) {
        addIfLegal(board, { from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] }, availableMoves);
      }
    }
  });

  // Castling
  if (color === Teams.White) {
    if (board[7][4].hasMoved) return;

    if (
      !board[7][0].hasMoved &&
      board[7][1].piece === PiecesType.None &&
      board[7][2].piece === PiecesType.None &&
      board[7][3].piece === PiecesType.None &&
      !squareUnderAttack(board, { y: 7, x: 2 }, Teams.White) &&
      !squareUnderAttack(board, { y: 7, x: 3 }, Teams.White) &&
      !squareUnderAttack(board, { y: 7, x: 4 }, Teams.White)
    ) {
      availableMoves.push({
        from: { x, y },
        to: { x: 2, y: 7 },
        piece: board[y][x],
        castle: {
          rookFrom: { x: 0, y: 7 },
          rookTo: { x: 3, y: 7 },
        },
      });
    }

    if (
      board[7][7].piece === PiecesType.Rook &&
      board[7][5].piece === PiecesType.None &&
      board[7][6].piece === PiecesType.None &&
      !board[7][7].hasMoved &&
      !squareUnderAttack(board, { y: 7, x: 6 }, Teams.White) &&
      !squareUnderAttack(board, { y: 7, x: 5 }, Teams.White) &&
      !squareUnderAttack(board, { y: 7, x: 4 }, Teams.White)
    ) {
      availableMoves.push({
        from: { x, y },
        to: { x: 6, y: 7 },
        piece: board[y][x],
        castle: {
          rookFrom: { x: 7, y: 7 },
          rookTo: { x: 5, y: 7 },
        },
      });
    }
  }

  if (color === Teams.Black) {
    if (board[0][4].hasMoved) return;

    if (
      !board[0][0].hasMoved &&
      board[0][1].piece === PiecesType.None &&
      board[0][2].piece === PiecesType.None &&
      board[0][3].piece === PiecesType.None &&
      !squareUnderAttack(board, { y: 0, x: 2 }, Teams.Black) &&
      !squareUnderAttack(board, { y: 0, x: 3 }, Teams.Black) &&
      !squareUnderAttack(board, { y: 0, x: 4 }, Teams.Black)
    ) {
      availableMoves.push({
        from: { x, y },
        to: { x: 2, y: 0 },
        piece: board[y][x],
        castle: {
          rookFrom: { x: 0, y: 0 },
          rookTo: { x: 3, y: 0 },
        },
      });
    }

    if (
      !board[0][7].hasMoved &&
      board[0][5].piece === PiecesType.None &&
      board[0][6].piece === PiecesType.None &&
      !squareUnderAttack(board, { y: 0, x: 4 }, Teams.Black) &&
      !squareUnderAttack(board, { y: 0, x: 5 }, Teams.Black) &&
      !squareUnderAttack(board, { y: 0, x: 6 }, Teams.Black)
    ) {
      availableMoves.push({
        from: { x, y },
        to: { x: 6, y: 0 },
        piece: board[y][x],
        castle: {
          rookFrom: { x: 7, y: 0 },
          rookTo: { x: 5, y: 0 },
        },
      });
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function squareUnderAttack(board: PieceType[][], square: { x: number; y: number }, color?: Teams) {
  const { x, y } = square;
  const team = color ?? board[y][x].color;

  // Pawn attacks
  if (team === Teams.Black) {
    if (x + 1 <= 7 && y + 1 <= 7 && board[y + 1][x + 1].color === Teams.White && board[y + 1][x + 1].piece === PiecesType.Pawn) return true;
    if (x - 1 >= 0 && y + 1 <= 7 && board[y + 1][x - 1].color === Teams.White && board[y + 1][x - 1].piece === PiecesType.Pawn) return true;
  }

  if (team === Teams.White) {
    if (x + 1 <= 7 && y - 1 >= 0 && board[y - 1][x + 1].color === Teams.Black && board[y - 1][x + 1].piece === PiecesType.Pawn) return true;
    if (x - 1 >= 0 && y - 1 >= 0 && board[y - 1][x - 1].color === Teams.Black && board[y - 1][x - 1].piece === PiecesType.Pawn) return true;
  }

  // Knight attacks
  const knightOffsets = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: 1, y: -2 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: 2 },
  ];

  for (let i = 0; i < knightOffsets.length; i++) {
    const offset = knightOffsets[i];
    if (inBounds({ x: x + offset.x, y: y + offset.y })) {
      if (board[y + offset.y][x + offset.x].color !== team && board[y + offset.y][x + offset.x].piece === PiecesType.Knight) return true;
    }
  }

  // King attacks
  const kingOffsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  // for (let i = 0; i < kingOffsets.length; i++) {
  //   const offset = kingOffsets[i];
  //   if (inBounds({ x: x + offset.x, y: y + offset.y })) {
  //     if (board[y + offset.y][x + offset.x].color !== team && board[y + offset.y][x + offset.x].piece === PiecesType.King) return true;
  //   }
  // }

  // // Rook attacks
  const rookOffsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  for (let i = 0; i < rookOffsets.length; i++) {
    const offset = rookOffsets[i];
    let x1 = x + offset.x;
    let y1 = y + offset.y;
    while (inBounds({ x: x1, y: y1 })) {
      if (board[y1][x1].piece !== PiecesType.None) {
        if (board[y1][x1].color !== team && (board[y1][x1].piece === PiecesType.Rook || board[y1][x1].piece === PiecesType.Queen)) return true;
        break;
      }

      x1 += offset.x;
      y1 += offset.y;
    }
  }

  // Bishop attacks
  const bishopOffsets = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];

  for (let i = 0; i < bishopOffsets.length; i++) {
    const offset = bishopOffsets[i];
    let x1 = x + offset.x;
    let y1 = y + offset.y;
    while (inBounds({ x: x1, y: y1 })) {
      if (board[y1][x1].piece !== PiecesType.None) {
        if (board[y1][x1].color !== team && (board[y1][x1].piece === PiecesType.Bishop || board[y1][x1].piece === PiecesType.Queen)) return true;
        break;
      }

      x1 += offset.x;
      y1 += offset.y;
    }
  }

  return false;
}
