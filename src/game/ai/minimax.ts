import { BlackKing, board, castleMoveProperties, getKey, inStalemate, Move, pieceCounts, totalNumberOfPieces, WhiteKing } from "../../board";
import makeMove from "../../helpers/makeMove";
import { PiecesType, Teams } from "../../properties";
import { getAvailableMovesFor } from "../getAvailableMoves";
import orderMovesTest from "./orderMoves";

export interface Minimax {
  score: number;
  move: Move;
}

// Based on the difficulty, the maximum depth is set, and the number of moves to look at
// For example, if the difficulty is easy it won't look at every possible move
// This is so that it won't play the best move, but should still play an okay move based on the difficulty.
// Represented in the moves value, which is the percentage of moves to look at

export const callingFromAi = {
  searchForCheck: false,
};

export const functionTimes = {
  getMoves: 0,
  evaluateBoard: 0,
  savingCastleMoves: 0,
  makingMove: 0,
  undoingMove: 0,
  boardHashing: 0,
  orderMoves: 0,
} as { [key: string]: number };

export const depthTimes: number[] = [];

interface Diffitulty {
  maxDepth: number;
  elo: number;
}

export const difficulties = {
  beginner: { elo: 250, maxDepth: 3 },
  easy: { elo: 500, maxDepth: 4 },
  medium: { elo: 1000, maxDepth: 5 },
  hard: { elo: 1500, maxDepth: 7 },
  max: { elo: 1700, maxDepth: Infinity },
} as { [key: string]: Diffitulty };

// When there are less than 10 pieces left, the maxDepth must increase or else it will always repeat moves
// As is can not see far enough ahead to ever deliver a checkmate

// This will be defined in the BotMenu.tsx Component file
export const minimaxProperties = {
  maxDepth: Infinity,
  movesPercent: 1,
};

function evaluateBoard() {
  const startTime = Date.now();
  let score = 0;

  // White Team
  score += pieceCounts[Teams.White][PiecesType.Pawn] * 10;
  score += pieceCounts[Teams.White][PiecesType.Knight] * 30;
  score += pieceCounts[Teams.White][PiecesType.Bishop] * 30;
  score += pieceCounts[Teams.White][PiecesType.Rook] * 50;
  score += pieceCounts[Teams.White][PiecesType.Queen] * 90;
  score += pieceCounts[Teams.White][PiecesType.King] * 900;

  // Black Team
  score -= pieceCounts[Teams.Black][PiecesType.Pawn] * 10;
  score -= pieceCounts[Teams.Black][PiecesType.Knight] * 30;
  score -= pieceCounts[Teams.Black][PiecesType.Bishop] * 30;
  score -= pieceCounts[Teams.Black][PiecesType.Rook] * 50;
  score -= pieceCounts[Teams.Black][PiecesType.Queen] * 90;
  score -= pieceCounts[Teams.Black][PiecesType.King] * 900;

  functionTimes.evaluateBoard += Date.now() - startTime;

  return score;
}

interface Table extends Minimax {
  depth: number;
}

const MAX_TABLE_SIZE = 128_000;
let tableSize = 0;
let table = {} as { [key: string]: Table };

const maxTime = 2500;
let startTime = 0;
let previousBestMove = { from: -1, to: -1 };

export interface PreviousEvals {
  max: {
    [key: number]: {
      score: number;
      move: Move;
    }[];
  };

  min: {
    [key: number]: {
      score: number;
      move: Move;
    }[];
  };
}

export let previousBestMoves = {
  max: {},
  min: {},
} as PreviousEvals;

export let currentDepth = 1;
export default function getBestMoveTest(aiTeam: Teams) {
  callingFromAi.searchForCheck = true;
  startTime = Date.now();

  currentDepth = 1;

  if (totalNumberOfPieces < 10) minimaxProperties.maxDepth = Infinity;

  // Reset the times
  for (const key in functionTimes) {
    functionTimes[key] = 0;
  }

  depthTimes.length = 0;

  let bestMove: Minimax = { score: 0, move: { from: -1, to: -1 } };
  while (Date.now() - startTime < maxTime) {
    const start = Date.now();

    table = {};
    const next = minimax(currentDepth, -Infinity, Infinity, aiTeam === Teams.White);

    if (!next) break;

    bestMove = next;
    previousBestMove = next.move;
    currentDepth++;

    depthTimes.push(Date.now() - start);

    if (currentDepth >= minimaxProperties.maxDepth) break;
  }

  console.log(previousBestMoves.min);
  console.log("Depth: " + (currentDepth - 1));

  callingFromAi.searchForCheck = false;
  return bestMove;
}

