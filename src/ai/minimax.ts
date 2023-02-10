import getAvailableMoves from "../helpers/getAvailableMoves";
import sameTeam from "../helpers/sameTeam";
import properties, { KeyStringObject } from "../properties";
import orderMoves from "./orderMoves";


export let checks = 0;
export let elapsedTime = 0;

let whitePawnCount = 0;
let whiteRookCount = 0;
let whiteBishopCount = 0;
let whiteKnightCount = 0;
let whiteQueenCount = 0;
let whiteKingCount = 0;

let blackRookCount = 0;
let blackPawnCount = 0;
let blackBishopCount = 0;
let blackKnightCount = 0;
let blackQueenCount = 0;
let blackKingCount = 0;

function updateAllCounts(board: number[][]) {
  whitePawnCount = 0;
  whiteRookCount = 0;
  whiteBishopCount = 0;
  whiteKnightCount = 0;
  whiteQueenCount = 0;
  whiteKingCount = 0;

  blackRookCount = 0;
  blackPawnCount = 0;
  blackBishopCount = 0;
  blackKnightCount = 0;
  blackQueenCount = 0;
  blackKingCount = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      updateCount(board[i][j]);
    }
  }
}

// Takes a piece that was taken and updates the count of that piece
function updateCount(piece: number, undo = false) {
  if (piece === -1) return;

  let value = undo ? -1 : 1;

  if (piece === 0 || piece === 7) blackRookCount += value;
  else if (piece === 1 || piece === 5) blackKnightCount += value;
  else if (piece === 2 || piece === 6) blackBishopCount += value;
  else if (piece === 3) blackQueenCount += value;
  else if (piece === 4) blackKingCount += value;
  else if (piece >= 8 && piece <= 15) blackPawnCount += value;

  else if (piece === 56 || piece === 63) whiteRookCount += value;
  else if (piece === 57 || piece === 61) whiteKnightCount += value;
  else if (piece === 58 || piece === 62) whiteBishopCount += value;
  else if (piece === 59) whiteQueenCount += value;
  else if (piece === 60) whiteKingCount += value;
  else if (piece >= 48 && piece <= 55) whitePawnCount += value;
}

let startTime = 0;
let maxTime = 0;
export default function getBestMove(board: number[][], aiMax: boolean, setMaxTimeS: number) {
  maxTime = setMaxTimeS * 1000;
  updateAllCounts(board);
  const start = Date.now();
  startTime = start;

  checks = 0;
  let depth = 1;
  let bestMove: any = null;
  while (Date.now() - start < maxTime) {
    checks++;
    transpositionTable = {};
    const currentBestMove = minimax(board, depth, -Infinity, Infinity, true);

    if (currentBestMove) bestMove = currentBestMove;
    depth++;
  }

  console.log("Depth: " + (depth - 1));
  return bestMove;
}

function evaluateBoard(board: number[][]) {
  let score = 0;

  score += whitePawnCount;
  score += whiteRookCount * 5;
  score += whiteBishopCount * 3;
  score += whiteKnightCount * 3;
  score += whiteQueenCount * 9;
  score += whiteKingCount * 100;

  score -= blackPawnCount;
  score -= blackRookCount * 5;
  score -= blackBishopCount * 3;
  score -= blackKnightCount * 3;
  score -= blackQueenCount * 9;
  score -= blackKingCount * 100;
  
  return score;
}

const MAX_TRANSPOSITION_TABLE_SIZE = 128_000;
let transpositionTable: KeyStringObject = {};

let currentTime = 0;
function minimax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean) {
  // if (Object.keys(transpositionTable).length > MAX_TRANSPOSITION_TABLE_SIZE) transpositionTable = {}

  currentTime = Date.now() - startTime;
  
  checks++;
  let bestMove = {
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
    piece: -1,
    score: 0,
  };

  // if (transpositionTable[board.toString()] && transpositionTable[board.toString()].isMaximizing === isMaximizing) {
  //   return transpositionTable[board.toString()];
  // }

  // End of search
  if (depth === 0) {
    bestMove.score = evaluateBoard(board);
    transpositionTable[board.toString()] = {...bestMove, isMaximizing};
    return bestMove;
  }

  // Time limit reached
  if (currentTime > maxTime) {
    bestMove.score = evaluateBoard(board);
    return bestMove;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    // Go through all available moves
    const moves = orderMoves(board, getAllMoves(board, false));

    for (let i = 0; i < moves.length; i++)  {
      const move = moves[i];
      
      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Update the counts
      updateCount(newBoard[move.to.y][move.to.x]);

      // Make the move
      newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
      newBoard[move.from.y][move.from.x] = -1;

      // Get the score
      const score = minimax(newBoard, depth - 1, alpha, beta, false);

      // Undo the move
      newBoard[move.from.y][move.from.x] = newBoard[move.to.y][move.to.x];
      newBoard[move.to.y][move.to.x] = board[move.to.y][move.to.x];

      // Undo the counts
      updateCount(newBoard[move.to.y][move.to.x], true);

      // Update the best move
      if (score.score > bestScore) {
        bestScore = score.score;
        bestMove = {...move, score: bestScore};
      }

      // Update alpha
      alpha = Math.max(alpha, bestScore);

      // If beta is less than alpha, we can prune
      if (beta <= alpha) return bestMove;
    };
  }

  if (!isMaximizing) {
    let bestScore = Infinity;

    // Go through all available moves
    const moves = orderMoves(board, getAllMoves(board, true));

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      
      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Update the counts
      updateCount(newBoard[move.to.y][move.to.x]);

      // Make the move
      newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
      newBoard[move.from.y][move.from.x] = -1;

      // Get the score
      const score = minimax(newBoard, depth - 1, alpha, beta, true);

      // Undo the move
      newBoard[move.from.y][move.from.x] = newBoard[move.to.y][move.to.x];
      newBoard[move.to.y][move.to.x] = board[move.to.y][move.to.x];

      // Undo the score
      updateCount(newBoard[move.to.y][move.to.x], true);
      
      // Update the best move
      if (score.score < bestScore) {
        bestScore = score.score;
        bestMove = {...move, score: bestScore};
      }

      // Update beta
      beta = Math.min(beta, bestScore);

      // If beta is less than alpha, we can prune
      if (beta <= alpha) return bestMove;
    };
  }

  return bestMove;
}

function getAllMoves(board: number[][], isMax: boolean) {
  let moves: any= [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {

      if (board[i][j] === -1) continue;

      // If the piece is not the same color as the chosen player skip it
      if (sameTeam(board[i][j], isMax ? 0 : 63)) continue;

      let availableMoves = getAvailableMoves(board, j, i);

      availableMoves.forEach((move) => {
        moves.push({
          from: { x: j, y: i },
          to: move,
          piece: board[i][j],
        });
      });
    }
  }

  return moves;
}

