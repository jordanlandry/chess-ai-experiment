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
    setPromotionPiece: React.Dispatch<React.SetStateAction<PromotionPieceType>>;
  }
) {
  const minimaxProps = {
    aiIsWhite: aiTeam === Teams.White,
    difficulty: 3,
    maxTime: 2500,
    maxDepth: 6,
    useTimeLimit: false,
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: true,
    doQuiescence: true,
    doNullMove: true,
  };

  useEffect(() => {
    if (whosTurn !== aiTeam) return;

    minimaxProps.doAlphaBeta = true;
    minimaxProps.doTranspositionTable = false;
    minimaxProps.doMoveOrdering = false;
    minimaxProps.doQuiescence = false;
    minimaxProps.doNullMove = false;

    setTimeout(() => {
      // const bestMove1 = getBestMove(board, minimaxProps);
      // setStateProps.setMinimaxMoves((prev) => [...prev, bestMove1]);

      // minimaxProps.doTranspositionTable = true;
      // const bestMove2 = getBestMove(board, minimaxProps);
      // setStateProps.setMinimaxMoves((prev) => [...prev, bestMove2]);

      // minimaxProps.doMoveOrdering = true;
      // const bestMove3 = getBestMove(board, minimaxProps);
      // setStateProps.setMinimaxMoves((prev) => [...prev, bestMove3]);

      minimaxProps.doNullMove = true;
      const bestMove4 = getBestMove(board, minimaxProps);
      setStateProps.setMinimaxMoves((prev) => [...prev, bestMove4]);
    }, 200);
  }, [whosTurn, board]);
}
