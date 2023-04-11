import { useContext, useEffect } from "react";
import { Board, Move, MoveEvaluation, Team } from "../types";
import evaluateMove from "../helpers/evaluateMove";

type Props = {
  board: Board;
  makeMove: (move: Move) => void;
  aiTeam: Team;
  currentTurn: Team;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setMoveEvaluation: React.Dispatch<React.SetStateAction<MoveEvaluation>>;
  setDepth: React.Dispatch<React.SetStateAction<number>>;
};

export default async function useAI({ board, makeMove, aiTeam, currentTurn, setScore, score, setMoveEvaluation, setDepth }: Props) {
  useEffect(() => {
    if (aiTeam !== currentTurn) return;

    const formmatedBoard = new Array(64);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const count = i * 8 + j;

        if (board[i][j].piece === "P") formmatedBoard[count] = 32;
        else if (board[i][j].piece === "R") formmatedBoard[count] = 1;
        else if (board[i][j].piece === "N") formmatedBoard[count] = 2;
        else if (board[i][j].piece === "B") formmatedBoard[count] = 4;
        else if (board[i][j].piece === "Q") formmatedBoard[count] = 8;
        else if (board[i][j].piece === "K") formmatedBoard[count] = 16;
        else if (board[i][j].piece === "p") formmatedBoard[count] = -32;
        else if (board[i][j].piece === "r") formmatedBoard[count] = -1;
        else if (board[i][j].piece === "n") formmatedBoard[count] = -2;
        else if (board[i][j].piece === "b") formmatedBoard[count] = -4;
        else if (board[i][j].piece === "q") formmatedBoard[count] = -8;
        else if (board[i][j].piece === "k") formmatedBoard[count] = -16;
        else formmatedBoard[count] = 0;
      }
    }

    const stringBoard = JSON.stringify(formmatedBoard);

    const maxTime = 2500;
    const maxDepth = 8;
    const startTime = Date.now();

    const controller = new AbortController();

    // Abort the fetch request if it takes too long
    // setTimeout(() => {
    //   controller.abort();
    // }, maxTime);

    let currentBestMove: Move = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };
    let lastScore = score;

    const evaluationDepth = 6;

    // Getting the best move is gradual so that the move evaluation updates as the search progresses
    async function fetchData(depth: number) {
      if (depth > maxDepth) return;

      const lastFromIndex = currentBestMove.from.x + currentBestMove.from.y * 8;
      const lastToIndex = currentBestMove.to.x + currentBestMove.to.y * 8;

      const URL = `${import.meta.env.VITE_SERVER_URI}/best_move/${stringBoard}/${depth}/${lastFromIndex}/${lastToIndex}`;
      fetch(URL, { signal: controller.signal }).then((res) => {
        res
          .json()
          .then((data) => {
            if (depth === evaluationDepth) setMoveEvaluation(evaluateMove(data.score, score, "white"));

            setScore(data.score);
            setDepth(depth);
            const from = { x: data.from % 8, y: Math.floor(data.from / 8) };
            const to = { x: data.to % 8, y: Math.floor(data.to / 8) };
            currentBestMove = { from, to };

            // if (Date.now() - startTime < maxTime) fetchData(depth + 1);

            if (depth === maxDepth) {
              makeMove(currentBestMove);
              console.log(Date.now() - startTime + "ms");
              return;
            }

            fetchData(depth + 1);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }

    const startDepth = 1;
    fetchData(startDepth);

    // setTimeout(() => {

    // }, maxTime);
  }, [currentTurn]);
}
