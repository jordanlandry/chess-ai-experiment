import {
  Bishop,
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  castleWhoHasMoved,
  enPassant,
  INITIAL_BLACK_PAWN_Y,
  INITIAL_WHITE_PAWN_Y,
  King,
  Knight,
  Move,
  occupiedSquares,
  Pawn,
  pieceType,
  Queen,
  Rook,
  updateLastMoveProps,
  WhiteBishops,
  WhiteKing,
  WhiteKnights,
  WhitePawns,
  WhiteQueens,
  WhiteRooks,
} from "../board";
import makeMove from "../helpers/makeMove";
import { PiecesType, Teams } from "../properties";

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

function pushIfLegal(moves: Move[], move: Move, team: Teams) {
  moves.push(move);
  return;

  const attackingTeam = team === Teams.White ? Teams.Black : Teams.White;

  // If move is a capture, save the piece so we can undo it later
  const capturedPiece = board[move.to];
  updateLastMoveProps.updateLastMove = false;

  // Make the move
  makeMove(move.from, move.to, move.castle, move.enPassant, move.promoteTo, true);
  const kingPosition = team === Teams.White ? WhiteKing[0] : BlackKing[0];

  // Push if the king is not in check
  if (!squareIsAttacked(kingPosition, attackingTeam)) moves.push(move);

  // Undo move
  makeMove(move.to, move.from, move.castle, move.enPassant, move.promoteTo, true, true, capturedPiece);
  updateLastMoveProps.updateLastMove = true;
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
  const y = Math.floor(pos / 8);

  // En Passant
  if (y === 3) {
    if (x !== 7 && enPassant === pos + 1) pushIfLegal(moves, { from: pos, to: pos - 7, enPassant: true }, Teams.White);
    if (x !== 0 && enPassant === pos - 1) pushIfLegal(moves, { from: pos, to: pos - 9, enPassant: true }, Teams.White);
  }

  const promotionPieces = [Queen, Rook, Bishop, Knight];

  // Right
  if (x !== 7) {
    const r = pos - 7;

    if (occupiedBy(r, Teams.Black)) {
      if (y === 1) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: r, promoteTo: piece }, Teams.White));
      else pushIfLegal(moves, { from: pos, to: r }, Teams.White);
    }
  }

  // Left
  if (x !== 0) {
    const l = pos - 9;

    if (occupiedBy(l, Teams.Black)) {
      if (y === 1) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: l, promoteTo: piece }, Teams.White));
      else pushIfLegal(moves, { from: pos, to: l }, Teams.White);
    }
  }

  // Can't move if there is a piece in front of it
  const up1 = pos - 8;
  if (occupied(up1)) return;

  // Move up 1
  if (y === 1) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: up1, promoteTo: piece }, Teams.White));
  else pushIfLegal(moves, { from: pos, to: up1 }, Teams.White);

  // Move up by 2 (will never be able to promote)
  if (y === INITIAL_WHITE_PAWN_Y) {
    const up2 = pos - 16;
    if (!occupied(up2)) pushIfLegal(moves, { from: pos, to: up2 }, Teams.White);
  }
}

