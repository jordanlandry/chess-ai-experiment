import { board, getTeam, pieceType, undoPiecePosition, updateBoard, updateOccupiedSquares, updatePiecePositions } from "../board";
import { Teams } from "../properties";

// Psuedo will be true when we are not updating the state,
// This will only be true when we are checking from the AI
export default async function makeMove(
  from: number,
  to: number,
  castle: boolean | undefined,
  enPassant: boolean | undefined,
  psuedo = false,
  undo = false,
  capturedPiece?: number
) {
  if (!psuedo) {
    const previousPiece = document.getElementById(to.toString());
    if (previousPiece) previousPiece.remove();

    if (enPassant) {
      if (getTeam(board[from]) === Teams.White) {
        const previousPiece = document.getElementById((to + 8).toString());
        if (previousPiece) previousPiece.remove();
      } else {
        const previousPiece = document.getElementById((to - 8).toString());
        if (previousPiece) previousPiece.remove();
      }
    }

    const movingPiece = document.getElementById(from.toString());
    if (movingPiece) movingPiece.id = to.toString();

    if (castle) {
      const rookFrom = to === 62 ? 63 : 56;
      const rookTo = to === 62 ? 61 : 59;
      const rook = document.getElementById(rookFrom.toString());
      if (rook) rook.id = rookTo.toString();
    }
  }

  const team = getTeam(board[from]);
  const piece = pieceType(board[from]);

  if (undo) undoPiecePosition(piece, team, from, to, castle, enPassant, capturedPiece);
  else updatePiecePositions(piece, team, from, to, castle, enPassant);
}
