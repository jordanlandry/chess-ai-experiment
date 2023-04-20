import React, { useContext, useEffect, useState } from "react";
import { Board, IPiece, Move, Position, PromotionPiece, Team } from "../types";
import useBoardBound from "../hooks/useBoardBound";
import { Store } from "../App";
import Modal from "./Modal";

type Props = {
  position: Position;
  board: Board;
  team: Team;
  promotePiece: (piece: PromotionPiece | null, move: Move) => void;
  move: Move | null;
};

export default function PromotionSelect({ position, board, team, promotePiece, move }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  const { pieceStyle } = useContext(Store);
  const [highlightedPiece, setHighlightedPiece] = useState<number>(-1);
  const promotionPieces = team === "black" ? (["r", "n", "b", "q"] as PromotionPiece[]) : (["R", "N", "B", "Q"] as PromotionPiece[]);

  const HIGHLIGHTED_STYLE: React.CSSProperties = {
    backgroundColor: "rgb(200, 200, 200)",
    outline: "2px solid black",
    outlineOffset: "-2px",
  };

  const c = team === "white" ? "0" : "1";

  const onClick = (piece: PromotionPiece | null) => {
    promotePiece(piece, move!);
    setHighlightedPiece(-1);
  };

  return (
    <Modal open={position.x !== -1} onClose={() => onClick(null)}>
      <div
        style={{
          display: "flex",
          left: boardLeft + position.x * squareSize + "px",
          top: boardTop + position.y * squareSize + "px",
          width: squareSize * 4 + "px",
          height: squareSize + "px",
          zIndex: 500,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {promotionPieces.map((piece, i) => {
          const img = `./assets/images/styles/${pieceStyle}/${piece.toLowerCase()}${c}.png`;
          return (
            <button
              onClick={() => onClick(piece)}
              key={piece}
              className="unstyled-button"
              onMouseEnter={() => setHighlightedPiece(i)}
              onMouseLeave={() => setHighlightedPiece(-1)}
            >
              <img
                src={img}
                alt={piece}
                width={squareSize}
                height={squareSize}
                draggable={false}
                style={highlightedPiece === i ? HIGHLIGHTED_STYLE : {}}
              />
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
