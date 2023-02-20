import { useContext, useEffect, useState } from "react";
import { PieceStyleContext } from "../App";
import useBoardBound from "../hooks/useBoardBound";
import properties, { PiecesType, STARTING_BOARD, Teams } from "../properties";

type Props = {
  id: number | string;
  piece: PiecesType;
  color: Teams;
  onClick?: () => void;
  display?: "none" | "block";
};

export default function Piece({ id, color, piece, display, onClick }: Props) {
  const pieceStyle = useContext(PieceStyleContext);

  const c = color === Teams.White ? "0" : "1";
  const src = "./assets/images/styles/" + pieceStyle + "/" + piece.toLowerCase() + c + ".png";

  const { squareSize } = useBoardBound();

  return (
    <img
      src={piece ? src : ""}
      alt={piece}
      width={squareSize}
      id={id + ""}
      draggable={false}
      style={{ fontSize: "2rem", cursor: "grab", display: display ? display : "none" }}
      onClick={onClick}
    />
  );
}
