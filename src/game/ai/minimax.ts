import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  calcXY,
  getKey,
  lookupArrayXY,
  lookupObjectXY,
  // getZobristKey,
  Move,
  WhiteBishops,
  WhiteKing,
  WhiteKnights,
  WhitePawns,
  WhiteQueens,
  WhiteRooks,
} from "../../board";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";
import { getAllAvailableMovesTest } from "../getAvailableMoves";
import orderMovesTest from "./orderMoves";

interface Minimax {
  score: number;
  move: Move;
}

function evaluateBoard() {
  let score = 0;

  // White Team
  score += WhitePawns.length * 10;
  score += WhiteRooks.length * 50;
  score += WhiteKnights.length * 30;
  score += WhiteBishops.length * 30;
  score += WhiteQueens.length * 90;
  score += WhiteKing.length * 900;

  // Black Team
  score -= BlackPawns.length * 10;
  score -= BlackRooks.length * 50;
  score -= BlackKnights.length * 30;
  score -= BlackBishops.length * 30;
  score -= BlackQueens.length * 90;
  score -= BlackKing.length * 900;

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
export default function getBestMoveTest(aiTeam: Teams) {
  let depth = 1;
  startTime = Date.now();

  // const idx = Math.floor(Math.random() * 64);
  // testFunctionSpeed(() => calcXY(idx), "calculation");
  // testFunctionSpeed(() => lookupObjectXY(idx), "lookup");
  // testFunctionSpeed(() => lookupArrayXY(idx), "Array lookup");

  let bestMove: Minimax = { score: 0, move: { from: -1, to: -1 } };

  // return bestMove;

  while (Date.now() - startTime < maxTime) {
    table = {};
    const next = minimax(depth, -Infinity, Infinity, aiTeam === Teams.White);

    if (!next) break;

    bestMove = next;
    depth++;
  }

  console.log("Depth: " + depth);
  return bestMove;
}

function minimax(depth: number, alpha: number, beta: number, isMax: boolean): Minimax | null {
  if (depth === 0) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

  if (tableSize > MAX_TABLE_SIZE) {
    table = {};
    tableSize = 0;
  }

  if (Date.now() - startTime > maxTime) return null;

  // 1. Generate all possible moves
  // 2. Make each move
  // 3. Check minimax for current move
  // 4. Undo move
  // 5. Update best move
  // 6. Update alpha and beta
  // 7. Return best move

  // Maximizer
  if (isMax) {
    const boardHash = getKey();
    if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

    const bestMove = { score: -Infinity, move: { from: -1, to: -1 } };

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.White));
    for (let i = 0; i < moves.length; i++) {
      const { from, to, castle, enPassant } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      // Make move
      makeMove(from, to, castle, enPassant, true);

      // Evaluate the next depth of moves
      const nextEval = minimax(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(to, from, castle, enPassant, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;

      if (nextEval.score > bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
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
    const boardHash = getKey() * -1;
    if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

    let bestMove = { score: Infinity, move: { from: -1, to: -1 } };

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.Black));

    for (let i = 0; i < moves.length; i++) {
      const { from, to, castle, enPassant } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      // Make move
      makeMove(from, to, castle, enPassant, true);

      // Evaluate the next depth of moves
      const nextEval = minimax(depth - 1, alpha, beta, !isMax);
      // Undo move
      makeMove(to, from, castle, enPassant, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;
      if (nextEval.score < bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
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
    return bestMove;
  }
}
function test1(arg0: number) {
  throw new Error("Function not implemented.");
}
