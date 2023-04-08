import React from "react";
import { Board, Move } from "../types";
import "./_scss/moveHistory.scss";

type Props = {
  board: Board;
  moveHistory: Move[];
};

export default function MoveHistory({ board, moveHistory }: Props) {
  const getNameOfMove = (move: Move) => {
    let piece = board[move.to.y][move.to.x].piece.toUpperCase();
    let from = `${String.fromCharCode(move.from.x + 97)}${move.from.y + 1}`;
    let to = `${String.fromCharCode(move.to.x + 97)}${move.to.y + 1}`;

    if (piece === "P") piece = "";
    return `${piece}${to}`;
  };

  return (
    <div className="move-history-wrapper">
      Not implemented yet
      {/* {moveHistory.map((move, index) => {
        return <div key={index}>{getNameOfMove(move)}</div>;
      })} */}
    </div>
  );
}