// Depth for quiescence search (don't wanna use quiscence in the name of the variable)
// Cuz silly word
const qDepth = 5;

const nullMoveR = 3;
const nullMoveAllowed = (isMax: boolean, depth: number) => totalNumberOfPieces > 10 && !isMax && depth > nullMoveR;

function minimax(depth: number, alpha: number, beta: number, isMax: boolean): Minimax | null {
  if (depth < 1) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

  if (tableSize > MAX_TABLE_SIZE) {
    table = {};
    tableSize = 0;
  }

  if (Date.now() - startTime > maxTime) return null;

  // Maximizer
  if (isMax) {
    // Null Move Pruning
    if (nullMoveAllowed(isMax, depth)) {
      const score = minimax(depth - nullMoveR - 1, alpha, beta, false)?.score ?? 0;
      if (score >= beta) return { score, move: { from: -1, to: -1 } };
    }

    const boardHashingStart = Date.now();
    const boardHash = getKey();
    functionTimes.boardHashing += Date.now() - boardHashingStart;

    if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

    const bestMove = { score: -Infinity, move: { from: -1, to: -1 } };

    const moveStart = Date.now();
    const moves = getAvailableMovesFor(Teams.White);
    functionTimes.getMoves += Date.now() - moveStart;

    if (moves.length === 0) {
      if (inStalemate(Teams.White)) return { score: 0, move: { from: -1, to: -1 } };
      return bestMove;
    }

    const orderMovesStart = Date.now();
    const orderedMoves = orderMovesTest(moves, previousBestMove, isMax, depth);
    functionTimes.orderMoves += Date.now() - orderMovesStart;

    bestMove.move = moves[0];

    for (let i = 0; i < orderedMoves.length; i++) {
      const { from, to, castle, enPassant, promoteTo } = orderedMoves[i].move;

      // Save previous inmformation, so we can properly undo the move
      const capturedPiece = board[to];

      const castleTimeStart = Date.now();

      const previousWhiteCastle = { ...castleMoveProperties[Teams.White] };
      const previousBlackCastle = { ...castleMoveProperties[Teams.Black] };

      functionTimes.savingCastleMoves += Date.now() - castleTimeStart;

      const makeMoveStart = Date.now();
      makeMove(from, to, castle, enPassant, promoteTo, true); // Make move
      functionTimes.makingMove += Date.now() - makeMoveStart;

      const nextEval = minimax(depth - 1, alpha, beta, !isMax); // Get minimax for next move

      const undoMoveStart = Date.now();
      makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece); // Undo move
      functionTimes.undoingMove += Date.now() - undoMoveStart;

      // Update castle state
      castleMoveProperties[Teams.White] = previousWhiteCastle;
      castleMoveProperties[Teams.Black] = previousBlackCastle;

      // Update best move
      if (!nextEval) return null;

      // Prevent AI from losing king (it thinks trading kings is an even trade but it's not how it should work)
      if (WhiteKing.length === 0) continue;

      if (nextEval.score > bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = orderedMoves[i].move;
      }

      // Add to table
      if (depth === 1) {
        table[boardHash] = { ...bestMove, depth };
        tableSize++;
      }

      // Update alpha
      alpha = Math.max(alpha, bestMove.score);
      if (beta <= alpha) break;
    }

    return bestMove;
  }

  // Minimizer
  else {
    const boardHashingStart = Date.now();
    const boardHash = getKey() * -1;
    functionTimes.boardHashing += Date.now() - boardHashingStart;

    if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

    let bestMove = { score: Infinity, move: { from: -1, to: -1 } };

    const moveStart = Date.now();
    // const moves = getAllAvailableMovesTest(Teams.Black);
    const moves = getAvailableMovesFor(Teams.Black);
    functionTimes.getMoves += Date.now() - moveStart;

    if (moves.length === 0) {
      if (inStalemate(Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
      return bestMove;
    }

    const orderMovesStart = Date.now();
    const orderedMoves = orderMovesTest(moves, previousBestMove, isMax, depth);
    functionTimes.orderMoves += Date.now() - orderMovesStart;

    bestMove.move = moves[0];

    for (let i = 0; i < orderedMoves.length; i++) {
      const { from, to, castle, enPassant, promoteTo } = orderedMoves[i].move;

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      const castleTimeStart = Date.now();
      const previousWhiteCastle = { ...castleMoveProperties[Teams.White] };
      const previousBlackCastle = { ...castleMoveProperties[Teams.Black] };
      functionTimes.savingCastleMoves += Date.now() - castleTimeStart;

      const makeMoveStart = Date.now();
      makeMove(from, to, castle, enPassant, promoteTo, true);
      functionTimes.makingMove += Date.now() - makeMoveStart;

      const nextEval = minimax(depth - 1, alpha, beta, !isMax);

      const undoMoveStart = Date.now();
      makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece);
      functionTimes.undoingMove += Date.now() - undoMoveStart;

      // Update castle properties
      castleMoveProperties[Teams.White] = previousWhiteCastle;
      castleMoveProperties[Teams.Black] = previousBlackCastle;

      // Update best move
      if (!nextEval) return null;

      // Prevent AI from losing king (it thinks trading kings is an even trade but it's not how it should work)
      if (BlackKing.length === 0) continue;

      if (nextEval.score < bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = orderedMoves[i].move;
      }

      // Add to table
      if (depth === 1) {
        table[boardHash] = { ...bestMove, depth };
        tableSize++;
      }

      // Update beta
      beta = Math.min(beta, bestMove.score);
      if (beta <= alpha) break;
    }

    // Sort the moves
    // moveList.sort((a, b) => a.score - b.score);
    return bestMove;
  }
}

