import { baseMinimaxResults, MinimaxProps, MinimaxReturn, Moves, PiecesType, PieceType, Teams, times } from "../../properties";
import getAvailableMoves from "../getAvailableMoves";
import orderMoves from "./orderMoves";

const pieceValues = {
  [PiecesType.Pawn]: 1,
  [PiecesType.Knight]: 3,
  [PiecesType.Bishop]: 3,
  [PiecesType.Rook]: 5,
  [PiecesType.Queen]: 9,
  [PiecesType.King]: 1000,
} as { [key: string]: number };

let minimaxResults = { ...baseMinimaxResults };
let calculations = 0;

let transpositionTable: { [key: string]: MinimaxReturn } = {};
const MAX_TRANSPOSITION_TABLE_SIZE = 256_000;

const piecesCount = {
  minimizingPlayer: {
    [PiecesType.Pawn]: 8,
    [PiecesType.Knight]: 2,
    [PiecesType.Bishop]: 2,
    [PiecesType.Rook]: 2,
    [PiecesType.Queen]: 1,
    [PiecesType.King]: 1,
  } as { [key: string]: number },

  maximizingPlayer: {
    [PiecesType.Pawn]: 8,
    [PiecesType.Knight]: 2,
    [PiecesType.Bishop]: 2,
    [PiecesType.Rook]: 2,
    [PiecesType.Queen]: 1,
    [PiecesType.King]: 1,
  } as { [key: string]: number },
};

function getPieceCounts(board: PieceType[][]) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].piece === PiecesType.None) continue;

      if (board[i][j].color === Teams.White) piecesCount.maximizingPlayer[board[i][j].piece]--;
      else piecesCount.minimizingPlayer[board[i][j].piece]--;
    }
  }
}

// This so we can have a constant update so we don't have to do .length as it would be slow
let transpositionTableSize = 0;

function reset(board: PieceType[][]) {
  calculations = 0;
  minimaxResults = { ...baseMinimaxResults };

  // Reset the times
  Object.keys(times).forEach((key) => {
    times[key] = 0;
  });

  // Object.keys(times, ((key) => {
  //   times[key] = 0;
  // }));

  // times.evaluatingBoard = 0;
  // times.gettingMoves = 0;
  // times.boardCopy = 0;
  // times.makingMove = 0;
  // times.undoingMove = 0;

  transpositionTable = {};
  transpositionTableSize = 0;

  getPieceCounts(board);
}

// White is maximizing, black is minimizing
export default function getBestMove(board: PieceType[][], props: MinimaxProps) {
  reset(board);
  const initialTime = Date.now();
  const bestMove = minimax(board, props.maxDepth, false, -Infinity, Infinity, props);
  const endTime = Date.now();

  minimaxResults = { ...bestMove, time: endTime - initialTime };
  return minimaxResults;
}

function evaluateBoard(board: PieceType[][]) {
  let score = 0;

  const initialTime = Date.now();

  Object.keys(piecesCount.maximizingPlayer).forEach((piece) => {
    score += piecesCount.maximizingPlayer[piece] * pieceValues[piece];
  });

  Object.keys(piecesCount.minimizingPlayer).forEach((piece) => {
    score -= piecesCount.minimizingPlayer[piece] * pieceValues[piece];
  });

  // for (let i = 0; i < 8; i++) {
  //   for (let j = 0; j < 8; j++) {
  //     if (board[i][j].piece === PiecesType.None) continue;

  //     if (board[i][j].color === Teams.White) score += pieceValues[board[i][j].piece];
  //     else score -= pieceValues[board[i][j].piece];
  //   }
  // }

  const endTime = Date.now();
  times.evaluatingBoard += endTime - initialTime;

  return score;
}

