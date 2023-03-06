import { useEffect } from "react";
import getBestMoveTest from "../../game/ai/minimax";
import makeMove from "../../helpers/makeMove";
import { makeMoveNew } from "../../helpers/makeMoveNew";
import { Teams } from "../../properties";
import { printBoard, testBoard } from "../../Testing/testBoard";

export default function useAITest(currentTurn: Teams, aiTeam: Teams, setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>) {
  useEffect(() => {
    if (currentTurn !== aiTeam) return;

    // Before making the move, we need to wait for the animation and the board to update
    // and the sound to play as minimax will freeze the browser if we don't wait

    setTimeout(() => {
      const bestMove = getBestMoveTest(aiTeam);

      if (bestMove) {
        makeMoveNew(bestMove.move);
        setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
      }
      console.log({ score: bestMove.score });
    }, 500);

    // console.log(bestMove);
    // printBoard();

    // if (bestMove) {
    //   makeMove(bestMove.move.from, bestMove.move.to, bestMove.move.castle, bestMove.move.enPassant, bestMove.move.promoteTo);
    //   setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
    // }
    // }, );
  }, [currentTurn]);
}
