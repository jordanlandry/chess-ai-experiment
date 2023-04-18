import { useEffect, useState } from "react";
import getBoardBound from "../../helpers/getBoardBound";
import getMouseSpot from "../../helpers/getMouseSpot";
import { Board, Move, Position, Team } from "../../types";

type Props = {
  board: Board;
  availableMoves: Move[];
  setSelectedPosition: React.Dispatch<React.SetStateAction<Position | null>>;
  currentTurn: Team;
  makeMove: (move: Move) => void;
  aiThinking: boolean;
};
export default function useDragPiece({ board, availableMoves, setSelectedPosition, makeMove, aiThinking }: Props) {
  const [clickPosition, setClickPosition] = useState<Position | null>(null);

  function revertPiece() {
    if (!clickPosition) return;
    const piece = document.getElementById(board[clickPosition!.y][clickPosition!.x].id.toString());
    if (!piece) {
      setClickPosition(null);
      return;
    }

    const { boardLeft, boardTop, squareSize } = getBoardBound();
    piece.style.transition = "left 0.2s, top 0.2s";
    piece.style.left = boardLeft + clickPosition!.x * squareSize + "px";
    piece.style.top = boardTop + clickPosition!.y * squareSize + "px";
    piece.style.zIndex = "2";
  }

  useEffect(() => {
    if (aiThinking) {
      setClickPosition(null);
      return;
    }

    const handleMove = (e: MouseEvent) => {
      if (!clickPosition) return;

      const { x, y } = clickPosition;
      const piece = document.getElementById(board[y][x].id.toString());
      if (!piece) return;

      piece.style.transition = "none";
      piece.style.zIndex = "100";
      piece.style.left = e.clientX - piece.clientWidth / 2 + "px";
      piece.style.top = e.clientY - piece.clientHeight / 2 + "px";
    };

    const handleDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // 0 = left click
      setClickPosition(getMouseSpot(e));
    };

    const handleUp = (e: MouseEvent) => {
      if (e.button !== 0) return; // 0 = left click
      const position = getMouseSpot(e);
      if (!position) {
        setClickPosition(null);
        revertPiece();
        return;
      }

      const { x, y } = position;

      const move = availableMoves.find((move) => move.to.x === x && move.to.y === y);
      if (move) {
        makeMove(move);
        setSelectedPosition(null);
      } else revertPiece();

      setClickPosition(null);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [clickPosition, board, availableMoves, aiThinking]);
}
