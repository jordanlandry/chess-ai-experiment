import { useEffect } from "react";
import { Move } from "../../board";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default function usePiecePromotion(
  promotion: Move | null,
  promotionPiece: number,
  setPromotion: React.Dispatch<React.SetStateAction<Move | null>>,
  setPromotionPiece: React.Dispatch<React.SetStateAction<number>>,
  setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>
) {
  useEffect(() => {
    if (promotion === null || promotionPiece === 0) return;

    makeMove(promotion.from, promotion.to, undefined, undefined, promotionPiece);

    setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));

    setPromotion(null);
    setPromotionPiece(0);
  }, [promotion, promotionPiece]);
}