function blackPawn(moves: Move[], pos: number) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  const promotionPieces = [Queen, Rook, Bishop, Knight];

  // Right
  if (x !== 7) {
    const r = pos + 9;

    if (occupiedBy(r, Teams.White)) {
      if (y === 6) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: r, promoteTo: piece }, Teams.Black));
      else pushIfLegal(moves, { from: pos, to: r }, Teams.Black);
    }
  }

  // Left
  if (x !== 0) {
    const l = pos + 7;

    if (occupiedBy(l, Teams.White)) {
      if (y === 6) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: l, promoteTo: piece }, Teams.Black));
      else pushIfLegal(moves, { from: pos, to: l }, Teams.Black);
    }
  }

  // En Passant
  if (y === 4) {
    if (x !== 7 && enPassant === pos + 1) pushIfLegal(moves, { from: pos, to: pos + 9, enPassant: true }, Teams.Black);
    if (x !== 0 && enPassant === pos - 1) pushIfLegal(moves, { from: pos, to: pos + 7, enPassant: true }, Teams.Black);
  }

  // Can't move if there is a piece in front of it
  const up1 = pos + 8;
  if (occupied(up1)) return;

  // Move up 1
  if (y === 6) promotionPieces.forEach((piece) => pushIfLegal(moves, { from: pos, to: up1, promoteTo: piece }, Teams.Black));
  else pushIfLegal(moves, { from: pos, to: up1 }, Teams.Black);

  // Move up by 2 (will never be able to promote)
  if (y === INITIAL_BLACK_PAWN_Y) {
    const up2 = pos + 16;
    if (!occupied(up2)) pushIfLegal(moves, { from: pos, to: up2 }, Teams.Black);
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
    pushIfLegal(moves, { from: pos, to: r }, team);
    if (occupied(r)) break;
  }

  // Left
  for (let i = x - 1; i >= 0; i--) {
    const l = y * 8 + i;
    if (occupiedBy(l, team)) break;
    pushIfLegal(moves, { from: pos, to: l }, team);
    if (occupied(l)) break;
  }

  // Up
  for (let i = y - 1; i >= 0; i--) {
    const u = i * 8 + x;
    if (occupiedBy(u, team)) break;
    pushIfLegal(moves, { from: pos, to: u }, team);
    if (occupied(u)) break;
  }

  // Down
  for (let i = y + 1; i < 8; i++) {
    const d = i * 8 + x;
    if (occupiedBy(d, team)) break;
    pushIfLegal(moves, { from: pos, to: d }, team);
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

  if (x >= 1 && y >= 2 && !occupiedBy(u2l1, team)) pushIfLegal(moves, { from: pos, to: u2l1 }, team);
  if (x <= 6 && y >= 2 && !occupiedBy(u2r1, team)) pushIfLegal(moves, { from: pos, to: u2r1 }, team);
  if (x >= 2 && y >= 1 && !occupiedBy(u1l2, team)) pushIfLegal(moves, { from: pos, to: u1l2 }, team);
  if (x <= 5 && y >= 1 && !occupiedBy(u1r2, team)) pushIfLegal(moves, { from: pos, to: u1r2 }, team);
  if (x >= 2 && y <= 6 && !occupiedBy(d1l2, team)) pushIfLegal(moves, { from: pos, to: d1l2 }, team);
  if (x <= 5 && y <= 6 && !occupiedBy(d1r2, team)) pushIfLegal(moves, { from: pos, to: d1r2 }, team);
  if (x >= 1 && y <= 5 && !occupiedBy(d2l1, team)) pushIfLegal(moves, { from: pos, to: d2l1 }, team);
  if (x <= 6 && y <= 5 && !occupiedBy(d2r1, team)) pushIfLegal(moves, { from: pos, to: d2r1 }, team);
}

