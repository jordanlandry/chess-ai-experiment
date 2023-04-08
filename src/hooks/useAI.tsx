import { useEffect } from "react";
import { Board, Move, Team } from "../types";

type Props = {
  board: Board;
  makeMove: (move: Move) => void;
  aiTeam: Team;
  currentTurn: Team;
};

export default function useAI({ board, makeMove, aiTeam, currentTurn }: Props) {
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

    fetch(`${import.meta.env.VITE_SERVER_URI}/best_move/${stringBoard}`).then((res) => {
      res.json().then((data) => {
        const from = { x: data.from % 8, y: Math.floor(data.from / 8) };
        const to = { x: data.to % 8, y: Math.floor(data.to / 8) };

        makeMove({ from, to });
      });
    });
  }, [currentTurn]);
}
