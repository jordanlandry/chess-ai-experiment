import { useEffect } from "react";
import clamp from "../../helpers/clamp";
import getBoardBound from "../../helpers/getBoardBound";
import { PieceType } from "../../properties";
import useLoad from "../useLoad";

export default function useMouseMove(mouseDown: boolean, selectedPiece: PieceType) {
  const loaded = useLoad();
  useEffect(() => {
    if (!loaded) return;
    const handleMove = (e: MouseEvent) => {
      // const mouseDown = getCurrentValue(setMouseDown);
      if (!mouseDown) return;

      // const selectedPiece = getCurrentValue(setSelectedPiece) as SelectedPiece;

      if (!selectedPiece) return;

      const { boardLeft, boardTop, boardWidth } = getBoardBound();

      const pieceElement = document.getElementById(selectedPiece.id.toString());
      if (!pieceElement) return;

      const left = clamp(
        e.clientX - pieceElement.clientWidth / 2,
        boardLeft - pieceElement.clientWidth / 2,
        boardLeft + boardWidth - pieceElement.clientWidth + pieceElement.clientWidth / 2
      );

      const top = clamp(
        e.clientY - pieceElement.clientHeight / 2,
        boardTop - pieceElement.clientHeight / 2,
        boardTop + boardWidth - pieceElement.clientHeight / 2
      );

      pieceElement.style.transition = "none";
      pieceElement.style.left = `${left}px`;
      pieceElement.style.top = `${top}px`;
      pieceElement.style.zIndex = "100";
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [loaded, selectedPiece, mouseDown]);
}
