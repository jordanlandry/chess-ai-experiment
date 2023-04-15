import { Board, Move } from "../types";

// Function currently isn't 100% accurate, but it's good enough for now as I'm using it to create other components
export default function getNameOfMove(lastMove: Move | null, board: Board) {
  if (!lastMove) return "";

  let nameOfMove = "";

  let pieceName = board[lastMove.to.y][lastMove.to.x].piece.toLowerCase();

  // If the piece is a pawn, we don't need to add the name of the piece to the move
  if (pieceName === "p") {
    pieceName = "";

    if (lastMove.capture) nameOfMove += String.fromCharCode(97 + lastMove.from.x);
  }

  nameOfMove += pieceName.toLowerCase();

  // If the move is a capture, we need to add an X
  if (lastMove.capture) nameOfMove += "x";

  // Add the position of the move
  nameOfMove += String.fromCharCode(97 + lastMove.to.x) + (lastMove.to.y + 1);

  if (lastMove.castle) {
    nameOfMove = "O-O";
    if (lastMove.castle.rookTo.x === 2) nameOfMove += "-O";
  }

  return nameOfMove;
}
