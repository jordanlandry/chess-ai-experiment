// After every move, I need to keep track of what squares are being attacked by each piece
// My idea is when you move a piece, you must then check in all 8 directions from that square to look for specific pieces
// So for example when you move a piece, you have to check up, down, left, right, to update pieces that rooks are attacking,
// and then you have to check up-left, up-right, down-left, down-right to update pieces that bishops are attacking
// (and queens), and etc.
// Then you can update the squares being attacked by the piece you just moved.

// Theoretically, you should only have to make a maximum of 35 searches after every move to look in each direction (including knights)

// One optimization I can think of is to keep track of the maximum x and y values that you've gone and limit the search to that,
// For example if your highest piece is on the 4th rank, you don't need to check the 5th rank for pieces since you will have no pieces there
// This optimization will only work for a small subset of moves, but it should be able to noticeably improve performance for those moves
// As minimax will be calling this function potentially millions of times

// Antoehr optimization is to keep track of the number of each piece on the board, and don't search for pieces that aren't on the board
// I also could keep track of the min and max x and y of each piece, and only search in those directions
// like maxQueenX = 5, then don't have to continue search if x > 5

// Another thought, is to keep track of pieces that are blocking attacks from your other pieces, and when you move the blocking piece,
// You can update the rest of the squares.

// For example if you have something like this:
// (R = rook, B = bishop, 0 = Safe, x = Attacked)
// 0 x 0 0
// B 0 0 0
// R x x x

// I can say position 1 is a potential attack square for the rook, and keep track of where the piece is that's blocking (position 5)
// Then say if I moved position 5, then position 1 is now being attacked by the rook.
// Then update the new spots being attacked by the bishop
// I need to keep track of what squares are being attacked by each piece in order to determine available moves very quickly

import { Move, pieceType } from "../board";
import getAvailableMovesTest from "../game/getAvailableMoves";
import testFunctionSpeed from "../helpers/testFunctionSpeed";
import { Teams } from "../properties";

const Rook = 1;
const Knight = 2;
const Bishop = 4;
const Queen = 8;
const King = 16;
const Pawn = 32;

export const whiteAttacksTest = new Set([40, 41, 42, 43, 44, 45, 46, 47]);
export const blackAttacksTest = new Set([16, 17, 18, 19, 20, 21, 22, 23]);

// prettier-ignore
export const availableMoves = [
  new Set([]), new Set([16, 18]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([21, 23]), new Set([]),
  new Set([16, 24]), new Set([17, 25]), new Set([18, 26]), new Set([19, 27]), new Set([20, 28]), new Set([21, 29]), new Set([22, 30]), new Set([23, 31]),
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]),
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([32, 40]), new Set([33, 41]), new Set([34, 42]), new Set([35, 43]), new Set([36, 44]), new Set([37, 45]), new Set([38, 46]), new Set([39, 47]),
  new Set([]), new Set([40, 42]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([45, 47]), new Set([]),
]

// This is so I can get the availableMoves without looping over all 64 indices
export const availableMoveIndexes = new Set([1, 6, 8, 9, 10, 11, 12, 13, 14, 15, 48, 49, 50, 51, 52, 53, 54, 55, 57, 62]);

export function getAvailableMovesNew(pos: number) {
  return availableMoves[pos];
}

// Keep track of the min and max x and y values that your pieces are on to limit the search
// This should theoretically cut down on the number of searches you have to do
// Starting board position
// interface Boundries {
//   [key: string]: {
//     minX: number;
//     maxX: number;
//     minY: number;
//     maxY: number;
//   };
// }

const numToLetter = {
  "0": "-",
  "1": "R",
  "2": "N",
  "4": "B",
  "8": "Q",
  "16": "K",
  "32": "P",
  "-1": "r",
  "-2": "n",
  "-4": "b",
  "-8": "q",
  "-16": "k",
  "-32": "p",
} as { [key: string]: string };

export const pieceValues = {
  [Rook]: 5,
  [Knight]: 3,
  [Bishop]: 3,
  [Queen]: 9,
  [King]: 100,
  [Pawn]: 1,
} as { [key: number]: number };

