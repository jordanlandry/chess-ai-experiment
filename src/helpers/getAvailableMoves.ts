import properties from "../properties";
import getTeam from "./getTeam";
import sameTeam from "./sameTeam";

// For en passant
let lastMove = "";

const empty = -1;

// export let whiteRightRookMoved = false;
// export let whiteLeftRookMoved = false;

// export let blackLeftRookMoved = false;
// export let blackRightRookMoved = false;

// export let whiteKingMoved = false;
// export let blackKingMoved = false;

export const castleData = {
  whiteKingMoved: false,
  whiteLeftRookMoved: false,
  whiteRightRookMoved: false,
  blackKingMoved: false,
  blackLeftRookMoved: false,
  blackRightRookMoved: false,
};

let whitesTurn = true;

// Returns an array of board indexes that are available to move to
export default function getAvailableMoves(board: number[][], x: number, y: number) {
  let moves = [];
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
    if (y > 0 && x > 0 && board[y - 1][x - 1] !== -1 && !sameTeam(board[y - 1][x - 1], board[y][x]))
      moves.push({ x: x - 1, y: y - 1 });

    if (y > 0 && x < 7 && board[y - 1][x + 1] !== -1 && !sameTeam(board[y - 1][x + 1], board[y][x]))
      moves.push({ x: x + 1, y: y - 1 });

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
    if (y < 7 && x > 0 && board[y + 1][x - 1] !== -1 && !sameTeam(board[y + 1][x - 1], board[y][x]))
      moves.push({ x: x - 1, y: y + 1 });
    if (y < 7 && x < 7 && board[y + 1][x + 1] !== -1 && !sameTeam(board[y + 1][x + 1], board[y][x]))
      moves.push({ x: x + 1, y: y + 1 });

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
      if (type === "K" && !castleData.whiteKingMoved) {
        whitesTurn = true;

        if (
          board[7][1] === empty &&
          board[7][2] === empty &&
          board[7][3] === empty &&
          !squareUnderAttack(board, { x: 1, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 2, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 3, y: 7 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 2, y: 7, castle: true });

        if (
          board[7][5] === empty &&
          board[7][6] === empty &&
          !squareUnderAttack(board, { x: 4, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 5, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 6, y: 7 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 6, y: 7, castle: true });
      }

      if (type === "k" && !castleData.blackKingMoved) {
        whitesTurn = false;

        if (
          board[0][1] === empty &&
          board[0][2] === empty &&
          board[0][3] === empty &&
          !squareUnderAttack(board, { x: 1, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 2, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 3, y: 0 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 2, y: 0, castle: true });

        if (
          board[0][5] === empty &&
          board[0][6] === empty &&
          !squareUnderAttack(board, { x: 5, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 6, y: 0 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 6, y: 0, castle: true });
      }
    }

    if (properties.aiIsWhite) {
      if (type === "k" && !castleData.blackKingMoved) {
        whitesTurn = false;

        if (
          !castleData.blackLeftRookMoved &&
          board[7][1] === empty &&
          board[7][2] === empty &&
          !squareUnderAttack(board, { x: 1, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 2, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 3, y: 7 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 1, y: 7, castle: true });

        if (
          !castleData.blackRightRookMoved &&
          board[7][4] === empty &&
          board[7][5] === empty &&
          board[7][6] === empty &&
          !squareUnderAttack(board, { x: 3, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 4, y: 7 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 5, y: 7 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 5, y: 7, castle: true });
      }

      if (type === "K" && !castleData.whiteKingMoved) {
        whitesTurn = true;

        if (
          !castleData.whiteLeftRookMoved &&
          board[0][1] === empty &&
          board[0][2] === empty &&
          board[0][3] === empty &&
          !squareUnderAttack(board, { x: 1, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 2, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 3, y: 0 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 2, y: 0, castle: true });

        if (
          !castleData.whiteRightRookMoved &&
          board[0][5] === empty &&
          board[0][6] === empty &&
          !squareUnderAttack(board, { x: 5, y: 0 }, whitesTurn ? "white" : "black") &&
          !squareUnderAttack(board, { x: 6, y: 0 }, whitesTurn ? "white" : "black")
        )
          moves.push({ x: 6, y: 0, castle: true });
      }
    }
  }

  moves = moves.filter((move) => {
    return !kingInCheckAfterMove(board, { from: { x, y }, to: { x: move.x, y: move.y } }, getTeam(board, x, y));
  });

  return moves;
}

function kingInCheckAfterMove(
  board: number[][],
  move: { from: { x: number; y: number }; to: { x: number; y: number } },
  team: "white" | "black" | "none"
) {
  const numToPiece = properties.aiIsWhite ? properties.numPairWhite : properties.numPairBlack;

  // Make a copy of the board
  const newBoard = board.map((row) => [...row]);

  // Move the piece
  newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
  newBoard[move.from.y][move.from.x] = empty;

  // Find the king
  let kingX = 0;
  let kingY = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (numToPiece[newBoard[i][j]] === (team === "white" ? "K" : "k")) {
        kingX = j;
        kingY = i;
      }

      if (kingX && kingY) break;
    }
  }

  // Check if the king is in check
  return squareUnderAttack(newBoard, { x: kingX, y: kingY }, team);
}

export function getAllMoves(board: number[][], isWhite: boolean) {
  let moves: any = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === -1) continue;

      // If the piece is not the same color as the chosen player skip it
      if (sameTeam(board[i][j], isWhite ? 0 : 63)) continue;

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

// Yes I know this is a mess, but the alternative was extremely long if statements, and I wanted to avoid that
// Plus this code will never need to be changed (except to add en passant) and is pretty straight forward
export function squareUnderAttack(board: number[][], pos: { x: number; y: number }, team: string) {
  const numToPiece = properties.aiIsWhite ? properties.numPairWhite : properties.numPairBlack;

  const { x, y } = pos;

  let rook = team === "white" ? "r" : "R";
  let queen = team === "white" ? "q" : "Q";
  let bishop = team === "white" ? "b" : "B";
  let knight = team === "white" ? "n" : "N";
  let pawn = team === "white" ? "p" : "P";
  let king = team === "white" ? "k" : "K";

  // Check for rooks and queens
  // Up
  for (let i = y + 1; i < 8; i++) {
    if (numToPiece[board[i][x]] === rook || numToPiece[board[i][x]] === queen) return true;
    if (board[i][x] !== empty) break;
  }

  // Down
  for (let i = y - 1; i >= 0; i--) {
    if (numToPiece[board[i][x]] === rook || numToPiece[board[i][x]] === queen) return true;
    if (board[i][x] !== empty) break;
  }

  // Left
  for (let i = x - 1; i >= 0; i--) {
    if (numToPiece[board[y][i]] === rook || numToPiece[board[y][i]] === queen) return true;
    if (board[y][i] !== empty) break;
  }

  // Right
  for (let i = x + 1; i < 8; i++) {
    if (numToPiece[board[y][i]] === rook || numToPiece[board[y][i]] === queen) return true;
    if (board[y][i] !== empty) break;
  }

  // Diagonals
  // Up Right
  for (let i = 1; i < 8; i++) {
    if (y + i < 8 && x + i < 8) {
      if (numToPiece[board[y + i][x + i]] === bishop || numToPiece[board[y + i][x + i]] === queen) return true;
      if (board[y + i][x + i] !== empty) break;
    }
  }

  // Down Left
  for (let i = 1; i < 8; i++) {
    if (y - i >= 0 && x - i >= 0) {
      if (numToPiece[board[y - i][x - i]] === bishop || numToPiece[board[y - i][x - i]] === queen) return true;
      if (board[y - i][x - i] !== empty) break;
    }
  }

  // Up Left
  for (let i = 1; i < 8; i++) {
    if (y + i < 8 && x - i >= 0) {
      if (numToPiece[board[y + i][x - i]] === bishop || numToPiece[board[y + i][x - i]] === queen) return true;
      if (board[y + i][x - i] !== empty) break;
    }
  }

  // Down Right
  for (let i = 1; i < 8; i++) {
    if (y - i >= 0 && x + i < 8) {
      if (numToPiece[board[y - i][x + i]] === bishop || numToPiece[board[y - i][x + i]] === queen) return true;
      if (board[y - i][x + i] !== empty) break;
    }
  }

  // Knights
  if (y + 2 < 8) {
    if (x + 1 < 8) {
      if (numToPiece[board[y + 2][x + 1]] === knight) return true;
    }
    if (x - 1 >= 0) {
      if (numToPiece[board[y + 2][x - 1]] === knight) return true;
    }
  }

  if (y - 2 >= 0) {
    if (x + 1 < 8) {
      if (numToPiece[board[y - 2][x + 1]] === knight) return true;
    }
    if (x - 1 >= 0) {
      if (numToPiece[board[y - 2][x - 1]] === knight) return true;
    }
  }

  if (x + 2 < 8) {
    if (y + 1 < 8) {
      if (numToPiece[board[y + 1][x + 2]] === knight) return true;
    }
    if (y - 1 >= 0) {
      if (numToPiece[board[y - 1][x + 2]] === knight) return true;
    }
  }

  // Check for kings
  if (y + 1 < 8 && x + 1 < 8 && numToPiece[board[y + 1][x + 1]] === king) return true;
  if (y + 1 < 8 && x - 1 >= 0 && numToPiece[board[y + 1][x - 1]] === king) return true;
  if (y - 1 >= 0 && x + 1 < 8 && numToPiece[board[y - 1][x + 1]] === king) return true;
  if (y - 1 >= 0 && x - 1 >= 0 && numToPiece[board[y - 1][x - 1]] === king) return true;
  if (y + 1 < 8 && numToPiece[board[y + 1][x]] === king) return true;
  if (y - 1 >= 0 && numToPiece[board[y - 1][x]] === king) return true;
  if (x + 1 < 8 && numToPiece[board[y][x + 1]] === king) return true;
  if (x - 1 >= 0 && numToPiece[board[y][x - 1]] === king) return true;

  return false;
}

// This approach makes a copy of the board, make the potential move, then generate all available moves for the other team,
// And see if the to.y and to.x are === to the given x and y.
// Right now it overwrites the available moves for some reason but I'll look into that later

let checking = false; // prevent the function from having an infinite recursion (Calling getAvalaileMoves when getAvailableMoves already called this function)
export function squareUnderAttackDoesntWork(
  board: number[][],
  move: { to: { x: number; y: number }; from: { x: number; y: number } },
  isWhite: boolean,
  castle?: boolean
) {
  // return false;
  if (checking) return false;

  checking = true;
  // Make the move
  let newBoard = board.map((row) => [...row]);
  newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
  newBoard[move.from.y][move.from.x] = empty;

  // const moves = getAllMoves(newBoard, !isWhite);
  const moves = getAllMoves(newBoard, !isWhite);
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].to.x === move.to.x && moves[i].to.y === move.to.y) {
      checking = false;
      return true;
    }
  }

  checking = false;
  return false;
}