const nullMove = { ...baseMinimaxResults };
// I need to keep a constant position of each pieces so that I don't need to search for them
// every time I evaluate the board, as it will slow it down a lot

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function minimax(board: PieceType[][], depth: number, isMaximizing: boolean, alpha: number, beta: number, props: MinimaxProps) {
  if (transpositionTableSize > MAX_TRANSPOSITION_TABLE_SIZE) {
    transpositionTable = {};
    transpositionTableSize = 0;
  }

  const boardKey = boardToKey(board, isMaximizing);
  const transpositionTableResult = transpositionTable[boardKey];
  if (transpositionTableResult) {
    return transpositionTableResult;
  }

  const bestMove = { ...nullMove, score: isMaximizing ? -Infinity : Infinity };

  calculations++;

  if (depth === 0) {
    minimaxResults.count++;
    return {
      ...nullMove,
      score: evaluateBoard(board),
    };
  }

  // Copy the board
  const boardCopyTime = Date.now();
  const newBoard = board.map((row) => row.slice());
  if (depth === 0) {
    return { ...bestMove, score: evaluateBoard(board) };
  }

  const getMovesTime = Date.now();
  const allMoves = getAllMoves(board, isMaximizing);
  times.gettingMoves += Date.now() - getMovesTime;

  const orderingMoveTime = Date.now();
  const orderedMoves = props.doMoveOrdering ? orderMoves(newBoard, allMoves, isMaximizing) : allMoves;
  times.orderingMoves += Date.now() - orderingMoveTime;

  // Maximizing player
  if (isMaximizing) {
    times.boardCopy += Date.now() - boardCopyTime;

    for (const move of orderedMoves) {
      // Update the count of each piece
      makePieceCountUpdate(board, move);

      // Make the move
      const makeMoveTime = Date.now();
      makeMove(newBoard, move);
      times.makingMove += Date.now() - makeMoveTime;

      // Get score with the new board
      const score = minimax(newBoard, depth - 1, false, alpha, beta, props).score;

      // Undo move
      const undoMoveTime = Date.now();
      undoMove(board, newBoard, move);
      times.undoingMove += Date.now() - undoMoveTime;

      undoPieceCountUpdate(newBoard, move);

      // Update best move
      if (score > bestMove.score) {
        bestMove.score = score;
        bestMove.move = move;
        bestMove.count = calculations;
      }

      // Add to transposition table if it's the last call
      if (props.doTranspositionTable) {
        transpositionTable[boardKey] = { ...bestMove };
        transpositionTableSize++;
      }

      // Update alpha
      if (props.doAlphaBeta) {
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
    }
  }

  // Minimizing player
  else {
    for (const move of orderedMoves) {
      // Update the count of each piece
      makePieceCountUpdate(board, move);

      // Make the move
      const initialTime1 = Date.now();
      newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
      newBoard[move.from.y][move.from.x] = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
      times.makingMove += Date.now() - initialTime1;

      // Get score with the new board
      const score = minimax(newBoard, depth - 1, true, alpha, beta, props).score;

      // Undo move
      const initialTime2 = Date.now();
      undoMove(board, newBoard, move);
      times.undoingMove += Date.now() - initialTime2;

      undoPieceCountUpdate(newBoard, move);

      if (score < bestMove.score) {
        bestMove.score = score;
        bestMove.move = move;
        bestMove.count = calculations;
      }

      // Add to transposition table if it's the last call
      if (props.doTranspositionTable) {
        transpositionTable[boardKey] = { ...bestMove };
        transpositionTableSize++;
      }

      if (props.doAlphaBeta) {
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
    }
  }

  return bestMove;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getAllMoves(board: PieceType[][], isMaximizing: boolean) {
  const moves = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x].piece === PiecesType.None) continue;

      if (board[y][x].color === Teams.White && isMaximizing) moves.push(...getAvailableMoves(board, { y, x }, Teams.White));
      if (board[y][x].color === Teams.Black && !isMaximizing) moves.push(...getAvailableMoves(board, { y, x }, Teams.Black));
    }
  }

  return moves;
}

function makePieceCountUpdate(board: PieceType[][], move: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const { piece, color } = board[move.to.y][move.to.x];
  if (piece === PiecesType.None) return;

  if (color === Teams.White) piecesCount.maximizingPlayer[piece]--;
  else if (color === Teams.Black) piecesCount.minimizingPlayer[piece]--;
}

function undoPieceCountUpdate(board: PieceType[][], move: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const { piece, color } = board[move.to.y][move.to.x];
  if (piece === PiecesType.None) return;

  if (color === Teams.White) piecesCount.maximizingPlayer[piece]++;
  else if (color === Teams.Black) piecesCount.minimizingPlayer[piece]++;
}

function makeMove(board: PieceType[][], move: { from: { y: number; x: number }; to: { y: number; x: number } }) {
  board[move.to.y][move.to.x] = board[move.from.y][move.from.x];
  board[move.from.y][move.from.x] = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
}

function undoMove(board: PieceType[][], newBoard: PieceType[][], move: { from: { y: number; x: number }; to: { y: number; x: number } }) {
  newBoard[move.from.y][move.from.x] = newBoard[move.to.y][move.to.x];
  newBoard[move.to.y][move.to.x] = board[move.to.y][move.to.x];
}

// After lots of testing, I found that having a map of random is the fastest way of calculating the keys
// This is to generate a unique key for each board so we can store it in the transposition table
// This is much faster than converting the whole board array into a string and using that as the key
// And faster than using 1-64 as the keys
const map = [
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
];

function boardToKey(board: PieceType[][], isMaximizing: boolean) {
  let key = 1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      key += (board[i][j].id + 1) * map[i][j];
    }
  }

  key *= isMaximizing ? 1 : -1;

  return key + "";
}

// ~33ms for 500,000 calculations (on my machine results may vary)
function testBoardKeySpeeds(board: PieceType[][]) {
  const initialTime = Date.now();
  for (let i = 0; i < 500_000; i++) {
    const key = boardToKey(board, true);
  }

  console.log(Date.now() - initialTime + "ms");
}

function testBoardCopySpeeds(board: PieceType[][]) {
  // Test
  let startTime = Date.now();
  for (let i = 0; i < 100_000; i++) {
    const newBoard = board.map((row) => row.map((piece) => ({ ...piece })));
  }

  console.log(Date.now() - startTime + "ms");

  startTime = Date.now();
  for (let i = 0; i < 100_000; i++) {
    const newBoard = JSON.parse(JSON.stringify(board));
  }

  console.log(Date.now() - startTime + "ms");

  startTime = Date.now();
  for (let i = 0; i < 100_000; i++) {
    const newBoard = Array.from(board, (arr) => arr.slice());
  }

  console.log(Date.now() - startTime + "ms");

  startTime = Date.now();
  for (let i = 0; i < 100_000; i++) {
    const newBoard = board.map((row) => row.slice());
  }

  console.log(Date.now() - startTime + "ms");

  startTime = Date.now();
  for (let i = 0; i < 100_000; i++) {
    const newArray = Array.from(board, (arr) => Array.from(arr));
  }

  console.log(Date.now() - startTime + "ms");
}
