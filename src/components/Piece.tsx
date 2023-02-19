import { useContext, useEffect, useState } from "react";
import { PieceStyleContext } from "../App";
import useBoardBound from "../hooks/useBoardBound";
import useWidth from "../hooks/useWidth";
import properties, { PiecesType, STARTING_BOARD, Teams } from "../properties";

type Props = {
  idx: number;
};

export default function Piece({ idx }: Props) {
  const pieceStyle = useContext(PieceStyleContext);
  const aiIsWhite = properties.aiIsWhite;

  const piece = STARTING_BOARD.flat().find((piece) => piece.id === idx)!;

  const pieceType = piece.piece;
  const color = piece.color === Teams.White ? "0" : "1";
  const src = "./assets/images/styles/" + pieceStyle + "/" + pieceType.toLowerCase() + color + ".png";

  const { squareSize } = useBoardBound();

  return (
    <img
      src={pieceType ? src : ""}
      alt={pieceType}
      width={squareSize}
      id={idx + ""}
      draggable={false}
      style={{ position: "absolute", fontSize: "2rem", cursor: "grab", display: "none" }}
    />
  );
}
