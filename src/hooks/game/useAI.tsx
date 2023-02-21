import { useEffect } from "react";
import getBestMove from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import { MinimaxProps, MinimaxReturn, Moves, PieceType, PromotionPieceType, Teams } from "../../properties";

export default function useAI(
  board: PieceType[][],
  whosTurn: Teams,
  aiTeam: Teams,
  setStateProps: {
    setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>;
    setTurn: React.Dispatch<React.SetStateAction<Teams>>;
    setAvailableMoves: React.Dispatch<React.SetStateAction<Moves[]>>;
    setMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
    setMoveHistory: React.Dispatch<React.SetStateAction<Moves[]>>;
    setBoardHistory: React.Dispatch<React.SetStateAction<PieceType[][][]>>;
    setIsPromoting: React.Dispatch<React.SetStateAction<boolean>>;
    setPromotedPieces: React.Dispatch<React.SetStateAction<PromotionPieceType[]>>;
    setMinimaxMove: React.Dispatch<React.SetStateAction<MinimaxReturn>>;
  }
) {
  const minimaxProps = {
    aiIsWhite: aiTeam === Teams.White,
    difficulty: 3,
    maxTime: 2500,
    maxDepth: 7,
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: false,
    doQuiescence: true,
  };

  useEffect(() => {
    if (whosTurn !== aiTeam) return;

    setTimeout(() => {
      const bestMove = getBestMove(board, minimaxProps);
      movePiece(board, bestMove.move, setStateProps);
      setStateProps.setMinimaxMove(bestMove);
    }, 500);
  }, [whosTurn, board]);
}
