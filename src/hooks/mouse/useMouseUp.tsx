import { useEffect } from "react";
import getSpot from "../../helpers/getSpot";

import { Move } from "../../board";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";
import centerPieces from "../../helpers/centerPieces";

type Props = {
  setMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  availableMoves: Move[];
  mouseDown: boolean;
  selectedPiece: number | null;
  setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>;
  setAvailableMoves: React.Dispatch<React.SetStateAction<Move[]>>;
  setSelectedPiece: React.Dispatch<React.SetStateAction<number | null>>;
  setHoveredPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  setPromotionPosition: React.Dispatch<React.SetStateAction<number>>;
  setPromotion: React.Dispatch<React.SetStateAction<Move | null>>;
};
export default function useMouseUp({
  setMouseDown,
  availableMoves,
  selectedPiece,
  setCurrentTurn,
  setAvailableMoves,
  setSelectedPiece,
  mouseDown,
  setHoveredPosition,
  setPromotionPosition,
  setPromotion,
}: Props) {
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseDown) return;
      setMouseDown(false);
      setHoveredPosition(null);

      const position = getSpot(e);
      if (position === null) return;

      const index = position.x + position.y * 8;

      // Find the move that matches the position
      const move = availableMoves.find((move) => move.to === index && move.from === selectedPiece);

      if (move) {
        if (move.promoteTo) {
          setPromotionPosition(move.to);
          setPromotion(move);
          return;
        }

        makeMove(move.from, move.to, move.castle, move.enPassant, move.promoteTo);
        setCurrentTurn((prevTurn) => (prevTurn === Teams.White ? Teams.Black : Teams.White));
        setAvailableMoves([]);
        setSelectedPiece(null);
      } else centerPieces();
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [availableMoves, selectedPiece, mouseDown]);
}
