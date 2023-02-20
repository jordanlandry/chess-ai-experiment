import { PieceType } from "../properties";
import getBoardBound from "./getBoardBound";

export default function centerPieces(board: PieceType[][], animationTimeMs: number) {
  const { boardLeft, boardTop, squareSize } = getBoardBound();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece.piece) continue;

      // Center the piece
      const pieceElement = document.getElementById(piece.id.toString());
      if (!pieceElement) continue;

      pieceElement.style.position = "absolute";
      pieceElement.style.display = "block";
      pieceElement.style.transition = `all ${animationTimeMs}ms ease-in-out`;
      pieceElement.style.left = `${boardLeft + j * squareSize + squareSize / 2 - pieceElement.clientWidth / 2}px`;
      pieceElement.style.top = `${boardTop + i * squareSize + squareSize / 2 - pieceElement.clientHeight / 2}px`;
      pieceElement.style.zIndex = "1";
    }
  }
}
