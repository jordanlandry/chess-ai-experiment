import { useEffect } from "react";
import nextId from "react-id-generator";
import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  WhiteBishops,
  WhiteKing,
  WhiteKnights,
  WhitePawns,
  WhiteQueens,
  WhiteRooks,
} from "../board";
import { PiecesType, Teams } from "../properties";
import Piece from "./Piece";

export default function Pieces() {
  const pieces: JSX.Element[] = [];

  WhitePawns.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Pawn} color={Teams.White} />));
  WhiteRooks.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Rook} color={Teams.White} />));
  WhiteKnights.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Knight} color={Teams.White} />));
  WhiteBishops.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Bishop} color={Teams.White} />));
  WhiteQueens.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Queen} color={Teams.White} />));
  pieces.push(<Piece key={nextId()} id={WhiteKing[0]} pos={WhiteKing[0]} piece={PiecesType.King} color={Teams.White} />);

  BlackPawns.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Pawn} color={Teams.Black} />));
  BlackRooks.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Rook} color={Teams.Black} />));
  BlackKnights.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Knight} color={Teams.Black} />));
  BlackBishops.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Bishop} color={Teams.Black} />));
  BlackQueens.forEach((pos) => pieces.push(<Piece key={nextId()} id={pos} pos={pos} piece={PiecesType.Queen} color={Teams.Black} />));
  pieces.push(<Piece key={nextId()} id={BlackKing[0]} pos={BlackKing[0]} piece={PiecesType.King} color={Teams.Black} />);

  return <div>{pieces}</div>;
}
