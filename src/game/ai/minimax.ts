// import {
//   BlackBishops,
//   BlackKing,
//   BlackKnights,
//   BlackPawns,
//   BlackQueens,
//   BlackRooks,
//   board,
//   castleMoveProperties,
//   getKey,
//   inStalemate,
//   Move,
//   pieceCounts,
//   totalNumberOfPieces,
//   WhiteBishops,
//   WhiteKing,
//   WhiteKnights,
//   WhitePawns,
//   WhiteQueens,
//   WhiteRooks,
// } from "../../board";
// import makeMove from "../../helpers/makeMove";
// import { GameStates, PiecesType, Teams } from "../../properties";
// import { getAvailableMovesFor } from "../getAvailableMoves";
// import orderMovesTest from "./orderMoves";
// import { positionalScoreMaps } from "./positionalScoreMaps";

// export interface Minimax {
//   score: number;
//   move: Move;
// }

// // Based on the difficulty, the maximum depth is set, and the number of moves to look at
// // For example, if the difficulty is easy it won't look at every possible move
// // This is so that it won't play the best move, but should still play an okay move based on the difficulty.
// // Represented in the moves value, which is the percentage of moves to look at

// export const callingFromAi = {
//   searchForCheck: false,
// };

// export const functionTimes = {
//   getMoves: 0,
//   evaluateBoard: 0,
//   savingCastleMoves: 0,
//   makingMove: 0,
//   undoingMove: 0,
//   boardHashing: 0,
//   orderMoves: 0,
// } as { [key: string]: number };

// export const depthTimes: number[] = [];

// interface Diffitulty {
//   maxDepth: number;
//   elo: number;
// }

// export const difficulties = {
//   beginner: { elo: 250, maxDepth: 3 },
//   easy: { elo: 500, maxDepth: 4 },
//   medium: { elo: 1000, maxDepth: 5 },
//   hard: { elo: 1500, maxDepth: 7 },
//   max: { elo: 1700, maxDepth: Infinity },
// } as { [key: string]: Diffitulty };

// // When there are less than 10 pieces left, the maxDepth must increase or else it will always repeat moves
// // As is can not see far enough ahead to ever deliver a checkmate

// // This will be defined in the BotMenu.tsx Component file
// export const minimaxProperties = {
//   maxDepth: Infinity,
//   movesPercent: 1,
// };

// function findDoubledPawns() {
//   let score = 0;

//   BlackPawns.forEach((pos) => {
//     if (BlackPawns.includes(pos - 8)) score += 1;
//   });

//   WhitePawns.forEach((pos) => {
//     if (WhitePawns.includes(pos + 8)) score -= 1;
//   });

//   return score;
// }

// // piece count to gameState
// function getGameState() {
//   if (totalNumberOfPieces > 26) return GameStates.EarlyGame;
//   if (totalNumberOfPieces > 12) return GameStates.MidGame;
//   return GameStates.EndGame;
// }

// function getPositionalScore() {
//   let score = findDoubledPawns();

//   const gameState = getGameState();

//   BlackPawns.forEach((pos) => (score -= positionalScoreMaps[gameState].pawn[63 - pos]));
//   BlackBishops.forEach((pos) => (score -= positionalScoreMaps[gameState].bishop[63 - pos]));
//   BlackQueens.forEach((pos) => (score -= positionalScoreMaps[gameState].queen[63 - pos]));
//   BlackRooks.forEach((pos) => (score -= positionalScoreMaps[gameState].rook[63 - pos]));
//   BlackKnights.forEach((pos) => (score -= positionalScoreMaps[gameState].knight[63 - pos]));
//   BlackKing.forEach((pos) => (score -= positionalScoreMaps[gameState].king[63 - pos]));

//   WhitePawns.forEach((pos) => (score += positionalScoreMaps[gameState].pawn[pos]));
//   WhiteBishops.forEach((pos) => (score += positionalScoreMaps[gameState].bishop[pos]));
//   WhiteQueens.forEach((pos) => (score += positionalScoreMaps[gameState].queen[pos]));
//   WhiteRooks.forEach((pos) => (score += positionalScoreMaps[gameState].rook[pos]));
//   WhiteKnights.forEach((pos) => (score += positionalScoreMaps[gameState].knight[pos]));
//   WhiteKing.forEach((pos) => (score += positionalScoreMaps[gameState].king[pos]));

//   return score / 10;
// }

// function evaluateBoard() {
//   const startTime = Date.now();
//   let score = 0;

