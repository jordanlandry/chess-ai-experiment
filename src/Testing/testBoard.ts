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

import { board, Move } from "../board";
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
const availableMoves = [
  new Set([]), new Set([16, 18]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([21, 23]), new Set([]),
  new Set([16, 24]), new Set([17, 25]), new Set([18, 26]), new Set([19, 27]), new Set([20, 28]), new Set([21, 29]), new Set([22, 30]), new Set([23, 31]),
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]),
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([]), 
  new Set([32, 40]), new Set([33, 41]), new Set([34, 42]), new Set([35, 43]), new Set([36, 44]), new Set([37, 45]), new Set([38, 46]), new Set([39, 47]),
  new Set([]), new Set([40, 42]), new Set([]), new Set([]), new Set([]), new Set([]), new Set([45, 47]), new Set([]),
]

export function getAvailableMovesNew(pos: number) {
  return availableMoves[pos];
}

// Keep track of the min and max x and y values that your pieces are on to limit the search
// This should theoretically cut down on the number of searches you have to do
// Starting board position
interface Boundries {
  [key: string]: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

const getY = (pos: number) => pos % 8;
const getX = (pos: number) => Math.floor(pos / 8);

const pieceBoundries = {
  [Teams.White]: { minX: 0, maxX: 7, minY: 6, maxY: 7 },
  [Teams.Black]: { minX: 0, maxX: 7, minY: 0, maxY: 1 },
} as Boundries;

function updatePieceBoundries(move: Move, team: Teams) {
  const x = getY(move.to);
  const y = getX(move.to);

  pieceBoundries[team].minX = Math.min(pieceBoundries[team].minX, x);
  pieceBoundries[team].maxX = Math.max(pieceBoundries[team].maxX, x);
  pieceBoundries[team].minY = Math.min(pieceBoundries[team].minY, y);
  pieceBoundries[team].maxY = Math.max(pieceBoundries[team].maxY, y);
}

export function updateAvailableMoves(move: Move) {
  // Remove the previous available moves from the old position
  availableMoves[move.from] = new Set();

  // Remove the previous available moves from the new position
  availableMoves[move.to] = new Set();

  // Get the available moves of the new piece
  const newAvailableMoves = getAvailableMovesTest(move.to, board[move.to] > 0 ? Teams.White : Teams.Black);
  newAvailableMoves.forEach((pos) => availableMoves[move.to].add(pos.to));

  // Update the boundries of the piece
  updatePieceBoundries(move, board[move.to] > 0 ? Teams.White : Teams.Black);

  // Update the available moves of the pieces that you unblocked with your move

  // Look right to find a rook or queen
  for (let i = move.to + 1; i <= pieceBoundries[Teams.White].maxX; i++) {
    if (board[i] === 0) continue;

    if (board[i] === Rook || board[i] === Queen) {
      getAvailableMovesTest(i, Teams.White).forEach((pos) => availableMoves[i].add(i));
      break;
    }

    break;
  }

  // Look left to find a rook or queen
  for (let i = move.to - 1; i >= pieceBoundries[Teams.White].minX; i--) {
    if (board[i] === 0) continue;

    if (board[i] === Rook || board[i] === Queen) {
      getAvailableMovesTest(i, Teams.White).forEach((pos) => availableMoves[i].add(i));
      break;
    }

    break;
  }

  // Look up to find a rook or queen
  for (let i = move.to - 8; i >= pieceBoundries[Teams.White].minY; i -= 8) {
    if (board[i] === 0) continue;

    if (board[i] === Rook || board[i] === Queen) {
      getAvailableMovesTest(i, Teams.White).forEach((pos) => availableMoves[i].add(i));
      break;
    }

    break;
  }

  // Look down to find a rook or queen
  for (let i = move.to + 8; i < 64; i += 8) {
    if (board[i] === 0) continue;

    if (board[i] === Rook || board[i] === Queen) {
      getAvailableMovesTest(i, Teams.White).forEach((pos) => availableMoves[i].add(pos.to));
      break;
    }

    break;
  }
}

export function testSpeed() {}
