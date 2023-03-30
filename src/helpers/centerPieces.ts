import { board } from "../board";
import properties, { PieceType } from "../properties";
import getBoardBound from "./getBoardBound";

export default function centerPieces() {
  const { boardLeft, boardTop, squareSize } = getBoardBound();

  board.forEach((_, i) => {
    const piece = document.getElementById(i + "");

    if (!piece) return;

    const x = (i % 8) * squareSize;
    const y = Math.floor(i / 8) * squareSize;

    piece.style.position = "absolute";
    piece.style.left = boardLeft + x + "px";
    piece.style.top = boardTop + y + "px";

    piece.style.transition = properties.animationTimeMs + "ms";
    piece.style.display = "block";

    piece.style.zIndex = "1";
  });
}