//   // White Team
//   score += pieceCounts[Teams.White][PiecesType.Pawn] * 1;
//   score += pieceCounts[Teams.White][PiecesType.Knight] * 3;
//   score += pieceCounts[Teams.White][PiecesType.Bishop] * 3;
//   score += pieceCounts[Teams.White][PiecesType.Rook] * 5;
//   score += pieceCounts[Teams.White][PiecesType.Queen] * 9;

//   // Black Team
//   score -= pieceCounts[Teams.Black][PiecesType.Pawn] * 1;
//   score -= pieceCounts[Teams.Black][PiecesType.Knight] * 3;
//   score -= pieceCounts[Teams.Black][PiecesType.Bishop] * 3;
//   score -= pieceCounts[Teams.Black][PiecesType.Rook] * 5;
//   score -= pieceCounts[Teams.Black][PiecesType.Queen] * 9;

//   score += getPositionalScore();

//   functionTimes.evaluateBoard += Date.now() - startTime;

//   return score;
// }

// interface Table extends Minimax {
//   depth: number;
// }

// const MAX_TABLE_SIZE = 128_000;
// let tableSize = 0;
// let table = {} as { [key: string]: Table };

// export const maxTime = 3000;
// let startTime = 0;
// let previousBestMove = { from: -1, to: -1 };

// export interface PreviousEvals {
//   [key: number]: {
//     max: {
//       [key: number]: {
//         score: number;
//         move: Move;
//       }[];
//     };

//     min: {
//       [key: number]: {
//         score: number;
//         move: Move;
//       }[];
//     };
//   };
// }

// export let previousBestMoves = {} as PreviousEvals;

// export let currentDepth = 1;
// export default function getBestMoveTest(aiTeam: Teams) {
//   callingFromAi.searchForCheck = false;
//   startTime = Date.now();

//   currentDepth = 1;

//   if (totalNumberOfPieces < 10) minimaxProperties.maxDepth = Infinity;

//   // Reset the times
//   for (const key in functionTimes) {
//     functionTimes[key] = 0;
//   }

//   depthTimes.length = 0;

//   let bestMove: Minimax = { score: 0, move: { from: -1, to: -1 } };
//   while (Date.now() - startTime < maxTime) {
//     const start = Date.now();

//     table = {};
//     const next = minimax(currentDepth, -checkMateScore, checkMateScore, aiTeam === Teams.White);

//     if (!next) break;

//     bestMove = next;
//     previousBestMove = next.move;
//     currentDepth++;

//     depthTimes.push(Date.now() - start);

//     if (currentDepth >= minimaxProperties.maxDepth) break;
//   }

//   console.log("Depth: " + (currentDepth - 1));

//   callingFromAi.searchForCheck = false;
//   return bestMove;
// }

// // Depth for quiescence search (don't wanna use quiscence in the name of the variable)
// // Cuz silly word
// const qDepth = 5;

// // Not infinity so I can set inifinity as illegal move
// const checkMateScore = 100_000_000;
// // const illegalScore = Math.random();

// const nullMoveR = 3;
// const nullMoveAllowed = (isMax: boolean, depth: number) => totalNumberOfPieces > 10 && !isMax && depth > nullMoveR;

// // Number of top moves to save after each depth for the move ordering
// const numberOfTopMoves = 10;

// function minimax(depth: number, alpha: number, beta: number, isMax: boolean): Minimax | null {
//   if (depth < 1) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

//   if (tableSize > MAX_TABLE_SIZE) {
//     table = {};
//     tableSize = 0;
//   }

//   if (Date.now() - startTime > maxTime) return null;

//   // Maximizer
//   if (isMax) {
//     const boardHashingStart = Date.now();
//     const boardHash = getKey();
//     functionTimes.boardHashing += Date.now() - boardHashingStart;

//     if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

//     const bestMove = { score: -checkMateScore, move: { from: -1, to: -1 } };

//     const moveStart = Date.now();
//     const moves = getAvailableMovesFor(Teams.White);
//     functionTimes.getMoves += Date.now() - moveStart;

//     if (moves.length === 0) {
//       if (inStalemate(Teams.White)) return { score: 0, move: { from: -1, to: -1 } };
//       return { ...bestMove, score: -checkMateScore };
//     }

//     const orderMovesStart = Date.now();
//     const orderedMoves = orderMovesTest(moves, previousBestMove, isMax, depth);
//     functionTimes.orderMoves += Date.now() - orderMovesStart;

