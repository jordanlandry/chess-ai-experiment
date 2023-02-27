import { useEffect } from "react";
import { generateOpenings } from "../../game/ai/db/openings";
import getBestMove from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import { boardToKey, MinimaxReturn, Moves, PieceType, PromotionPieceType, Teams } from "../../properties";

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
    maxDepth: 6,
    useTimeLimit: true,
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: true,
    doQuiescence: true,
    doNullMove: true,
  };

  useEffect(() => {
    if (whosTurn !== aiTeam) return;

    setTimeout(() => {
      // Check if board is in database, if so, get best move from database, if not, run minimax algorithm

      // Openings
      const boardHash = boardToKey(board, aiTeam === Teams.White);
      const openings = generateOpenings();

      if (openings[boardHash]) {
        // prettier-ignore
        setTimeout(() => {
          const bestMove = openings[boardHash];
          movePiece(board, bestMove, setStateProps);
        }, minimaxProps.useTimeLimit ? minimaxProps.maxTime / 2 : 1000);
      }

      // No openings (run minimax)
      else {
        const bestMove = getBestMove(board, minimaxProps);
        // console.log(bestMove);
        movePiece(board, bestMove.move, setStateProps);
        setStateProps.setMinimaxMove(bestMove);
      }
    }, 500);
  }, [whosTurn, board]);
}
