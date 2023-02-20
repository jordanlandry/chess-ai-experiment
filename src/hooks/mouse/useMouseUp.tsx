import { useEffect } from "react";
import getSpot from "../../helpers/getSpot";
import properties, { Moves, PiecesType, PieceType } from "../../properties";
import useBoardBound from "../useBoardBound";

import centerPieces from "../../helpers/centerPieces";
import { Teams } from "../../properties";
import { movePiece } from "../../game/movePiece";
import findPositionById from "../../helpers/findPositionById";

export default function useMouseUp(
  board: PieceType[][],
  whosTurn: Teams,
  availableMoves: Moves[],
  props: {
    setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>;
    setSelectedPiece: React.Dispatch<React.SetStateAction<PieceType>>;
    setTurn: React.Dispatch<React.SetStateAction<Teams>>;
    setAvailableMoves: React.Dispatch<React.SetStateAction<Moves[]>>;
    setMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
    setMoveHistory: React.Dispatch<React.SetStateAction<Moves[]>>;
    setBoardHistory: React.Dispatch<React.SetStateAction<PieceType[][][]>>;
  }
) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  const { setBoard, setSelectedPiece, setTurn, setAvailableMoves, setMouseDown, setMoveHistory, setBoardHistory } = props;

  // You can either select a piece or drag a piece
  // When you're not dragging a piece, letting go of the mouse should do nothing
  // When you are dragging a piece, letting go of the mouse should drop the piece
  useEffect(() => {
    const handleUp = (e: MouseEvent) => {
      const { x: newX, y: newY } = getSpot(e);

      setMouseDown(false);
      setSelectedPiece((prev) => {
        if (prev.piece === PiecesType.None) return prev; // No piece selected

        if (whosTurn !== prev.color) {
          centerPieces(board, properties.animationTimeMs);
          return prev;
        } // Not your turn

        // If your mouse lets go on the same square you clicked on, keep the piece selected and do nothing
        const { x: prevX, y: prevY } = findPositionById(board, prev.id);

        const { x, y } = getSpot(e);
        if (prevX === x && prevY === y) {
          centerPieces(board, properties.animationTimeMs);
          return prev;
        }

        // The rest of the code is for when you let go when dragging a piece
        const move = availableMoves.find((move) => move.to.x === newX && move.to.y === newY);

        if (!move) {
          centerPieces(board, properties.animationTimeMs);
          return prev;
        }

        movePiece(board, move, { setBoard, setAvailableMoves, setTurn, setMoveHistory, setBoardHistory });

        return { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
      });
    };

    document.addEventListener("mouseup", handleUp);
    return () => document.removeEventListener("mouseup", handleUp);
  }, [board, whosTurn, availableMoves]);
}
