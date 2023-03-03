import { useEffect } from "react";
import { Move } from "../../board";
import getBestMoveTest from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default function useAITest(currentTurn: Teams, aiTeam: Teams, setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>) {
  useEffect(() => {
    if (currentTurn !== aiTeam) return;

    // Before making the move, we need to wait for the animation and the board to update
    // and the sound to play as minimax will freeze the browser if we don't wait

    setTimeout(() => {
      const bestMove = getBestMoveTest(aiTeam);

      // console.log("AI took " + (end - start) + "ms to find best move.");

      if (bestMove) {
        makeMove(bestMove.move.from, bestMove.move.to, bestMove.move.castle, bestMove.move.enPassant, bestMove.move.promoteTo);
        setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
      }
    }, 500);
  }, [currentTurn]);
}