// Quiescence search (https://www.chessprogramming.org/Quiescence_Search)
// I called it this instead cuz who want's to spell out quiescence
// I haven't added checks yet only captures

// function searchThroughCaptures(depth: number, alpha: number, beta: number, isMax: boolean) {
//   // 1. Generate all captures
//   // 2. Make a capture move
//   // 3. Recursively call this function to search the next capture
//   // 4. Undo move
//   // 5. Update best move
//   // 6. Update alpha and beta
//   // 7. Return best move

//   if (Date.now() - startTime > maxTime) return null;
//   if (depth === 0) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

//   const { moves, captures } = generateCaptures(isMax ? Teams.White : Teams.Black);

//   const bestMove = { score: isMax ? -Infinity : Infinity, move: { from: -1, to: -1 } };

//   if (moves.length === 0) {
//     if (inStalemate(isMax ? Teams.White : Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
//     return bestMove;
//   }

//   // Base case
//   if (captures.length === 0) {
//     const score = evaluateBoard();
//     return { score, move: { from: -1, to: -1 } };
//   }

//   const orderedCaptures = orderMovesTest(captures, { from: -1, to: -1 });

//   // Maximizer
//   if (isMax) {
//     for (let i = 0; i < orderedCaptures.length; i++) {
//       const capturedPiece = board[captures[i].to];
//       const capture = orderedCaptures[i];

//       // Make move
//       makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

//       // Evaluate the next depth of captures
//       const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

//       // Undo move
//       makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

//       // Update best move
//       if (!nextEval) return null;
//       if (nextEval.score > bestMove.score) {
//         bestMove.score = nextEval.score;
//         bestMove.move = capture;
//       }

//       // Update alpha
//       alpha = Math.max(alpha, bestMove.score);
//       if (beta <= alpha) break;
//     }
//     return bestMove;
//   }

//   // Minimizer
//   else {
//     for (let i = 0; i < orderedCaptures.length; i++) {
//       const capturedPiece = board[captures[i].to];
//       const capture = orderedCaptures[i];

//       // Make move
//       makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

//       // Evaluate the next depth of captures
//       const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

//       // Undo move
//       makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

//       // Update best move
//       if (!nextEval) return null;
//       if (nextEval.score < bestMove.score) {
//         bestMove.score = nextEval.score;
//         bestMove.move = capture;
//       }

//       // Update beta
//       beta = Math.min(beta, bestMove.score);
//       if (beta <= alpha) break;
//     }
//     return bestMove;
//   }
// }

// function generateCaptures(team: Teams) {
//   const moves = getAllAvailableMovesTest(team);
//   const captures = [];
//   for (let i = 0; i < moves.length; i++) {
//     if (board[moves[i].to] || moves[i].enPassant) captures.push(moves[i]);
//   }

//   return { captures, moves };
// }
