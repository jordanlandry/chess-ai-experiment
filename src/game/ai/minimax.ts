import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  getZobristKey,
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

let table = {} as { [key: string]: number };

let startTime = 0;
export default function getBestMoveTest(aiTeam: Teams) {
  table = {};

  let depth = 1;
  startTime = Date.now();

  let bestMove = { score: 0, move: { from: -1, to: -1 } };
  while (Date.now() - startTime < 2500) {
    [];
    const next = minimax(depth, -Infinity, Infinity, aiTeam === Teams.White);

    if (!next) break;

    bestMove = next;
    depth++;
  }

  console.log("Depth: " + depth);
  return bestMove;
}

function minimax(depth: number, alpha: number, beta: number, isMax: boolean) {
  if (depth === 0) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

  if (Date.now() - startTime > 1000) return null;

  // 1. Generate all possible moves
  // 2. Make each move
  // 3. Check minimax for current move
  // 4. Undo move
  // 5. Update best move
  // 6. Update alpha and beta
  // 7. Return best move][]

  // Maximizer
  if (isMax) {
    // const boardHash = getZobristKey();
    // if (table[boardHash]) return table[boardHash];

    const bestMove = { score: -Infinity, move: { from: -1, to: -1 } };

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.White));
    for (let i = 0; i < moves.length; i++) {
      const { from, to } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      // Make move
      makeMove(from, to, true);

      // Evaluate the next depth of moves
      const nextEval = minimax(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(to, from, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;

      if (nextEval.score > bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
      }

      // Add to table
      // if (depth === 1) table[boardHash] = bestScore;

      // Update alpha
      alpha = Math.max(alpha, bestMove.score);
      if (beta <= alpha) break;
    }
    return bestMove;
  }

  // Minimizer
  else {
    // const boardHash = getZobristKey();
    // if (table[boardHash]) return table[boardHash];

    let bestMove = { score: Infinity, move: { from: -1, to: -1 } };

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.Black));

    for (let i = 0; i < moves.length; i++) {
      const { from, to } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      // Make move
      makeMove(from, to, true);

      // Evaluate the next depth of moves
      const nextEval = minimax(depth - 1, alpha, beta, !isMax);
      // Undo move
      makeMove(to, from, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;
      if (nextEval.score < bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
      }

      // Add to table
      // if (depth === 1) table[boardHash] = bestScore;

      // Update beta
      beta = Math.min(beta, bestMove.score);
      if (beta <= alpha) break;
    }
    return bestMove;
  }
}