//     bestMove.move = moves[0];

//     for (let i = 0; i < orderedMoves.length; i++) {
//       const { from, to, castle, enPassant, promoteTo } = orderedMoves[i].move;

//       // Save previous inmformation, so we can properly undo the move
//       const capturedPiece = board[to];

//       const castleTimeStart = Date.now();

//       const previousWhiteCastle = { ...castleMoveProperties[Teams.White] };
//       const previousBlackCastle = { ...castleMoveProperties[Teams.Black] };

//       functionTimes.savingCastleMoves += Date.now() - castleTimeStart;

//       const makeMoveStart = Date.now();
//       makeMove(from, to, castle, enPassant, promoteTo, true); // Make move
//       functionTimes.makingMove += Date.now() - makeMoveStart;

//       const nextEval = minimax(depth - 1, alpha, beta, !isMax); // Get minimax for next move

//       const undoMoveStart = Date.now();
//       makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece); // Undo move
//       functionTimes.undoingMove += Date.now() - undoMoveStart;

//       // Update castle state
//       castleMoveProperties[Teams.White] = previousWhiteCastle;
//       castleMoveProperties[Teams.Black] = previousBlackCastle;

//       // Update best move
//       if (!nextEval) return null;

//       // Prevent AI from losing king (it thinks trading kings is an even trade but it's not how it should work)
//       // if (WhiteKing.length === 0 || BlackKing.length === 0) continue;
//       // if (nextEval.score === illegalScore) continue;

//       if (nextEval.score > bestMove.score) {
//         bestMove.score = nextEval.score;
//         bestMove.move = orderedMoves[i].move;
//       }

//       // Add to table
//       if (depth === 1) {
//         table[boardHash] = { ...bestMove, depth };
//         tableSize++;
//       }

//       // previousBestMoves[currentDepth].max[depth].push({ score: nextEval.score, move: orderedMoves[i].move });

//       // Update alpha
//       alpha = Math.max(alpha, bestMove.score);
//       if (beta <= alpha) break;
//     }

//     return bestMove;
//   }

//   // Minimizer
//   else {
//     const boardHashingStart = Date.now();
//     const boardHash = getKey() * -1;
//     functionTimes.boardHashing += Date.now() - boardHashingStart;

//     if (table[boardHash] && depth === table[boardHash].depth) return table[boardHash];

//     let bestMove = { score: checkMateScore, move: { from: -1, to: -1 } };

//     const moveStart = Date.now();
//     // const moves = getAllAvailableMovesTest(Teams.Black);
//     const moves = getAvailableMovesFor(Teams.Black);
//     functionTimes.getMoves += Date.now() - moveStart;

//     if (moves.length === 0) {
//       if (inStalemate(Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
//       return { ...bestMove, score: checkMateScore };
//     }

//     const orderMovesStart = Date.now();
//     const orderedMoves = orderMovesTest(moves, previousBestMove, isMax, depth);
//     functionTimes.orderMoves += Date.now() - orderMovesStart;

//     bestMove.move = moves[0];

//     for (let i = 0; i < orderedMoves.length; i++) {
//       const { from, to, castle, enPassant, promoteTo } = orderedMoves[i].move;

//       // Save the piece that is being captured (if any)
//       const capturedPiece = board[to];

//       const castleTimeStart = Date.now();
//       const previousWhiteCastle = { ...castleMoveProperties[Teams.White] };
//       const previousBlackCastle = { ...castleMoveProperties[Teams.Black] };
//       functionTimes.savingCastleMoves += Date.now() - castleTimeStart;

//       const makeMoveStart = Date.now();
//       makeMove(from, to, castle, enPassant, promoteTo, true);
//       functionTimes.makingMove += Date.now() - makeMoveStart;

//       const nextEval = minimax(depth - 1, alpha, beta, !isMax);

//       const undoMoveStart = Date.now();
//       makeMove(to, from, castle, enPassant, promoteTo, true, true, capturedPiece);
//       functionTimes.undoingMove += Date.now() - undoMoveStart;

//       // Update castle properties
//       castleMoveProperties[Teams.White] = previousWhiteCastle;
//       castleMoveProperties[Teams.Black] = previousBlackCastle;

//       // Update best move
//       if (!nextEval) return null;
//       // if (nextEval.score === illegalScore) continue;

//       // Prevent AI from losing king (it thinks trading kings is an even trade but it's not how it should work)
//       // if (WhiteKing.length === 0 || BlackKing.length === 0) continue;

