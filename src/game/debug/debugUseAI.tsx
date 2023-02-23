import { useEffect } from "react";
import getBestMove from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import { MinimaxProps, MinimaxReturn, Moves, PieceType, PromotionPieceType, Teams } from "../../properties";

export default function debugUseAI(
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
    setMinimaxMoves: React.Dispatch<React.SetStateAction<MinimaxReturn[]>>;
  }
) {
  const minimaxProps = {
    aiIsWhite: aiTeam === Teams.White,
    difficulty: 3,
    maxTime: 2500,
    maxDepth: 5,
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: false,
    doQuiescence: true,
  };

  useEffect(() => {
    if (whosTurn !== aiTeam) return;

    minimaxProps.doAlphaBeta = false;
    minimaxProps.doTranspositionTable = false;
    minimaxProps.doMoveOrdering = false;
    minimaxProps.doQuiescence = false;

    setTimeout(() => {
      const bestMove1 = getBestMove(board, minimaxProps);
      setStateProps.setMinimaxMoves((prev) => [...prev, bestMove1]);

      minimaxProps.doAlphaBeta = true;
      const bestMove2 = getBestMove(board, minimaxProps);
      setStateProps.setMinimaxMoves((prev) => [...prev, bestMove2]);

      minimaxProps.doTranspositionTable = true;
      const bestMove3 = getBestMove(board, minimaxProps);
      setStateProps.setMinimaxMoves((prev) => [...prev, bestMove3]);

      minimaxProps.doMoveOrdering = true;
      const bestMove4 = getBestMove(board, minimaxProps);
      setStateProps.setMinimaxMoves((prev) => [...prev, bestMove4]);
    }, 200);
  }, [whosTurn, board]);
}
