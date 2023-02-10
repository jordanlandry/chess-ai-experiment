import properties from "../properties";
import sameTeam from "./sameTeam";

// For en passant
let lastMove = "";

const empty = -1;

export let whiteRookMoved = false;
export let whiteKingMoved = false;
export let blackRookMoved = false;
export let blackKingMoved = false;

// Returns an array of board indexes that are available to move to
export default function getAvailableMoves(board: number[][], x: number, y: number) {
  const moves = [];
  const numToPiece = properties.aiIsWhite ? properties.numPairWhite : properties.numPairBlack;
  const type = numToPiece[board[y][x]];

  // ~~~ WHITE PAWN ~~ \\
  if ((type === "P" && !properties.aiIsWhite) || (type === "p" && properties.aiIsWhite)) {
    // If the pawn hasn't moved yet, it can move 2 spaces
    if (y === 6 && board[y - 1][x] === empty && board[y - 2][x] === empty) {
      moves.push({ x, y: y - 2 });
    }

    // If the pawn can move forward, it can move forward
    if (y > 0 && board[y - 1][x] === empty) moves.push({ x, y: y - 1 });

    // If the pawn can capture diagonally
    if (y > 0 && x > 0 && board[y - 1][x - 1] !== -1 && !sameTeam(board[y - 1][x - 1], board[y][x])) moves.push({ x: x - 1, y: y - 1 });
    if (y > 0 && x < 7 && board[y - 1][x + 1] !== -1 && !sameTeam(board[y - 1][x + 1], board[y][x])) moves.push({ x: x + 1, y: y - 1 });

    // If the pawn can capture en passant TODO
  }

  // ~~~ BLACK PAWN ~~ \\
  if ((type === "P" && properties.aiIsWhite) || (type === "p" && !properties.aiIsWhite)) {
    // If the pawn hasn't moved yet, it can move 2 spaces
    if (y === 1 && board[y + 1][x] === empty && board[y + 2][x] === empty) {
      moves.push({ x, y: y + 2 });
    }

    // If the pawn can move forward, it can move forward
    if (y < 7 && board[y + 1][x] === empty) moves.push({ x, y: y + 1 });

    // If the pawn can capture diagonally
    if (y < 7 && x > 0 && board[y + 1][x - 1] !== -1 && !sameTeam(board[y + 1][x - 1], board[y][x])) moves.push({ x: x - 1, y: y + 1 });
    if (y < 7 && x < 7 && board[y + 1][x + 1] !== -1 && !sameTeam(board[y + 1][x + 1], board[y][x])) moves.push({ x: x + 1, y: y + 1 });

    // If the pawn can capture en passant TODO
  }


  // Knight moves
  if (type === "N" || type === "n") {
    if (y > 1 && x > 0 && !sameTeam(board[y - 2][x - 1], board[y][x])) moves.push({ x: x - 1, y: y - 2 });
    if (y > 1 && x < 7 && !sameTeam(board[y - 2][x + 1], board[y][x])) moves.push({ x: x + 1, y: y - 2 });
    if (y > 0 && x > 1 && !sameTeam(board[y - 1][x - 2], board[y][x])) moves.push({ x: x - 2, y: y - 1 });
    if (y > 0 && x < 6 && !sameTeam(board[y - 1][x + 2], board[y][x])) moves.push({ x: x + 2, y: y - 1 });
    if (y < 6 && x > 0 && !sameTeam(board[y + 2][x - 1], board[y][x])) moves.push({ x: x - 1, y: y + 2 });
    if (y < 6 && x < 7 && !sameTeam(board[y + 2][x + 1], board[y][x])) moves.push({ x: x + 1, y: y + 2 });
    if (y < 7 && x > 1 && !sameTeam(board[y + 1][x - 2], board[y][x])) moves.push({ x: x - 2, y: y + 1 });
    if (y < 7 && x < 6 && !sameTeam(board[y + 1][x + 2], board[y][x])) moves.push({ x: x + 2, y: y + 1 });
  }

  // Bishop moves / Queen diagonal moves
  if (type === "B" || type === "b" || type === "Q" || type === "q") {
    // Up left
    for (let i = 1; i < 8; i++) {
      if (y - i < 0 || x - i < 0) break;
      if (board[y - i][x - i] === empty) moves.push({ x: x - i, y: y - i });

      if (board[y - i][x - i] !== empty) {
        if (!sameTeam(board[y - i][x - i], board[y][x])) moves.push({ x: x - i, y: y - i });
        break;
      }
    }

    // Up right
    for (let i = 1; i < 8; i++) {
      if (y - i < 0 || x + i > 7) break;
      if (board[y - i][x + i] === empty) moves.push({ x: x + i, y: y - i });

      if (board[y - i][x + i] !== empty) {
        if (!sameTeam(board[y - i][x + i], board[y][x])) moves.push({ x: x + i, y: y - i });
        break;
      }
    }

    // Down left
    for (let i = 1; i < 8; i++) {
      if (y + i > 7 || x - i < 0) break;
      if (board[y + i][x - i] === empty) moves.push({ x: x - i, y: y + i });

      if (board[y + i][x - i] !== empty) {
        if (!sameTeam(board[y + i][x - i], board[y][x])) moves.push({ x: x - i, y: y + i });
        break;
      }
    }

    // Down right
    for (let i = 1; i < 8; i++) {
      if (y + i > 7 || x + i > 7) break;
      if (board[y + i][x + i] === empty) moves.push({ x: x + i, y: y + i });

      if (board[y + i][x + i] !== empty) {
        if (!sameTeam(board[y + i][x + i], board[y][x])) moves.push({ x: x + i, y: y + i });
        break;
      }
    }
  }

  // Rook moves / Queen horizontal moves
  if (type === "R" || type === "r" || type === "Q" || type === "q") {
    // Up
    for (let i = 1; i < 8; i++) {
      if (y - i < 0) break;
      if (board[y - i][x] === empty) moves.push({ x, y: y - i });

      if (board[y - i][x] !== empty) {
        if (!sameTeam(board[y - i][x], board[y][x])) moves.push({ x, y: y - i });
        break;
      }
    }

    // Down
    for (let i = 1; i < 8; i++) {
      if (y + i > 7) break;
      if (board[y + i][x] === empty) moves.push({ x, y: y + i });

      if (board[y + i][x] !== empty) {
        if (!sameTeam(board[y + i][x], board[y][x])) moves.push({ x, y: y + i });
        break;
      }
    }

    // Left
    for (let i = 1; i < 8; i++) {
      if (x - i < 0) break;
      if (board[y][x - i] === empty) moves.push({ x: x - i, y });

      if (board[y][x - i] !== empty) {
        if (!sameTeam(board[y][x - i], board[y][x])) moves.push({ x: x - i, y });
        break;
      }
    }

    // Right
    for (let i = 1; i < 8; i++) {
      if (x + i > 7) break;
      if (board[y][x + i] === empty) moves.push({ x: x + i, y });

      if (board[y][x + i] !== empty) {
        if (!sameTeam(board[y][x + i], board[y][x])) moves.push({ x: x + i, y });
        break;
      }
    }
  }

  // King moves
  if (type === "K" || type === "k") {
    if (y > 0 && x > 0 && !sameTeam(board[y - 1][x - 1], board[y][x])) moves.push({ x: x - 1, y: y - 1 });
    if (y > 0 && !sameTeam(board[y - 1][x], board[y][x])) moves.push({ x, y: y - 1 });
    if (y > 0 && x < 7 && !sameTeam(board[y - 1][x + 1], board[y][x])) moves.push({ x: x + 1, y: y - 1 });
    if (x > 0 && !sameTeam(board[y][x - 1], board[y][x])) moves.push({ x: x - 1, y });
    if (x < 7 && !sameTeam(board[y][x + 1], board[y][x])) moves.push({ x: x + 1, y });
    if (y < 7 && x > 0 && !sameTeam(board[y + 1][x - 1], board[y][x])) moves.push({ x: x - 1, y: y + 1 });
    if (y < 7 && !sameTeam(board[y + 1][x], board[y][x])) moves.push({ x, y: y + 1 });
    if (y < 7 && x < 7 && !sameTeam(board[y + 1][x + 1], board[y][x])) moves.push({ x: x + 1, y: y + 1 });

    // Castling
    if (!properties.aiIsWhite) {
      if (type === "K" && !whiteKingMoved) {
        if (!whiteRookMoved && board[7][1] === empty && board[7][2] === empty && board[7][3] === empty) moves.push({ x: 2, y: 7, castle: true });
        if (!whiteRookMoved && board[7][5] === empty && board[7][6] === empty) moves.push({ x: 6, y: 7, castle: true });
      }
      
      if (type === "k" && !blackKingMoved) {
        if (!blackRookMoved && board[0][1] === empty && board[0][2] === empty && board[0][3] === empty) moves.push({ x: 2, y: 0, castle: true });
        if (!blackRookMoved && board[0][5] === empty && board[0][6] === empty) moves.push({ x: 6, y: 0, castle: true });
      }
    }

    if (properties.aiIsWhite) {
      if (type === "k" && !blackKingMoved) {
        if (!blackRookMoved && board[7][1] === empty && board[7][2] === empty) moves.push({ x: 1, y: 7, castle: true });
        if (!blackRookMoved && board[7][4] === empty && board[7][5] === empty && board[7][6] === empty) moves.push({ x: 5, y: 7, castle: true });
      }

      if (type === "K" && !whiteKingMoved) {
        if (!whiteRookMoved && board[0][1] === empty && board[0][2] === empty) moves.push({ x: 1, y: 0, castle: true });
        if (!whiteRookMoved && board[0][4] === empty && board[0][5] === empty && board[0][6] === empty) moves.push({ x: 5, y: 0, castle: true });
      }
    }
  }

  // Remove moves that will put the king in check
  // moves = moves.filter((move) => {
  //   const newBoard = board.map((row) => row.slice());
  //   newBoard[move.y][move.x] = newBoard[y][x];
  //   newBoard[y][x] = empty;
  //   return !isInCheck(newBoard, team);
  // });

  return moves;
}
