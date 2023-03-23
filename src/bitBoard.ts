/*
  * Bitboards:
  * References:
  * https://www.chessprogramming.org/Bitboards
  * https://www.youtube.com/watch?v=a5IGltn95Bk
  * https://www.youtube.com/watch?v=cy3xhKk1-ns
  * https://www.youtube.com/@LogicCrazyChess

  * We will have 12 bitboards, one for each piece type and color
  * We will have 64 bits for each bitboard, one for each square
  * 0 will represent an empty square, 1 will represent occupied
  * for example if we have 4 squares and a piece on square 2, we would have: 010  *
  * Bitboards are a very efficient way to represent the board
  * As bit operations are very fast and can check for multiple squares at once
*/

import { Move } from "./board";
import { Teams } from "./properties";

// We will have a human readable representation of the board to make debugging easier
// Also if we ever want to undo positions have user input positions, we can use this
// And have functions to convert it to bitboards,
// as the bitboard is only really useful for the AI because of performance

export const bitboard = { wp: 0n, wn: 0n, wb: 0n, wr: 0n, wq: 0n, wk: 0n, bp: 0n, bn: 0n, bb: 0n, br: 0n, bq: 0n, bk: 0n };
export const fenBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];
// export const fenBoard = [
//   ["r", "n", "b", "q", "k", "b", "n", "r"],
//   ["p", "p", "p", "p", "p", "p", "p", "p"],
//   [" ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", "B"],
//   ["P", " ", " ", " ", " ", " ", "b", " "],
//   [" ", " ", " ", " ", " ", " ", " ", "P"],
//   ["R", "N", "B", "Q", "K", "B", "N", "R"],
// ];

// Turn the human readable board into bitboards
// This is kinda funky but it works and is easy to understand
export function initializeBitboard(board: string[][] = fenBoard) {
  const wp = new Array(64).fill("0");
  const wn = new Array(64).fill("0");
  const wb = new Array(64).fill("0");
  const wr = new Array(64).fill("0");
  const wq = new Array(64).fill("0");
  const wk = new Array(64).fill("0");
  const bp = new Array(64).fill("0");
  const bn = new Array(64).fill("0");
  const bb = new Array(64).fill("0");
  const br = new Array(64).fill("0");
  const bq = new Array(64).fill("0");
  const bk = new Array(64).fill("0");

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece === "P") wp[i * 8 + j] = "1";
      if (piece === "N") wn[i * 8 + j] = "1";
      if (piece === "B") wb[i * 8 + j] = "1";
      if (piece === "R") wr[i * 8 + j] = "1";
      if (piece === "Q") wq[i * 8 + j] = "1";
      if (piece === "K") wk[i * 8 + j] = "1";
      if (piece === "p") bp[i * 8 + j] = "1";
      if (piece === "n") bn[i * 8 + j] = "1";
      if (piece === "b") bb[i * 8 + j] = "1";
      if (piece === "r") br[i * 8 + j] = "1";
      if (piece === "q") bq[i * 8 + j] = "1";
      if (piece === "k") bk[i * 8 + j] = "1";
    }
  }

  bitboard.wp = BigInt(`0b${wp.join("")}`);
  bitboard.wn = BigInt(`0b${wn.join("")}`);
  bitboard.wb = BigInt(`0b${wb.join("")}`);
  bitboard.wr = BigInt(`0b${wr.join("")}`);
  bitboard.wq = BigInt(`0b${wq.join("")}`);
  bitboard.wk = BigInt(`0b${wk.join("")}`);
  bitboard.bp = BigInt(`0b${bp.join("")}`);
  bitboard.bn = BigInt(`0b${bn.join("")}`);
  bitboard.bb = BigInt(`0b${bb.join("")}`);
  bitboard.br = BigInt(`0b${br.join("")}`);
  bitboard.bq = BigInt(`0b${bq.join("")}`);
  bitboard.bk = BigInt(`0b${bk.join("")}`);
}

export function printBitboard(bitboard: bigint) {
  const bitboardString = bitboard.toString(2).padStart(64, "0");
  let boardString = "";
  for (let i = 0; i < 64; i++) {
    boardString += bitboardString[i] + " ";
    if ((i + 1) % 8 === 0) boardString += "\n";
  }

  console.log(boardString);
}

export function getAvailableMovesBitboard() {
  // printBitboard(getPawnMoves(Teams.White));

  getWhitePawnMoves();
}

export function getPawnMoves(team: Teams) {
  // if (team === Teams.White) return getWhitePawnMoves();
  return getWhitePawnMoves();

  // if (team === Teams.Black) return getBlackPawnMoves();
}

function getWhitePawnMoves() {
  const pawns = bitboard.wp;
  const occupied =
    bitboard.wp |
    bitboard.wn |
    bitboard.wb |
    bitboard.wr |
    bitboard.wq |
    bitboard.wk |
    bitboard.bp |
    bitboard.bn |
    bitboard.bb |
    bitboard.br |
    bitboard.bq |
    bitboard.bk;

  const forwardOne = pawns << 8n;
  const forwardTwo = (pawns & 0x000000000000ff00n) << 16n;

  const forwardOneOccupied = forwardOne & occupied;

  const attacksLeft = (pawns & ~0x0101010101010101n) << 7n;
  const attacksRight = (pawns & ~0x8080808080808080n) << 9n;

  const attacks = attacksLeft | attacksRight;
  const validAttacks = attacks & (bitboard.bp | bitboard.bn | bitboard.bb | bitboard.br | bitboard.bq | bitboard.bk);

  const validMoves = (forwardOne & ~occupied) | (forwardTwo & ~occupied & ~forwardOneOccupied & 0x0000000000ff0000n) | validAttacks;

  const moves = [];
  for (let i = 0n; i < 64n; i++) {
    if ((pawns & (1n << i)) !== 0n) {
      const from = i;
      const to = i + 8n;
      // const move = (from << 6n) | to;
      if ((validMoves & (1n << to)) !== 0n) moves.push({ from, to });
      if (i < 16n && (validMoves & (1n << (to + 8n))) !== 0n) moves.push({ from, to: to + 8n });
      if ((attacksLeft & (1n << to)) !== 0n) moves.push({ from, to });
      if ((attacksRight & (1n << to)) !== 0n) moves.push({ from, to });
    }
  }

  // console.log(moves);

  // printBitboard(validMoves);
}
