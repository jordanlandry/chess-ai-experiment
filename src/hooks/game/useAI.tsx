import { useEffect, useState } from "react";
import { board, readableBoard } from "../../board";
import { openings } from "../../game/ai/db/openings";
import getBestMoveTest from "../../game/ai/minimax";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default async function useAITest(currentTurn: Teams, aiTeam: Teams, setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>) {
  useEffect(() => {
    if (currentTurn !== aiTeam) return;

    for (let i = 0; i < openings.length; i++) {
      const opening = openings[i];
      if (JSON.stringify(opening.board) !== JSON.stringify(readableBoard)) continue;

      const move = opening.responses[Math.floor(Math.random() * opening.responses.length)];
      makeMove(move.from, move.to, move.castle, move.enPassant, move.promoteTo);
      setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
      return;
    }

    const stringBoard = JSON.stringify(board);
    fetch(`${import.meta.env.VITE_SERVER_URI}/best_move/${stringBoard}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const bestMove = data;
        if (bestMove) {
          // makeMove(bestMove.move.from, bestMove.move.to, bestMove.move.castle, bestMove.move.enPassant, bestMove.move.promoteTo);
          makeMove(bestMove.from, bestMove.to, undefined, undefined, undefined);
          setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
        }
      });
  }, [currentTurn]);
}
