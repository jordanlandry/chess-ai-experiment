import { useEffect } from "react";
import openings from "../../database/openings";
import { generateOpenings } from "../../game/ai/db/openings";
import getBestMove from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import { boardToKey, MinimaxProps, MinimaxReturn, Moves, PieceType, PromotionPieceType, Teams } from "../../properties";

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
    maxDepth: 0, // This does nothing when the time limit is being used
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: true,
    doQuiescence: true,
  };

  useEffect(() => {
    if (whosTurn !== aiTeam) return;

    setTimeout(() => {
      // Check if board is in database, if so, get best move from database
      // If not, run minimax algorithm

      // Openings
      const boardHash = boardToKey(board, aiTeam === Teams.White);
      const openings = generateOpenings();

      if (openings[boardHash]) {
        setTimeout(() => {
          const bestMove = openings[boardHash];
          console.log("Opening found!");

          movePiece(board, bestMove, setStateProps);
        }, minimaxProps.maxTime / 2);
      }

      // No openings (run minimax)
      else {
        const bestMove = getBestMove(board, minimaxProps);
        movePiece(board, bestMove.move, setStateProps);
        setStateProps.setMinimaxMove(bestMove);
      }
    }, 500);
  }, [whosTurn, board]);
}
