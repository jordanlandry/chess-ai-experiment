import { useContext, useEffect, useState } from "react";
import { BoardColorContext, PieceStyleContext } from "../App";
import useWidth from "../hooks/useWidth";
import properties from "../properties";

type Props = {
  idx: number;
};

export default function Piece({ idx }: Props) {
  const pieceStyle = useContext(PieceStyleContext);

  const pieceType = properties.numToPiece[idx];
  const color = pieceType.toLowerCase() === pieceType ? 1 : 0;
  const src = "./assets/images/styles/" + pieceStyle + "/" + pieceType.toLowerCase() + color + ".png";

  const width = useWidth();

  const [w, setW] = useState(0);

  useEffect(() => {
    const board = document.getElementById("board");

    if (board) setW(board.clientWidth / 8);
  }, [width]);

  return (
    <img
      src={src}
      alt={pieceType}
      width={w}
      id={idx + ""}
      draggable={false}
      style={{ position: "absolute", fontSize: "2rem", cursor: "grab" }}
    />
  );
}