export const pieceCounts = {
  [Teams.White]: { [Rook]: 2, [Knight]: 2, [Bishop]: 2, [Queen]: 1, [King]: 1, [Pawn]: 8 },
  [Teams.Black]: { [Rook]: 2, [Knight]: 2, [Bishop]: 2, [Queen]: 1, [King]: 1, [Pawn]: 8 },
} as { [key: number]: { [key: number]: number } };

export function printBoard() {
  let str = "";
  for (let i = 0; i < 64; i++) {
    if (i % 8 === 0) str += "\n";
    str += numToLetter[testBoard[i]] + " ";
  }

  console.log(str);
}

const getY = (pos: number) => pos % 8;
const getX = (pos: number) => Math.floor(pos / 8);

// const pieceBoundries = {
//   [Teams.White]: { minX: 0, maxX: 7, minY: 6, maxY: 7 },
//   [Teams.Black]: { minX: 0, maxX: 7, minY: 0, maxY: 1 },
// } as Boundries;

// // TODO Implement this into the search for piece functions
// function updatePieceBoundries(move: Move, team: Teams) {
//   const x = getY(move.to);
//   const y = getX(move.to);

//   pieceBoundries[team].minX = Math.min(pieceBoundries[team].minX, x);
//   pieceBoundries[team].maxX = Math.max(pieceBoundries[team].maxX, x);
//   pieceBoundries[team].minY = Math.min(pieceBoundries[team].minY, y);
//   pieceBoundries[team].maxY = Math.max(pieceBoundries[team].maxY, y);
// }

interface Boundries {
  [key: number]: {
    [key: number]: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
  };
}

const pieceBoundries = {
  [Teams.White]: {
    [Rook]: { minX: 0, maxX: 7, minY: 7, maxY: 7 },
    [Knight]: { minX: 1, maxX: 6, minY: 7, maxY: 7 },
    [Bishop]: { minX: 2, maxX: 5, minY: 7, maxY: 7 },
    [Queen]: { minX: 3, maxX: 3, minY: 7, maxY: 7 },
    [King]: { minX: 5, maxX: 5, minY: 7, maxY: 7 },
    [Pawn]: { minX: 0, maxX: 7, minY: 6, maxY: 6 },
  },
  [Teams.Black]: {
    [Rook]: { minX: 0, maxX: 7, minY: 0, maxY: 0 },
    [Knight]: { minX: 1, maxX: 6, minY: 0, maxY: 0 },
    [Bishop]: { minX: 2, maxX: 5, minY: 0, maxY: 0 },
    [Queen]: { minX: 3, maxX: 3, minY: 0, maxY: 0 },
    [King]: { minX: 4, maxX: 4, minY: 0, maxY: 0 },
    [Pawn]: { minX: 0, maxX: 7, minY: 1, maxY: 1 },
  },
} as Boundries;

function updateBoundries(move: Move, team: Teams) {
  const x = getY(move.to);
  const y = getX(move.to);
  const piece = Math.abs(testBoard[move.from]);

  pieceBoundries[team][piece].minX = Math.min(pieceBoundries[team][piece].minX, x);
  pieceBoundries[team][piece].maxX = Math.max(pieceBoundries[team][piece].maxX, x);
  pieceBoundries[team][piece].minY = Math.min(pieceBoundries[team][piece].minY, y);
  pieceBoundries[team][piece].maxY = Math.max(pieceBoundries[team][piece].maxY, y);
}

// prettier-ignore
export const testBoard = [
  -Rook, -Knight, -Bishop, -Queen, -King, -Bishop, -Knight, -Rook,
  -Pawn, -Pawn, -Pawn, -Pawn, -Pawn, -Pawn, -Pawn, -Pawn,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn,
  Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook,
]

const getTeam = (piece: number) => (piece > 0 ? Teams.White : Teams.Black);

export const lastMoveTest = { from: -1, to: -1 };

function updatePieceCounts(move: Move, capture?: number) {
  const piece = testBoard[move.to];
  const team = getTeam(piece);

  if (capture) pieceCounts[team][capture]++;
  else pieceCounts[team][piece]--;
}

