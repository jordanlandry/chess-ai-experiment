import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  INITIAL_BLACK_PAWN_Y,
  INITIAL_WHITE_PAWN_Y,
  Move,
  occupiedSquares,
  pieceType,
  WhiteBishops,
  WhiteKing,
  WhiteKnights,
  WhitePawns,
  WhiteQueens,
  WhiteRooks,
} from "../board";
import { Moves, PiecesType, Teams } from "../properties";

export default function getAvailableMovesTest(pos: number, team: Teams) {
  const moves: Move[] = [];

  const pieceFunctions = {
    [PiecesType.Pawn]: team === Teams.White ? whitePawn : blackPawn,
    [PiecesType.Rook]: rook,
    [PiecesType.Knight]: knight,
    [PiecesType.Bishop]: bishop,
    [PiecesType.Queen]: queen,
    [PiecesType.King]: king,
    [PiecesType.None]: () => {},
  } as { [key: string]: Function };

  const piece = pieceType(board[pos]);
  if (piece) pieceFunctions[piece](moves, pos, team);

  return moves;
}

export function getAllAvailableMovesTest(team: Teams) {
  const moves: Move[] = [];

  // White Team
  if (team === Teams.White) {
    WhitePawns.forEach((pos) => whitePawn(moves, pos));
    WhiteRooks.forEach((pos) => rook(moves, pos, team));
    WhiteKnights.forEach((pos) => knight(moves, pos, team));
    WhiteBishops.forEach((pos) => bishop(moves, pos, team));
    WhiteQueens.forEach((pos) => queen(moves, pos, team));
    king(moves, WhiteKing[0], team);
  }

  // Black Team
  else {
    BlackPawns.forEach((pos) => blackPawn(moves, pos));
    BlackRooks.forEach((pos) => rook(moves, pos, team));
    BlackBishops.forEach((pos) => bishop(moves, pos, team));
    BlackKnights.forEach((pos) => knight(moves, pos, team));
    BlackQueens.forEach((pos) => queen(moves, pos, team));
    king(moves, BlackKing[0], team);
  }

  return moves;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function occupied(pos: number) {
  return occupiedSquares[pos] !== Teams.None;
}

function occupiedBy(pos: number, team: Teams) {
  return occupiedSquares[pos] === team;
}

// ~~~ PAWNS ~~~ \\
function whitePawn(moves: Move[], pos: number) {
  const x = pos % 8;

  // Right
  if (x !== 7) {
    const r = pos - 7;
    if (occupiedBy(r, Teams.Black)) moves.push({ from: pos, to: r });
  }

  // Left
  if (x !== 0) {
    const l = pos - 9;
    if (occupiedBy(l, Teams.Black)) moves.push({ from: pos, to: l });
  }

  // Can't move if there is a piece in front of it
  const up1 = pos - 8;
  if (occupied(up1)) return;

  // Move up 1
  moves.push({ from: pos, to: up1 });

  const y = Math.floor(pos / 8);
  if (y === INITIAL_WHITE_PAWN_Y) {
    const up2 = pos - 16;
    if (!occupied(up2)) moves.push({ from: pos, to: up2 });
  }
}

function blackPawn(moves: Move[], pos: number) {
  const x = pos % 8;

  // Right
  if (x !== 7) {
    const r = pos + 9;
    if (occupiedBy(r, Teams.White)) moves.push({ from: pos, to: r });
  }

  // Left
  if (x !== 0) {
    const l = pos + 7;
    if (occupiedBy(l, Teams.White)) moves.push({ from: pos, to: l });
  }

  // Can't move if there is a piece in front of it
  const up1 = pos + 8;
  if (occupied(up1)) return;

  // Move up 1
  moves.push({ from: pos, to: up1 });

  const y = Math.floor(pos / 8);
  if (y === INITIAL_BLACK_PAWN_Y) {
    const up2 = pos + 16;
    if (!occupied(up2)) moves.push({ from: pos, to: up2 });
  }
}

// ~~~ ROOKS ~~~ \\
function rook(moves: Move[], pos: number, team: Teams) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  // Right
  for (let i = x + 1; i < 8; i++) {
    const r = y * 8 + i;
    if (occupiedBy(r, team)) break;
    moves.push({ from: pos, to: r });
    if (occupied(r)) break;
  }

  // Left
  for (let i = x - 1; i >= 0; i--) {
    const l = y * 8 + i;
    if (occupiedBy(l, team)) break;
    moves.push({ from: pos, to: l });
    if (occupied(l)) break;
  }

  // Up
  for (let i = y - 1; i >= 0; i--) {
    const u = i * 8 + x;
    if (occupiedBy(u, team)) break;
    moves.push({ from: pos, to: u });
    if (occupied(u)) break;
  }

  // Down
  for (let i = y + 1; i < 8; i++) {
    const d = i * 8 + x;
    if (occupiedBy(d, team)) break;
    moves.push({ from: pos, to: d });
    if (occupied(d)) break;
  }
}

