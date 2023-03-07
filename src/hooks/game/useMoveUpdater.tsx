import { useEffect } from "react";
import { board, updateLastMoveProps, inStalemate, lastMove, Move } from "../../board";
import getAvailableMovesTest, { getAllAvailableMovesTest } from "../../game/getAvailableMoves";
import { EndGameState, Teams, WinStates } from "../../properties";

export default function useMoveUpdater(
  currentTurn: Teams,
  setMoveHistory: React.Dispatch<React.SetStateAction<Move[]>>,
  setGameEnding: React.Dispatch<React.SetStateAction<EndGameState>>,
  setGameOverOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (!lastMove) return;
    setMoveHistory((moveHistory) => [...moveHistory, lastMove!]);

    // See if the game is over
    // Doing this so that when it checks for moves, it doesn't update the last move
    // This is so it doesn't show the wrong last move for the highlights on the board
    // This is a very hacky way to do this, but it works well, is easy to understand, and is easy to implement
    // To implement it properly, I'd have to add a paramter to many different functions and it would be a mess
    updateLastMoveProps.updateLastMove = false;

    const availableMoves = getAllAvailableMovesTest(currentTurn);
    if (availableMoves.length === 0) {
      const staleMate = inStalemate(currentTurn);

      if (staleMate) setGameEnding({ isOver: true, winningTeam: Teams.None, wonBy: WinStates.Stalemate });
      else {
        const winningTeam = currentTurn === Teams.White ? Teams.Black : Teams.White;
        setGameEnding({ isOver: true, winningTeam, wonBy: WinStates.Checkmate });
      }

      setGameOverOpen(true);
    }

    updateLastMoveProps.updateLastMove = true;
  }, [currentTurn]);
}
