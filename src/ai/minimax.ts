import getAvailableMoves from "../helpers/getAvailableMoves";
import sameTeam from "../helpers/sameTeam";
import properties, { KeyStringObject } from "../properties";

interface MinimaxMove {
  from: { x: number; y: number };
  to: { x: number; y: number };
  score: number;
}

export default function getBestMove(board: number[][], aiMax: boolean, maxTime: number) {
  // const allMoves = getAllMoves(board, !aiMax);
  

  // const bestMove = Math.floor(Math.random() * allMoves.length);
  // return allMoves[bestMove];

  const bestMove = minimax(board, 4, -Infinity, Infinity, aiMax);
  // console.log(bestMove);
  return bestMove;

  // return minimax(board, 2, -Infinity, Infinity, aiMax);
}

const values: KeyStringObject = {
  'p': 1,
  'P': -1,
  'n': 3,
  'N': -3,
  'b': 3,
  'B': -3,
  'r': 5,
  'R': -5,
  'q': 9,
  'Q': -9,
  'k': 100,
  'K': -100,
}

function evaluateBoard(board: number[][]) {
  let score = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === -1) continue;

      score += values[properties.numToPiece[board[i][j]]];
    }
  }

  return score;
}

function minimax(board: number[][], depth: number, alpha: number, beta: number, isMaximizing: boolean) {
  let bestMove = {
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
    piece: -1,
    score: 0,
  };

  if (depth === 0) {
    bestMove.score = evaluateBoard(board);
    return bestMove;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    // Go through all available moves
    const moves = getAllMoves(board, false);
    moves.forEach((move: any) => {
      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
      newBoard[move.from.y][move.from.x] = -1;

      // Get the score
      const score = minimax(newBoard, depth - 1, alpha, beta, false);

      // Update the best move
      if (score.score > bestScore) {
        bestScore = score.score;
        bestMove = {...move, score: bestScore};
      }

      // Update alpha
      alpha = Math.max(alpha, bestMove.score);

      // If beta is less than alpha, we can prune
      if (beta <= alpha) return;
    });
  }

  if (!isMaximizing) {
    let bestScore = Infinity;

    // Go through all available moves
    const moves = getAllMoves(board, true);
    moves.forEach((move: any) => {
      // Copy the board
      const newBoard = board.map((row) => [...row]);

      // Make the move
      newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
      newBoard[move.from.y][move.from.x] = -1;

      // Get the score
      const score = minimax(newBoard, depth - 1, alpha, beta, true);
      
      // Update the best move
      if (score.score < bestScore) {
        bestScore = score.score;
        bestMove = {...move, score: bestScore};
      }

      // Update beta
      beta = Math.min(beta, bestMove.score);

      // If beta is less than alpha, we can prune
      if (beta <= alpha) return;
    });
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