// ~~~ KNIGHTS ~~~ \\
function knight(moves: Move[], pos: number, team: Teams) {
  const u2l1 = pos - 17;
  const u2r1 = pos - 15;
  const u1l2 = pos - 10;
  const u1r2 = pos - 6;
  const d1l2 = pos + 6;
  const d1r2 = pos + 10;
  const d2l1 = pos + 15;
  const d2r1 = pos + 17;

  const x = pos % 8;
  const y = Math.floor(pos / 8);

  if (x >= 1 && y >= 2 && !occupiedBy(u2l1, team)) moves.push({ from: pos, to: u2l1 });
  if (x <= 6 && y >= 2 && !occupiedBy(u2r1, team)) moves.push({ from: pos, to: u2r1 });
  if (x >= 2 && y >= 1 && !occupiedBy(u1l2, team)) moves.push({ from: pos, to: u1l2 });
  if (x <= 5 && y >= 1 && !occupiedBy(u1r2, team)) moves.push({ from: pos, to: u1r2 });
  if (x >= 2 && y <= 6 && !occupiedBy(d1l2, team)) moves.push({ from: pos, to: d1l2 });
  if (x <= 5 && y <= 6 && !occupiedBy(d1r2, team)) moves.push({ from: pos, to: d1r2 });
  if (x >= 1 && y <= 5 && !occupiedBy(d2l1, team)) moves.push({ from: pos, to: d2l1 });
  if (x <= 6 && y <= 5 && !occupiedBy(d2r1, team)) moves.push({ from: pos, to: d2r1 });
}

// ~~~ BISHOPS ~~~ \\
function bishop(moves: Move[], pos: number, team: Teams) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  // Up Left
  for (let i = 1; i <= Math.min(x, y); i++) {
    const upLeft = pos - 9 * i;
    if (occupiedBy(upLeft, team)) break;
    moves.push({ from: pos, to: upLeft });
    if (occupied(upLeft)) break;
  }

  // Up Right
  for (let i = 1; i <= Math.min(7 - x, y); i++) {
    const upRight = pos - 7 * i;
    if (occupiedBy(upRight, team)) break;
    moves.push({ from: pos, to: upRight });
    if (occupied(upRight)) break;
  }

  // Down Left
  for (let i = 1; i <= Math.min(x, 7 - y); i++) {
    const downLeft = pos + 7 * i;
    if (occupiedBy(downLeft, team)) break;
    moves.push({ from: pos, to: downLeft });
    if (occupied(downLeft)) break;
  }

  // Down Right
  for (let i = 1; i <= Math.min(7 - x, 7 - y); i++) {
    const downRight = pos + 9 * i;
    if (occupiedBy(downRight, team)) break;
    moves.push({ from: pos, to: downRight });
    if (occupied(downRight)) break;
  }
}

// ~~~ QUEENS ~~~ \\
function queen(moves: Move[], pos: number, team: Teams) {
  rook(moves, pos, team);
  bishop(moves, pos, team);
}

// ~~~ KINGS ~~~ \\
function king(moves: Move[], pos: number, team: Teams) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  // Up
  if (y > 0) {
    const up = pos - 8;
    if (!occupiedBy(up, team)) moves.push({ from: pos, to: up });
  }

  // Down
  if (y < 7) {
    const down = pos + 8;
    if (!occupiedBy(down, team)) moves.push({ from: pos, to: down });
  }

  // Left
  if (x > 0) {
    const left = pos - 1;
    if (!occupiedBy(left, team)) moves.push({ from: pos, to: left });
  }

  // Right
  if (x < 7) {
    const right = pos + 1;
    if (!occupiedBy(right, team)) moves.push({ from: pos, to: right });
  }

  // Up Left
  if (x > 0 && y > 0) {
    const upLeft = pos - 9;
    if (!occupiedBy(upLeft, team)) moves.push({ from: pos, to: upLeft });
  }

  // Up Right
  if (x < 7 && y > 0) {
    const upRight = pos - 7;
    if (!occupiedBy(upRight, team)) moves.push({ from: pos, to: upRight });
  }

  // Down Left
  if (x > 0 && y < 7) {
    const downLeft = pos + 7;
    if (!occupiedBy(downLeft, team)) moves.push({ from: pos, to: downLeft });
  }

  // Down Right
  if (x < 7 && y < 7) {
    const downRight = pos + 9;
    if (!occupiedBy(downRight, team)) moves.push({ from: pos, to: downRight });
  }

  // Castling todo
}