// ~~~ BISHOPS ~~~ \\
function bishop(moves: Move[], pos: number, team: Teams) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  // Up Left
  for (let i = 1; i <= Math.min(x, y); i++) {
    const upLeft = pos - 9 * i;
    if (occupiedBy(upLeft, team)) break;
    pushIfLegal(moves, { from: pos, to: upLeft }, team);
    if (occupied(upLeft)) break;
  }

  // Up Right
  for (let i = 1; i <= Math.min(7 - x, y); i++) {
    const upRight = pos - 7 * i;
    if (occupiedBy(upRight, team)) break;
    pushIfLegal(moves, { from: pos, to: upRight }, team);
    if (occupied(upRight)) break;
  }

  // Down Left
  for (let i = 1; i <= Math.min(x, 7 - y); i++) {
    const downLeft = pos + 7 * i;
    if (occupiedBy(downLeft, team)) break;
    pushIfLegal(moves, { from: pos, to: downLeft }, team);
    if (occupied(downLeft)) break;
  }

  // Down Right
  for (let i = 1; i <= Math.min(7 - x, 7 - y); i++) {
    const downRight = pos + 9 * i;
    if (occupiedBy(downRight, team)) break;
    pushIfLegal(moves, { from: pos, to: downRight }, team);
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
    if (!occupiedBy(up, team)) pushIfLegal(moves, { from: pos, to: up }, team);
  }

  // Down
  if (y < 7) {
    const down = pos + 8;
    if (!occupiedBy(down, team)) pushIfLegal(moves, { from: pos, to: down }, team);
  }

  // Left
  if (x > 0) {
    const left = pos - 1;
    if (!occupiedBy(left, team)) pushIfLegal(moves, { from: pos, to: left }, team);
  }

  // Right
  if (x < 7) {
    const right = pos + 1;
    if (!occupiedBy(right, team)) pushIfLegal(moves, { from: pos, to: right }, team);
  }

  // Up Left
  if (x > 0 && y > 0) {
    const upLeft = pos - 9;
    if (!occupiedBy(upLeft, team)) pushIfLegal(moves, { from: pos, to: upLeft }, team);
  }

  // Up Right
  if (x < 7 && y > 0) {
    const upRight = pos - 7;
    if (!occupiedBy(upRight, team)) pushIfLegal(moves, { from: pos, to: upRight }, team);
  }

  // Down Left
  if (x > 0 && y < 7) {
    const downLeft = pos + 7;
    if (!occupiedBy(downLeft, team)) pushIfLegal(moves, { from: pos, to: downLeft }, team);
  }

  // Down Right
  if (x < 7 && y < 7) {
    const downRight = pos + 9;
    if (!occupiedBy(downRight, team)) pushIfLegal(moves, { from: pos, to: downRight }, team);
  }

  // Castling
  // White
  if (team === Teams.White) {
    if (canCastle(pos, 62, Teams.White)) moves.push({ from: pos, to: 62, castle: true });
    if (canCastle(pos, 58, Teams.White)) moves.push({ from: pos, to: 58, castle: true });
  }

  // Black
  if (team === Teams.Black) {
    if (canCastle(pos, 6, Teams.Black)) moves.push({ from: pos, to: 6, castle: true });
    if (canCastle(pos, 2, Teams.Black)) moves.push({ from: pos, to: 2, castle: true });
  }
}

const blackAttacks = (pos: number) => squareIsAttacked(pos, Teams.Black);
const whiteAttacks = (pos: number) => squareIsAttacked(pos, Teams.White);

function canCastle(from: number, to: number, team: Teams) {
  if (team === Teams.White) {
    if (board[60] !== King) return false;

    if (blackAttacks(60)) return false;

    if (castleWhoHasMoved[team].king) return false;

    if (from !== 60) return false;
    if (to === 62) {
      if (blackAttacks(61) || blackAttacks(62)) return false;
      if (occupied(61) || occupied(62)) return false;
      if (board[63] !== Rook) return false;
      if (castleWhoHasMoved[team].rightRook) return false;

      return true;
    }

    if (to === 58) {
      if (blackAttacks(59) || blackAttacks(58) || blackAttacks(57)) return false;
      if (occupied(59) || occupied(58) || occupied(57)) return false;
      if (board[56] !== Rook) return false;
      if (castleWhoHasMoved[team].leftRook) return false;

      return true;
    }

    return false;
  }

  // Black team
  else {
    if (board[4] !== -King) return false;
    if (whiteAttacks(4)) return false;
    if (castleWhoHasMoved[team].king) return false;

    if (from !== 4) return false;
    if (to === 6) {
      if (whiteAttacks(5) || whiteAttacks(6)) return false;
      if (occupied(5) || occupied(6)) return false;
      if (board[7] !== -Rook) return false;
      if (castleWhoHasMoved[team].rightRook) return false;

      return true;
    }

    if (to === 2) {
      if (whiteAttacks(3) || whiteAttacks(2) || whiteAttacks(1)) return false;
      if (occupied(3) || occupied(2) || occupied(1)) return false;
      if (board[0] !== -Rook) return false;
      if (castleWhoHasMoved[team].leftRook) return false;

      return true;
    }
  }

  return false;
}

