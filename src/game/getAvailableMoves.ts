import { boardHistory, Moves, PiecesType, PieceType, Teams } from "../properties";

export default function getAvailableMoves(board: PieceType[][], pos: { x: number; y: number }) {
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
  if (piece === PiecesType.None) return availableMoves;

  moveFunctions[piece](board, { x, y }, availableMoves, color);

  return availableMoves;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function empty(board: PieceType[][], pos: { x: number; y: number }) {
  return board[pos.y][pos.x].piece === PiecesType.None;
}

function pawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[], color: Teams) {
  if (pos.y === 0 || pos.y === 7) return; // TODO - Promote

  if (color === Teams.White) whitePawn(board, pos, availableMoves);
  else blackPawn(board, pos, availableMoves);
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function whitePawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[]) {
  const { x, y } = pos;

  // 1 Square Forward
  if (empty(board, { x, y: y - 1 })) availableMoves.push({ from: { x, y }, to: { x, y: y - 1 }, piece: board[y][x] });

  // 2 Squares Forward
  if (y === 6 && empty(board, { x, y: y - 1 }) && empty(board, { x, y: y - 2 }))
    availableMoves.push({ from: { x, y }, to: { x, y: y - 2 }, piece: board[y][x] });

  // Capture Left
  if (x > 0 && !empty(board, { x: x - 1, y: y - 1 }) && board[y - 1][x - 1].color === Teams.Black)
    availableMoves.push({ from: { x, y }, to: { x: x - 1, y: y - 1 }, piece: board[y][x] });

  // Capture Right
  if (x < 7 && !empty(board, { x: x + 1, y: y - 1 }) && board[y - 1][x + 1].color === Teams.Black)
    availableMoves.push({ from: { x, y }, to: { x: x + 1, y: y - 1 }, piece: board[y][x] });

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
        availableMoves.push({ from: { x, y }, to: { x: x + xOffset, y: y - 1 }, piece: board[y][x], enPassant: true });
      }
    });
  }
}

function blackPawn(board: PieceType[][], pos: { x: number; y: number }, availableMoves: Moves[]) {
  const { x, y } = pos;

  // 1 Square Forward
  if (empty(board, { x, y: y + 1 })) availableMoves.push({ from: { x, y }, to: { x, y: y + 1 }, piece: board[y][x] });

  // 2 Squares Forward
  if (y === 1 && empty(board, { x, y: y + 1 }) && empty(board, { x, y: y + 2 }))
    availableMoves.push({ from: { x, y }, to: { x, y: y + 2 }, piece: board[y][x] });

  // Capture Left
  if (x > 0 && !empty(board, { x: x - 1, y: y + 1 }) && board[y + 1][x - 1].color === Teams.White)
    availableMoves.push({ from: { x, y }, to: { x: x - 1, y: y + 1 }, piece: board[y][x] });

  // Capture Right
  if (x < 7 && !empty(board, { x: x + 1, y: y + 1 }) && board[y + 1][x + 1].color === Teams.White)
    availableMoves.push({ from: { x, y }, to: { x: x + 1, y: y + 1 }, piece: board[y][x] });

  // En Passant
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
        availableMoves.push({ from: { x, y }, to: { x: x + xOffset, y: y + 1 }, piece: board[y][x], enPassant: true });
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
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] });
      } else if (board[y + offset.y * i][x + offset.x * i].color !== color) {
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] });
        break;
      } else {
        break;
      }
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
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] });
      } else if (board[y + offset.y][x + offset.x].color !== color) {
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] });
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
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] });
      } else if (board[y + offset.y * i][x + offset.x * i].color !== color) {
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x * i, y: y + offset.y * i }, piece: board[y][x] });
        break;
      } else {
        break;
      }
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
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] });
      } else if (board[y + offset.y][x + offset.x].color !== color) {
        availableMoves.push({ from: { x, y }, to: { x: x + offset.x, y: y + offset.y }, piece: board[y][x] });
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
      board[7][3].piece === PiecesType.None
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

    if (!board[7][7].hasMoved && board[7][5].piece === PiecesType.None && board[7][6].piece === PiecesType.None) {
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
      board[0][3].piece === PiecesType.None
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

    if (!board[0][7].hasMoved && board[0][5].piece === PiecesType.None && board[0][6].piece === PiecesType.None) {
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