export function updateTestBoard(move: Move) {
  // updateBoundries(move, getTeam(testBoard[move.from]));
  updatePieceCounts(move);

  const piece = testBoard[move.from];

  testBoard[move.to] = piece;
  testBoard[move.from] = 0;

  // Update lastMove
  lastMoveTest.from = move.from;
  lastMoveTest.to = move.to;

  // updatePieceBoundries(move, getTeam(piece));
  updateAvailableMoves(move);
}

export function undoBoardUpdate(move: Move, capture: number, previousAvailableMoves: Move[]) {
  if (capture) testBoard[move.to] = capture;

  // if (capture) testBoard[move.to] = capture;
  // updatePieceCounts(move, capture);
}

// Called after the board updates
export function updateAvailableMoves(move: Move) {
  // Remove the previous available moves from the old position
  availableMoves[move.from] = new Set();

  // Remove the previous available moves from the new position
  availableMoves[move.to] = new Set();

  // Get the available moves of the new piece
  const newAvailableMoves = getAvailableMovesTest(move.to, testBoard[move.to] > 0 ? Teams.White : Teams.Black);
  newAvailableMoves.forEach((pos) => availableMoves[move.to].add(pos.to));

  // Update the available moves of the pieces that you unblocked with your move
  const unblockedRooksPos = lookForRooks(move.from);
  const unblockedBishopsPos = lookForBishops(move.from);
  const unblockedKnights = lookForKnights(move.from);
  const unblockedKing = lookForKing(move.from);
  const unblockedPawns = lookForPawns(move.from);

  const unblockedPiecesPos = [...unblockedRooksPos, ...unblockedBishopsPos, ...unblockedKnights, ...unblockedKing, ...unblockedPawns];
  for (const pos of unblockedPiecesPos) {
    const newAvailableMoves = getAvailableMovesTest(pos, testBoard[pos] > 0 ? Teams.White : Teams.Black);
    newAvailableMoves.forEach((move) => availableMoves[pos].add(move.to));
  }

  // Update the available moves of the pieces that you blocked with your move
  const blockedRooks = lookForRooks(move.to);
  const blockedBishops = lookForBishops(move.to);
  const blockedKnights = lookForKnights(move.to);
  const blockedKing = lookForKing(move.to);
  const blockedPawns = lookForPawns(move.to);

  const blockedPieces = [...blockedRooks, ...blockedBishops, ...blockedKnights, ...blockedKing, ...blockedPawns];

  for (const pos of blockedPieces) {
    // Reset the old available moves of that piece
    availableMoves[pos] = new Set();

    const newAvailableMoves = getAvailableMovesTest(pos, testBoard[pos] > 0 ? Teams.White : Teams.Black);
    newAvailableMoves.forEach((move) => availableMoves[pos].add(move.to));
  }
}

export function getPieceType(pos: number) {
  return Math.abs(testBoard[pos]);
}