export function squareIsAttacked(pos: number, attackedBy: Teams) {
  // Check for rooks
  const attackingRook = attackedBy === Teams.White ? Rook : -Rook;
  const attackingQueen = attackedBy === Teams.White ? Queen : -Queen;

  const x = pos % 8;
  const y = Math.floor(pos / 8);

  // Down
  for (let i = pos - 8; i >= 0; i -= 8) {
    const newX = i % 8;
    if (newX !== x) break;
    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingRook || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  // Up
  for (let i = pos + 8; i < 64; i += 8) {
    const newX = i % 8;
    if (newX !== x) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingRook || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  // Right
  for (let i = pos + 1; i < pos + 8; i++) {
    const newY = Math.floor(i / 8);
    if (newY !== y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingRook || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  // Left
  for (let i = pos - 1; i > pos - 8; i--) {
    const newY = Math.floor(i / 8);
    if (newY !== y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingRook || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  // Check for bishops
  const attackingBishop = attackedBy === Teams.White ? Bishop : -Bishop;
  for (let i = pos + 7; i < 64; i += 7) {
    const newX = i % 8;
    const newY = Math.floor(i / 8);
    if (newX > x || newY < y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingBishop || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  for (let i = pos + 9; i < 64; i += 9) {
    const newX = i % 8;
    const newY = Math.floor(i / 8);
    if (newX < x || newY < y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingBishop || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  for (let i = pos - 7; i >= 0; i -= 7) {
    const newX = i % 8;
    const newY = Math.floor(i / 8);
    if (newX < x || newY > y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingBishop || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  for (let i = pos - 9; i >= 0; i -= 9) {
    const newX = i % 8;
    const newY = Math.floor(i / 8);
    if (newX > x || newY > y) break;

    if (board[i] === 0) continue;
    if (occupiedBy(pos, attackedBy)) break;
    if (board[i] === attackingBishop || board[i] === attackingQueen) return true;
    if (occupied(i)) break;
  }

  // Check for knights
  const attackingKnight = attackedBy === Teams.White ? Knight : -Knight;
  const knightMoves = [pos + 17, pos + 15, pos + 10, pos + 6, pos - 17, pos - 15, pos - 10, pos - 6];

  for (let i = 0; i < knightMoves.length; i++) {
    if (occupiedBy(pos, attackedBy)) continue;
    const newX = knightMoves[i] % 8;
    const newY = Math.floor(knightMoves[i] / 8);
    if (newX > x + 2 || newX < x - 2) continue;
    if (newY > y + 2 || newY < y - 2) continue;

    if (board[knightMoves[i]] === attackingKnight) return true;
  }

  // Check for pawns
  const attackingPawn = attackedBy === Teams.White ? Pawn : -Pawn;
  const pawnMoves = attackedBy === Teams.White ? [pos + 9, pos + 7] : [pos - 9, pos - 7];

  for (let i = 0; i < pawnMoves.length; i++) {
    if (occupiedBy(pos, attackedBy)) continue;
    const newX = pawnMoves[i] % 8;
    const newY = Math.floor(pawnMoves[i] / 8);
    if (newX > x + 1 || newX < x - 1) continue;
    if (newY > y + 1 || newY < y - 1) continue;

    if (board[pawnMoves[i]] === attackingPawn) return true;

    // Check for en passant
    if (enPassant !== -1 && pawnMoves[i] === enPassant) return true;
    if (attackedBy === Teams.White && y === 3) {
      if (enPassant === pos - 1) return true;
      if (enPassant === pos + 1) return true;
    }

    if (attackedBy === Teams.Black && y === 4) {
      if (enPassant === pos - 1) return true;
      if (enPassant === pos + 1) return true;
    }
  }

  // Check for king
  const attackingKing = attackedBy === Teams.White ? King : -King;
  const kingMoves = [pos + 1, pos - 1, pos + 8, pos - 8, pos + 7, pos - 7, pos + 9, pos - 9];

  for (let i = 0; i < kingMoves.length; i++) {
    if (occupiedBy(pos, attackedBy)) continue;
    const newX = kingMoves[i] % 8;
    const newY = Math.floor(kingMoves[i] / 8);
    if (newX > x + 1 || newX < x - 1) continue;
    if (newY > y + 1 || newY < y - 1) continue;

    if (board[kingMoves[i]] === attackingKing) return true;
  }

  return false;
}
