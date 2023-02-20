import { useEffect } from "react";
import { PiecesType, PieceType, PromotionPieceType, Teams } from "../../properties";

export default function usePromotePiece(
  promotionPiece: PromotionPieceType,
  setPromotionPiece: React.Dispatch<React.SetStateAction<PromotionPieceType>>,
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  setIsPromoting: React.Dispatch<React.SetStateAction<boolean>>,
  setTurn: React.Dispatch<React.SetStateAction<Teams>>
) {
  useEffect(() => {
    if (promotionPiece.piece === PiecesType.None) return;
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[promotionPiece.y][promotionPiece.x] = promotionPiece;
      return newBoard;
    });

    setPromotionPiece({ piece: PiecesType.None, color: Teams.None, x: -1, y: -1, id: -1 });
    setIsPromoting(false);
    setTurn((prevTurn) => (prevTurn === Teams.White ? Teams.Black : Teams.White));
  }, [promotionPiece]);
}