//       if (nextEval.score < bestMove.score || bestMove.move.from === -1 || nextEval.move.from === -1) {
//         bestMove.score = nextEval.score;
//         bestMove.move = orderedMoves[i].move;
//       }

//       // Add to table
//       if (depth === 1) {
//         table[boardHash] = { ...bestMove, depth };
//         tableSize++;
//       }

//       // Add previous move
//       // if (!previousBestMoves[currentDepth]) {
//       //   previousBestMoves[currentDepth] = {
//       //     max: {},
//       //     min: {},
//       //   };
//       // }

//       // if (!previousBestMoves[currentDepth].min[depth]) {
//       //   previousBestMoves[currentDepth].min[depth] = [];
//       // }

//       // previousBestMoves[currentDepth].min[depth].push({ score: nextEval.score, move: orderedMoves[i].move });

//       // Update beta
//       beta = Math.min(beta, bestMove.score);
//       if (beta <= alpha) break;
//     }

//     return bestMove;
//   }
// }

// // Quiescence search (https://www.chessprogramming.org/Quiescence_Search)
// // I called it this instead cuz who want's to spell out quiescence
// // I haven't added checks yet only captures

// // function searchThroughCaptures(depth: number, alpha: number, beta: number, isMax: boolean) {
// //   // 1. Generate all captures
// //   // 2. Make a capture move
// //   // 3. Recursively call this function to search the next capture
// //   // 4. Undo move
// //   // 5. Update best move
// //   // 6. Update alpha and beta
// //   // 7. Return best move

// //   if (Date.now() - startTime > maxTime) return null;
// //   if (depth === 0) return { score: evaluateBoard(), move: { from: -1, to: -1 } };

// //   const { moves, captures } = generateCaptures(isMax ? Teams.White : Teams.Black);

// //   const bestMove = { score: isMax ? -Infinity : Infinity, move: { from: -1, to: -1 } };

// //   if (moves.length === 0) {
// //     if (inStalemate(isMax ? Teams.White : Teams.Black)) return { score: 0, move: { from: -1, to: -1 } };
// //     return bestMove;
// //   }

// //   // Base case
// //   if (captures.length === 0) {
// //     const score = evaluateBoard();
// //     return { score, move: { from: -1, to: -1 } };
// //   }

// //   const orderedCaptures = orderMovesTest(captures, { from: -1, to: -1 });

// //   // Maximizer
// //   if (isMax) {
// //     for (let i = 0; i < orderedCaptures.length; i++) {
// //       const capturedPiece = board[captures[i].to];
// //       const capture = orderedCaptures[i];

// //       // Make move
// //       makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

// //       // Evaluate the next depth of captures
// //       const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

// //       // Undo move
// //       makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

// //       // Update best move
// //       if (!nextEval) return null;
// //       if (nextEval.score > bestMove.score) {
// //         bestMove.score = nextEval.score;
// //         bestMove.move = capture;
// //       }

// //       // Update alpha
// //       alpha = Math.max(alpha, bestMove.score);
// //       if (beta <= alpha) break;
// //     }
// //     return bestMove;
// //   }

// //   // Minimizer
// //   else {
// //     for (let i = 0; i < orderedCaptures.length; i++) {
// //       const capturedPiece = board[captures[i].to];
// //       const capture = orderedCaptures[i];

// //       // Make move
// //       makeMove(capture.from, capture.to, capture.castle, capture.enPassant, capture.promoteTo, true);

// //       // Evaluate the next depth of captures
// //       const nextEval = searchThroughCaptures(depth - 1, alpha, beta, !isMax);

// //       // Undo move
// //       makeMove(capture.to, capture.from, capture.castle, capture.enPassant, capture.promoteTo, true, true, capturedPiece);

// //       // Update best move
// //       if (!nextEval) return null;
// //       if (nextEval.score < bestMove.score) {
// //         bestMove.score = nextEval.score;
// //         bestMove.move = capture;
// //       }

// //       // Update beta
// //       beta = Math.min(beta, bestMove.score);
// //       if (beta <= alpha) break;
// //     }
// //     return bestMove;
// //   }
// // }

// // function generateCaptures(team: Teams) {
// //   const moves = getAllAvailableMovesTest(team);
// //   const captures = [];
// //   for (let i = 0; i < moves.length; i++) {
// //     if (board[moves[i].to] || moves[i].enPassant) captures.push(moves[i]);
// //   }

// //   return { captures, moves };
// // }
