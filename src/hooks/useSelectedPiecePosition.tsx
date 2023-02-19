import { useEffect, useState } from "react";
import findPositionById from "../helpers/findPositionById";
import { PieceType } from "../properties";

export function useSelectedpiecePosition(board: PieceType[][], selectedPiece: PieceType) {
  const [{ selectedPieceX, selectedPieceY }, setPosition] = useState({
    selectedPieceX: 0,
    selectedPieceY: 0,
  });

  useEffect(() => {
    if (selectedPiece.id === -1) {
      setPosition({ selectedPieceX: -1, selectedPieceY: -1 });
      return;
    }
    const { x, y } = findPositionById(board, selectedPiece.id);

    setPosition({ selectedPieceX: x, selectedPieceY: y });
  }, [selectedPiece]);

  return { selectedPieceX, selectedPieceY };
}
