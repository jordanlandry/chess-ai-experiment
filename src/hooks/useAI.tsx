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
  setMateIn: React.Dispatch<React.SetStateAction<number>>;
};

export default async function useAI({ board, makeMove, aiTeam, currentTurn, setScore, score, setMoveEvaluation, setDepth, setMateIn }: Props) {
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

    const maxTime = 3000;

    const controller = new AbortController();

    // This is what I set the max score to in the minimax function (server/src/minimax.rs)
    const maxScore = 9_999_999;

    let currentBestMove: Move = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };
    let lastScore = score;

    // const evaluationDepth = 6;
    const evaluationTime = 250; // Amount of time before the evaluation is updated

    const fetchData = async (maxTime: number, isEvaluation: boolean) => {
      await fetch(`${import.meta.env.VITE_SERVER_URI}/best_move/${stringBoard}/${maxTime}`, { signal: controller.signal }).then((res) => {
        res.json().then((data) => {
          const from = { x: data.from % 8, y: Math.floor(data.from / 8) };
          const to = { x: data.to % 8, y: Math.floor(data.to / 8) };

          currentBestMove = { from, to };

          const depth = data.depth;
          const score = data.score;
          const bestMove = currentBestMove;

          setMoveEvaluation(evaluateMove(score, lastScore, "white"));
          setScore(score);
          setDepth(depth);

          if (!isEvaluation) makeMove(bestMove);
          if (Math.abs(score) === maxScore) setMateIn(depth - 1);

          setMateIn((prev) => prev - 1);
        });
      });
    };

    const getEvaluation = async () => fetchData(evaluationTime, true);
    const getBestMove = async () => fetchData(maxTime, false);

    getEvaluation();
    getBestMove();
  }, [currentTurn]);
}
