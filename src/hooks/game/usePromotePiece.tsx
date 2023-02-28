import { useEffect } from "react";
import { PiecesType, PieceType, PromotionPieceType, Teams } from "../../properties";

export default function usePromotePiece(
  promotionPiece: PromotionPieceType,
  isPromoting: boolean,
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

    // setIsPromoting((prev) => {
    // This if statement is to prevent it from running twice when the AI is promoting a piece
    // as prev will be false when the AI is promoting a piece (as it's only used for the promotion component to select a piece)

    // if (prev) setTurn((prevTurn) => (prevTurn === Teams.White ? Teams.Black : Teams.White));
    // return false;
    // });
  }, [promotionPiece]);

  useEffect(() => {
    if (!isPromoting) setTurn((prev) => (prev === Teams.White ? Teams.Black : Teams.White));
  }, [isPromoting]);
}
