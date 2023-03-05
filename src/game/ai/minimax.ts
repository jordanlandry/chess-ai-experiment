import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  castleWhoHasMoved,
  getKey,
  inStalemate,
  Move,
  totalNumberOfPieces,
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
let previousBestMove = { from: -1, to: -1 };

export default function getBestMoveTest(aiTeam: Teams) {
  let depth = 1;
  startTime = Date.now();

  let bestMove: Minimax = { score: 0, move: { from: -1, to: -1 } };
  while (Date.now() - startTime < maxTime) {
    table = {};
    const next = minimax(depth, -Infinity, Infinity, aiTeam === Teams.White);

    if (!next) break;

    bestMove = next;
    previousBestMove = next.move;
    depth++;
  }

  console.log("Depth: " + depth);
  return bestMove;
}

// Depth for quiescence search (don't wanna use quiscence in the name of the variable)
// Cuz stupid word
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

  // 1. Generate all possible moves
  // 2. Make each move
  // 3. Check minimax for current move
  // 4. Undo move
  // 5. Update best move
  // 6. Update alpha and beta
  // 7. Return best move

  // Null move pruning (https://www.chessprogramming.org/Null_Move_Pruning)
  if (nullMoveAllowed(isMax, depth)) {
    const nullMove = minimax(depth - 1 - nullMoveR, -alpha, -alpha + 1, true);
    if (nullMove && nullMove.score <= alpha) return nullMove;
  }

  // Maximizer
  if (isMax) {
    const boardHash = getKey();
    if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

    const bestMove = { score: -Infinity, move: { from: -1, to: -1 } };

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.White), previousBestMove);
    if (moves.length === 0) {
      if (inStalemate(Teams.White)) return { score: 0, move: { from: -1, to: -1 } };
      return bestMove;
    }

    for (let i = 0; i < moves.length; i++) {
      const { from, to, castle, enPassant, promoteTo } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];

      const previousCastleState = JSON.parse(JSON.stringify(castleWhoHasMoved));

      // Make move
      makeMove(from, to, castle, enPassant, promoteTo, true);

      // Search deeper if the move is a capture

      // Evaluate the next depth of moves
      // let nextEval;
      // if (capturedPiece && depth === 1) nextEval = searchThroughCaptures(qDepth, alpha, beta, !isMax);
      // else nextEval = minimax(depth - 1, alpha, beta, !isMax);

      // const nextEval = capturedPiece ? searchThroughCaptures(depth + 1, alpha, beta, !isMax) : minimax(depth - 1, alpha, beta, !isMax);

      const nextEval = minimax(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece);

      // Update castle state
      castleWhoHasMoved[Teams.White] = previousCastleState[Teams.White];
      castleWhoHasMoved[Teams.Black] = previousCastleState[Teams.Black];

      // Update best move
      if (!nextEval) return null;

      if (nextEval.score > bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
      }

      // If you won the game
      // If you lost the game, return the current move
      if (bestMove.score === Infinity) return { move: { from, to, castle, enPassant, promoteTo }, score: Infinity };

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

    const moves = orderMovesTest(getAllAvailableMovesTest(Teams.Black), previousBestMove);
    if (moves.length === 0) {
      if (inStalemate(Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
      return bestMove;
    }

    for (let i = 0; i < moves.length; i++) {
      const { from, to, castle, enPassant, promoteTo } = moves[i];

      // Save the piece that is being captured (if any)
      const capturedPiece = board[to];
      const previousCastleState = JSON.parse(JSON.stringify(castleWhoHasMoved));

      // Make move
      makeMove(from, to, castle, enPassant, promoteTo, true);

      // Evaluate the next depth of moves
      // let nextEval;
      // if (capturedPiece && depth === 1) nextEval = searchThroughCaptures(qDepth, alpha, beta, !isMax);
      // else nextEval = minimax(depth - 1, alpha, beta, !isMax);

      const nextEval = minimax(depth - 1, alpha, beta, !isMax);

      // const nextEval = capturedPiece ? searchThroughCaptures(depth + 1, alpha, beta, !isMax) : minimax(depth - 1, alpha, beta, !isMax);
      // minimax(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece);

      // Update castle properties
      castleWhoHasMoved[Teams.White] = previousCastleState[Teams.White];
      castleWhoHasMoved[Teams.Black] = previousCastleState[Teams.Black];

      // Update best move
      if (!nextEval) return null;
      if (nextEval.score < bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = moves[i];
      }

      // If you lost the game, return the current move
      if (bestMove.score === -Infinity) return { move: { from, to, castle, enPassant, promoteTo }, score: -Infinity };

      // If you won the game
      // if (bestMove.score === -Infinity) return bestMove;

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

// Quiescence search (https://www.chessprogramming.org/Quiescence_Search)
// I called it this instead cuz who want's to spell out quiescence
// I haven't added checks yet only captures

function searchThroughCaptures(depth: number, alpha: number, beta: number, isMax: boolean) {
  // 1. Generate all captures
  // 2. Make a capture move
  // 3. Recursively call this function to search the next capture
  // 4. Undo move
  // 5. Update best move
  // 6. Update alpha and beta
  // 7. Return best move

  if (Date.now() - startTime > maxTime) return null;
  if (depth === 0) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

  const { moves, captures } = generateCaptures(isMax ? Teams.White : Teams.Black);

  const bestMove = { score: isMax ? -Infinity : Infinity, move: { from: -1, to: -1 } };

  if (moves.length === 0) {
    if (inStalemate(isMax ? Teams.White : Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
    return bestMove;
  }

  // Base case
  if (captures.length === 0) {
    const score = evaluateBoard();
    return { score, move: { from: -1, to: -1 } };
  }

  const orderedCaptures = orderMovesTest(captures, { from: -1, to: -1 });

  // Maximizer
  if (isMax) {
    for (let i = 0; i < orderedCaptures.length; i++) {
      const capturedPiece = board[captures[i].to];
      const capture = orderedCaptures[i];

      // Make move
      makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

      // Evaluate the next depth of captures
      const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;
      if (nextEval.score > bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = capture;
      }

      // Update alpha
      alpha = Math.max(alpha, bestMove.score);
      if (beta <= alpha) break;
    }
    return bestMove;
  }

  // Minimizer
  else {
    for (let i = 0; i < orderedCaptures.length; i++) {
      const capturedPiece = board[captures[i].to];
      const capture = orderedCaptures[i];

      // Make move
      makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

      // Evaluate the next depth of captures
      const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

      // Undo move
      makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

      // Update best move
      if (!nextEval) return null;
      if (nextEval.score < bestMove.score) {
        bestMove.score = nextEval.score;
        bestMove.move = capture;
      }

      // Update beta
      beta = Math.min(beta, bestMove.score);
      if (beta <= alpha) break;
    }
    return bestMove;
  }
}

function generateCaptures(team: Teams) {
  const moves = getAllAvailableMovesTest(team);
  const captures = [];
  for (let i = 0; i < moves.length; i++) {
    if (board[moves[i].to] || moves[i].enPassant) captures.push(moves[i]);
  }

  return { captures, moves };
}