function lookForRooks(pos: number) {
  const positions = [];

  // After doing some testing, surprisingly it is faster to have 4 separate loops
  // Instead of 1 loop with 4 booleans, to check if you should look in a certain direction

  // Look left for a rook
  for (let i = pos - 1; i >= 0; i--) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Rook || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look right for a rook
  for (let i = pos + 1; i < 64; i++) {
    const piece = getPieceType(i);

    if (piece === 0) continue;
    if (piece === Rook || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look up for a rook
  for (let i = pos - 8; i >= 0; i -= 8) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Rook || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look down for a rook
  for (let i = pos + 8; i < 64; i += 8) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Rook || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  return positions;
}

function lookForBishops(pos: number) {
  const positions = [];

  // Look up and left for a bishop
  for (let i = pos - 9; i >= 0; i -= 9) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Bishop || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look up and right for a bishop
  for (let i = pos - 7; i >= 0; i -= 7) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Bishop || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look down and left for a bishop
  for (let i = pos + 7; i < 64; i += 7) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Bishop || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  // Look down and right for a bishop
  for (let i = pos + 9; i < 64; i += 9) {
    const piece = getPieceType(i);
    if (piece === 0) continue;
    if (piece === Bishop || piece === Queen) {
      positions.push(i);
      break;
    }

    break;
  }

  return positions;
}

function lookForKnights(pos: number) {
  const positions = [];

  const u2l1 = pos - 17;
  const u2r1 = pos - 15;
  const u1l2 = pos - 10;
  const u1r2 = pos - 6;
  const d1l2 = pos + 6;
  const d1r2 = pos + 10;
  const d2l1 = pos + 15;
  const d2r1 = pos + 17;

  const x = getX(pos);
  const y = getY(pos);

  if (x - 2 >= 0 && y - 1 >= 0 && testBoard[u2l1] === Knight) positions.push(u2l1);
  if (x - 2 >= 0 && y + 1 < 8 && testBoard[u2r1] === Knight) positions.push(u2r1);
  if (x - 1 >= 0 && y - 2 >= 0 && testBoard[u1l2] === Knight) positions.push(u1l2);
  if (x - 1 >= 0 && y + 2 < 8 && testBoard[u1r2] === Knight) positions.push(u1r2);
  if (x + 1 < 8 && y - 2 >= 0 && testBoard[d1l2] === Knight) positions.push(d1l2);
  if (x + 1 < 8 && y + 2 < 8 && testBoard[d1r2] === Knight) positions.push(d1r2);
  if (x + 2 < 8 && y - 1 >= 0 && testBoard[d2l1] === Knight) positions.push(d2l1);
  if (x + 2 < 8 && y + 1 < 8 && testBoard[d2r1] === Knight) positions.push(d2r1);

  return positions;
}

function lookForKing(pos: number) {
  const positions: number[] = [];

  const x = getX(pos);
  const y = getY(pos);

  const r = pos + 1;
  const l = pos - 1;
  const u = pos - 8;
  const d = pos + 8;

  if (r < 64 && getPieceType(r) === King) positions.push(r);
  if (l >= 0 && getPieceType(l) === King) positions.push(l);
  if (u >= 0 && getPieceType(u) === King) positions.push(u);
  if (d < 64 && getPieceType(d) === King) positions.push(d);

  const ur = pos - 7;
  const ul = pos - 9;
  const dr = pos + 9;
  const dl = pos + 7;

  if (ur >= 0 && getPieceType(ur) === King) positions.push(ur);
  if (ul >= 0 && getPieceType(ul) === King) positions.push(ul);
  if (dr < 64 && getPieceType(dr) === King) positions.push(dr);
  if (dl < 64 && getPieceType(dl) === King) positions.push(dl);

  return positions;
}

function lookForPawns(pos: number) {
  const positions: number[] = [];

  // Look up 1
  const u1 = pos - 8;
  if (u1 >= 0 && getPieceType(u1) === Pawn) positions.push(u1);

  // Look up 2
  const u2 = pos - 16;
  if (u2 >= 0 && getPieceType(u2) === Pawn) positions.push(u2);

  // Look down 1
  const d1 = pos + 8;
  if (d1 < 64 && getPieceType(d1) === Pawn) positions.push(d1);

  // Look down 2
  const d2 = pos + 16;
  if (d2 < 64 && getPieceType(d2) === Pawn) positions.push(d2);

  // Look up and right 1
  const ur = pos - 7;
  if (ur >= 0 && getPieceType(ur) === Pawn) positions.push(ur);

  // Look up and left 1
  const ul = pos - 9;
  if (ul >= 0 && getPieceType(ul) === Pawn) positions.push(ul);

  // Look down and right 1
  const dr = pos + 9;
  if (dr < 64 && getPieceType(dr) === Pawn) positions.push(dr);

  // Look down and left 1
  const dl = pos + 7;
  if (dl < 64 && getPieceType(dl) === Pawn) positions.push(dl);

  return positions;
}

export function testSpeed() {
  testFunctionSpeed(() => updateAvailableMoves({ from: 0, to: 1 }), "Update available moves");
}
