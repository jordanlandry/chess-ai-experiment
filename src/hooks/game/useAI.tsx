import { useEffect } from "react";
import getBestMoveTest from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default function useAITest(currentTurn: Teams, aiTeam: Teams, setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>) {
  useEffect(() => {
    if (currentTurn !== aiTeam) return;

    const start = Date.now();
    const bestMove = getBestMoveTest(aiTeam);
    const end = Date.now();

    console.log("AI took " + (end - start) + "ms to find best move.");

    if (bestMove) {
      makeMove(bestMove.move.from, bestMove.move.to);
      setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
    }
  }, [currentTurn]);
}
