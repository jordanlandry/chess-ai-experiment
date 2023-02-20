import React from "react";
import getBoardBound from "../helpers/getBoardBound";
import { PiecesType, PieceType, PromotionPieceType, Teams } from "../properties";
import Piece from "./Piece";

type Props = {
  team: Teams;
  x: number;
  y: number;
  setIsPromoting: React.Dispatch<React.SetStateAction<boolean>>;
  setPromotionPiece: React.Dispatch<React.SetStateAction<PromotionPieceType>>;
  setPromotedPieces: React.Dispatch<React.SetStateAction<PromotionPieceType[]>>;
};

let currentId = 64;
export default function Promotion({ team, x, y, setIsPromoting, setPromotionPiece, setPromotedPieces }: Props) {
  const { boardLeft, boardTop, squareSize } = getBoardBound();

  const handleSelectPiece = (piece: PromotionPieceType) => {
    setPromotionPiece(piece);
    setIsPromoting(false);
    setPromotedPieces((prevPieces) => [...prevPieces, piece]);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: boardLeft + x * squareSize,
        top: boardTop,
        width: squareSize,
        backgroundColor: "white",
        borderRadius: "0.25rem",
        zIndex: 101,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Piece
        color={team}
        piece={PiecesType.Queen}
        id="promotion-queen"
        display="block"
        onClick={() => handleSelectPiece({ piece: PiecesType.Queen, color: team, id: currentId++, hasMoved: true, x: x, y: y, promotionPiece: true })}
      />
      <Piece
        color={team}
        piece={PiecesType.Rook}
        id="promotion-rook"
        display="block"
        onClick={() => handleSelectPiece({ piece: PiecesType.Rook, color: team, id: currentId++, hasMoved: true, x: x, y: y, promotionPiece: true })}
      />
      <Piece
        color={team}
        piece={PiecesType.Bishop}
        id="promotion-bishop"
        display="block"
        onClick={() =>
          handleSelectPiece({ piece: PiecesType.Bishop, color: team, id: currentId++, hasMoved: true, x: x, y: y, promotionPiece: true })
        }
      />
      <Piece
        color={team}
        piece={PiecesType.Knight}
        id="promotion-knight"
        display="block"
        onClick={() => handleSelectPiece({ piece: PiecesType.Knight, color: team, id: currentId++, hasMoved: true, x: x, y: y })}
      />
    </div>
  );
}
