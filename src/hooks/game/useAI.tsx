import { useEffect } from "react";
import { readableBoard } from "../../board";
import { openings } from "../../game/ai/db/openings";
import getBestMoveTest from "../../game/ai/minimax";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default function useAITest(currentTurn: Teams, aiTeam: Teams, setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>) {
  useEffect(() => {
    if (currentTurn !== aiTeam) return;

    setTimeout(() => {
      console.log(JSON.stringify(readableBoard));
      console.log(JSON.stringify(openings[0].board));
      console.log(JSON.stringify(openings[0].board) === JSON.stringify(readableBoard));
      for (let i = 0; i < openings.length; i++) {
        const opening = openings[i];
        if (JSON.stringify(opening.board) !== JSON.stringify(readableBoard)) continue;

        const move = opening.responses[Math.floor(Math.random() * opening.responses.length)];
        makeMove(move.from, move.to, move.castle, move.enPassant, move.promoteTo);
        setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
        return;
      }

      const bestMove = getBestMoveTest(aiTeam);

      console.log("Score: " + bestMove.score);
      console.log("Move: ", bestMove.move);

      if (bestMove) {
        makeMove(bestMove.move.from, bestMove.move.to, bestMove.move.castle, bestMove.move.enPassant, bestMove.move.promoteTo);
        setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
      }
    }, 500);
  }, [currentTurn]);
}
