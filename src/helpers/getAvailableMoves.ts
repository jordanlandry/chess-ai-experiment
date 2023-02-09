import properties from "../properties";
import sameTeam from "./sameTeam";

// For en passant
let lastMove = "";

const empty = -1;

// Returns an array of board indexes that are available to move to
export default function getAvailableMoves(board: number[][], x: number, y: number) {
  let moves = [];
  const type = properties.numToPiece[board[y][x]];

  // ~~~ WHITE PAWN ~~ \\

  if (type === "P") {
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

  if (type === "p") {
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
