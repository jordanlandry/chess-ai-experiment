import {
  baseMinimaxResults,
  blankPiece,
  boardToKey,
  kingPositions,
  map,
  MinimaxProps,
  MinimaxReturn,
  Moves,
  PiecesType,
  PieceType,
  Teams,
  times,
} from "../../properties";
import getAvailableMoves, { squareUnderAttack } from "../getAvailableMoves";
import { earlyGamePositions } from "./db/piecePositionValues";
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
const MAX_TRANSPOSITION_TABLE_SIZE = 512_000;

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

  transpositionTable = {};
  transpositionTableSize = 0;

  getPieceCounts(board);
}

// White is maximizing, black is minimizing
let initialTime = 0;
const nullMove = { ...baseMinimaxResults };

const prevBestMoves: Moves[] = [];
export default function getBestMove(board: PieceType[][], props: MinimaxProps) {
  reset(board);
  initialTime = Date.now();
  let bestMove: MinimaxReturn = { ...nullMove };

  // Deepen the search until we reach the max time
  let depth = 1;
  if (props.useTimeLimit) {
    while (Date.now() - initialTime < props.maxTime) {
      const newBestMove = minimax(board, depth, false, -Infinity, Infinity, { ...nullMove }, props);
      if (!newBestMove || newBestMove.move.from.x === -1) break;

      if (newBestMove.score === Infinity || newBestMove.score === -Infinity) {
        bestMove = newBestMove;
        break;
      }

      // Reset the transposition table every iteration
      transpositionTable = {};

      bestMove = newBestMove;
      prevBestMoves.push(bestMove.move);

      depth++;
    }
  }

  // We don't use a time limit so we just use a set max depth
  else {
    props.maxTime = Infinity;
    bestMove = minimax(board, props.maxDepth, false, -Infinity, Infinity, { ...nullMove }, props)!;
    depth = props.maxDepth;
  }

  // const bestMove = minimax(board, props.maxDepth, false, -Infinity, Infinity, props);
  const endTime = Date.now();

  console.log(`Depth: ${depth}`);

  minimaxResults = { ...bestMove, time: endTime - initialTime };
  return minimaxResults;
}

function evaluateBoard(board: PieceType[][], moves: Moves[], isMax: boolean) {
  if (moves.length === 0) {
    if (inStaleMate(board, isMax)) return 0;
    else return isMax ? -Infinity : Infinity;
  }

  let score = 0;

  const initialTime = Date.now();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].piece === PiecesType.None) continue;

      // ~~~ Piece values ~~~ \\
      if (board[i][j].color === Teams.White) score += pieceValues[board[i][j].piece];
      else score -= pieceValues[board[i][j].piece];

      // ~~~ Positional scoring ~~~ \\
      if (board[i][j].color === Teams.White) score += earlyGamePositions.white[board[i][j].piece][i][j] / 200;
      else score -= earlyGamePositions.black[board[i][j].piece][i][j] / 200;

      // Discourage doubled pawns
      if (board[i][j].piece === PiecesType.Pawn) {
        if (board[i][j].color === Teams.White) {
          if (i < 7 && board[i + 1][j].piece === PiecesType.Pawn && board[i + 1][j].color === Teams.White) score -= 0.5;
          if (i > 0 && board[i - 1][j].piece === PiecesType.Pawn && board[i - 1][j].color === Teams.White) score -= 0.5;
        }

        // Team is black
        else {
          if (i < 7 && board[i + 1][j].piece === PiecesType.Pawn && board[i + 1][j].color === Teams.Black) score += 0.5;
          if (i > 0 && board[i - 1][j].piece === PiecesType.Pawn && board[i - 1][j].color === Teams.Black) score += 0.5;
        }
      }
    }
  }

  const endTime = Date.now();
  times.evaluatingBoard += endTime - initialTime;

  return score;
}

