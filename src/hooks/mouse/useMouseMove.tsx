import { useEffect } from "react";
import clamp from "../../helpers/clamp";
import getBoardBound from "../../helpers/getBoardBound";
import getMouseSpot from "../../helpers/getMouseSpot";
import useLoad from "../useLoad";

type Props = {
  mouseDown: boolean;
  selectedPiece: number | null;
  setHoveredPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
};
export default function useMouseMove({ mouseDown, selectedPiece, setHoveredPosition }: Props) {
  const loaded = useLoad();

  useEffect(() => {
    if (!loaded) return;
    const handleMove = (e: MouseEvent) => {
      if (!mouseDown) return;

      // Can't do !selectedPiece because 0 is a valid piece
      if (selectedPiece === null) return;

      const position = getMouseSpot(e);

      if (position !== null) {
        const x = position % 8;
        const y = Math.floor(position / 8);

        setHoveredPosition({ x, y });
      }

      const { boardLeft, boardTop, boardWidth } = getBoardBound();

      const pieceElement = document.getElementById(selectedPiece.toString());
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
      pieceElement.style.zIndex = "1000";
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [loaded, selectedPiece, mouseDown]);
}
