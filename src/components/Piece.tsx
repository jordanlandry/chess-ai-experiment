import { useContext, useEffect, useRef, useState } from "react";
import { Board, Position, TPiece } from "../types";
import useBoardBound from "../hooks/useBoardBound";
import { Store } from "../App";
import getTeam from "../helpers/getTeam";

type Props = {
  position: Position;
  piece: TPiece;
  board: Board;
  id: number;
};

export default function Piece({ position, piece, board, id }: Props) {
  const { squareSize, boardLeft, boardTop } = useBoardBound();
  const [pixelPosition, setPixelPosition] = useState<Position>(getPosition());

  const { pieceStyle } = useContext(Store);

  const c = getTeam(board, position) === "white" ? "0" : "1";
  const src = "./assets/images/styles/" + pieceStyle + "/" + piece.toLowerCase() + c + ".png";

  function getPosition() {
    const x = position.x * squareSize + boardLeft;
    const y = position.y * squareSize + boardTop;
    return { x, y };
  }

  useEffect(() => {
    setPixelPosition(getPosition());
  }, [position, boardLeft, boardTop, squareSize]);

  if ((pixelPosition.x === 0, pixelPosition.y === 0)) return null;

  return (
    <img
      loading="lazy"
      draggable={false}
      src={src}
      alt={piece}
      id={id.toString()}
      style={{
        position: "absolute",
        left: pixelPosition.x,
        top: pixelPosition.y,
        width: squareSize,
        height: squareSize,
        zIndex: 2,
        cursor: "grab",
      }}
    />
  );
}
