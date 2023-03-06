import { getTeam, Move, pieceType } from "../board";
import { Teams } from "../properties";
import { testBoard, undoBoardUpdate, updateAvailableMoves, updateTestBoard } from "../Testing/testBoard";

export function undoMove(move: Move, capturedPiece: number) {
  undoBoardUpdate(move, capturedPiece);
}

export function makeMoveNew(move: Move, doUpdateScreen = true) {
  if (move.from === -1 || move.to === -1) return;

  const { from, to, castle, enPassant, promoteTo } = move;

  const team = getTeam(testBoard[from]);
  const piece = pieceType(testBoard[from]);

  if (doUpdateScreen) updateScreen(move, team);
  updateTestBoard(move);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateScreen(move: Move, team: Teams) {
  const { from, to, castle, enPassant, promoteTo } = move;

  const previousPiece = document.getElementById(to.toString());
  if (previousPiece) previousPiece.remove();

  if (enPassant) {
    if (getTeam(testBoard[from]) === Teams.White) {
      const previousPiece = document.getElementById((to + 8).toString());
      if (previousPiece) previousPiece.remove();
    }

    // Black
    else {
      const previousPiece = document.getElementById((to - 8).toString());
      if (previousPiece) previousPiece.remove();
    }
  }

  const movingPiece = document.getElementById(from.toString()) as HTMLImageElement;

  if (movingPiece) movingPiece.id = to.toString();
  if (promoteTo) {
    // Need to change the image source.
    // Replace the 6th last character with the new piece
    const type = pieceType(promoteTo);
    const movingPieceArray = movingPiece.src.split("");
    movingPieceArray[movingPieceArray.length - 6] = type.toLowerCase();
    const newSrc = movingPieceArray.join("");

    movingPiece.src = newSrc;
    movingPiece.alt = type.toLowerCase();
  }

  if (castle) {
    if (team === Teams.White) {
      const rookFrom = to === 62 ? 63 : 56;
      const rookTo = to === 62 ? 61 : 59;

      const rook = document.getElementById(rookFrom.toString()) as HTMLImageElement;
      if (rook) rook.id = rookTo.toString();
    } else {
      const rookFrom = to === 6 ? 7 : 0;
      const rookTo = to === 6 ? 5 : 3;

      const rook = document.getElementById(rookFrom.toString()) as HTMLImageElement;
      if (rook) rook.id = rookTo.toString();
    }
  }
}