// I need to keep a constant position of each pieces so that I don't need to search for them
// every time I evaluate the board, as it will slow it down a lot

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function minimax(
  board: PieceType[][],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  currentBestMove: MinimaxReturn,
  props: MinimaxProps
): MinimaxReturn | null {
  if (transpositionTableSize > MAX_TRANSPOSITION_TABLE_SIZE) {
    transpositionTable = {};
    transpositionTableSize = 0;
  }

  // If the time limit has been reached, return a null move
  if (Date.now() - initialTime > props.maxTime) {
    return null;
  }

  // If board has been evaluated before
  const boardHash = boardToKey(board, isMaximizing);
  const transpositionTableResult = transpositionTable[boardHash];
  if (transpositionTableResult) {
    return { ...transpositionTableResult, count: calculations };
  }

  const bestMove = { ...nullMove, score: isMaximizing ? -Infinity : Infinity };

  calculations++;

  // If we have reached the end of the search, return the evaluation of the board
  // Copy the board
  const boardCopyTime = Date.now();
  const newBoard = board.map((row) => row.slice());

  const getMovesTime = Date.now();
  const allMoves = getAllMoves(board, isMaximizing);
  times.gettingMoves += Date.now() - getMovesTime;

  if (depth <= 0) {
    minimaxResults.count++;
    return { ...nullMove, score: evaluateBoard(board, allMoves, isMaximizing) };
  }

  // Null move pruning
  if (props.doNullMove) {
    if (!isMaximizing && depth >= 3) {
      const newBoard = [...board];
      const nextMove = minimax(newBoard, depth - 3, true, -beta, -beta + 1, currentBestMove, props);

      if (nextMove && nextMove.score >= beta) return { ...nullMove, score: Infinity };
    }
  }

  const orderingMoveTime = Date.now();
  const orderedMoves = props.doMoveOrdering ? orderMoves(newBoard, allMoves, prevBestMoves, isMaximizing) : allMoves;
  times.orderingMoves += Date.now() - orderingMoveTime;

  // If in checkmate
  if (currentBestMove.score === -Infinity || currentBestMove.score === Infinity) return currentBestMove;

  if (allMoves.length === 0) {
    if (inStaleMate(newBoard, isMaximizing)) return { ...currentBestMove, score: 0 };

    currentBestMove.score = isMaximizing ? -Infinity : Infinity;
    return currentBestMove;
  }

  // Maximizing player
  if (isMaximizing) {
    times.boardCopy += Date.now() - boardCopyTime;

    for (let i = 0; i < orderedMoves.length; i++) {
      const move = orderedMoves[i];

      // Update the count of each piece
      // makePieceCountUpdate(board, move);

      // Make the move
      const makeMoveTime = Date.now();
      makeMove(newBoard, move);
      times.makingMove += Date.now() - makeMoveTime;

      // Get score with the new board
      const nextMove = minimax(newBoard, depth - 1, false, alpha, beta, currentBestMove, props);

      if (!nextMove) return null;

      const score = nextMove.score;

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

        currentBestMove = { ...bestMove };
      }

      // Add to transposition table if it's the last call
      if (props.doTranspositionTable && depth === 1) {
        transpositionTable[boardHash] = { ...bestMove };
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
    for (let i = 0; i < orderedMoves.length; i++) {
      const move = orderedMoves[i];

      // Update the count of each piece
      // makePieceCountUpdate(board, move);

      // Make the move
      const initialTime1 = Date.now();
      makeMove(newBoard, move);
      times.makingMove += Date.now() - initialTime1;

      // Get score with the new board
      const nextMove = minimax(newBoard, depth - 1, true, alpha, beta, currentBestMove, props);
      if (!nextMove) return null;

      const score = nextMove.score;

      // Undo move
      const initialTime2 = Date.now();
      undoMove(board, newBoard, move);
      times.undoingMove += Date.now() - initialTime2;

      undoPieceCountUpdate(newBoard, move);

      if (score < bestMove.score) {
        bestMove.score = score;
        bestMove.move = move;
        bestMove.count = calculations;

        currentBestMove = { ...bestMove };
      }

      // Add to transposition table if it's the last call
      if (props.doTranspositionTable && depth === 1) {
        transpositionTable[boardHash] = { ...bestMove };
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
function inStaleMate(board: PieceType[][], isMaximizing: boolean) {
  // Find the king
  let kingX = -1;
  let kingY = -1;
  if (isMaximizing) {
    kingX = kingPositions[Teams.White].x;
    kingY = kingPositions[Teams.White].y;
  } else {
    kingX = kingPositions[Teams.Black].x;
    kingY = kingPositions[Teams.Black].y;
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x].piece === PiecesType.King && board[y][x].color === (isMaximizing ? Teams.White : Teams.Black)) {
        kingX = x;
        kingY = y;
        break;
      }
    }
  }

  // Check if the king is in check
  if (squareUnderAttack(board, { x: kingX, y: kingY })) return false;

  // Don't need to check if the king can move, cuz this will only get called if there are no legal moves
  return true;
}

function handlePromote(newBoard: PieceType[][], oldBoard: PieceType[][], move: Moves, undo: boolean) {
  if (undo) {
    newBoard[move.from.y][move.from.x].piece = PiecesType.Pawn;
    newBoard = oldBoard.map((row) => row.slice());
  } else {
    newBoard[move.to.y][move.to.x] = { ...move.piece, piece: move.promotionPiece! };
    newBoard[move.from.y][move.from.x] = { ...move.piece, piece: PiecesType.None, color: Teams.None };
  }

  if (move.to.y === 7 && !undo) {
  }
}

function handleEnPassant(board: PieceType[][], move: Moves, undo: boolean) {
  // Re-put the pawn that was captured by en passant
  if (undo) {
    if (move.to.y === 5 && move.to.x !== move.from.x) {
      board[move.to.y + 1][move.to.x] = { piece: PiecesType.Pawn, color: Teams.Black, id: -1, hasMoved: false };
    }

    if (move.to.y === 2 && move.to.x !== move.from.x) {
      board[move.to.y - 1][move.to.x] = { piece: PiecesType.Pawn, color: Teams.White, id: -1, hasMoved: false };
    }
  }

  // Do the En passant
  else {
    if (move.piece.color === Teams.White) board[move.to.y + 1][move.to.x] = { ...blankPiece }; // One square below (y + 1)
    else board[move.to.y - 1][move.to.x] = { ...blankPiece }; // One square above (y - 1)
  }
}

function handleCastle(board: PieceType[][], move: Moves, undo: boolean) {
  const { rookFrom, rookTo } = move.castle!;

  // Uncastle
  if (undo) {
    board[rookFrom.y][rookFrom.x] = board[rookTo.y][rookTo.x];
    board[rookTo.y][rookTo.x] = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
    // board[rookFrom.y][rookFrom.x].hasMoved = false;
  }

  // Castle
  else {
    board[rookTo.y][rookTo.x] = board[rookFrom.y][rookFrom.x];
    board[rookFrom.y][rookFrom.x] = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
    // board[rookTo.y][rookTo.x].hasMoved = true;
  }
}

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

function undoPieceCountUpdate(board: PieceType[][], move: Moves) {
  const { piece, color } = board[move.to.y][move.to.x];
  if (piece === PiecesType.None) return;

  if (color === Teams.White) piecesCount.maximizingPlayer[piece]++;
  else if (color === Teams.Black) piecesCount.minimizingPlayer[piece]++;
}

function makeMove(board: PieceType[][], move: Moves) {
  board[move.to.y][move.to.x] = { ...board[move.from.y][move.from.x], hasMoved: true };
  board[move.from.y][move.from.x] = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };

  // Handle castling
  if (move.castle) handleCastle(board, move, false);

  // Handle en passant
  if (move.enPassant) handleEnPassant(board, move, false);

  // Handle promotion
  if (move.promotion) handlePromote(board, board, move, false);
}

function undoMove(board: PieceType[][], newBoard: PieceType[][], move: Moves) {
  if (move.piece.piece === PiecesType.King) kingPositions[move.piece.color] = { x: move.from.x, y: move.from.y };

  newBoard[move.from.y][move.from.x] = newBoard[move.to.y][move.to.x];
  newBoard[move.to.y][move.to.x] = board[move.to.y][move.to.x];

  // Handle castling
  if (move.castle) handleCastle(newBoard, move, true);

  // Handle en passant
  if (move.enPassant) handleEnPassant(newBoard, move, true);

  // Handle promotion
  if (move.promotion) handlePromote(newBoard, board, move, true);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~33ms for 500,000 calculations (on my machine results may vary)
