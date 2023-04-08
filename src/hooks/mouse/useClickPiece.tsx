import { useEffect, useState } from "react";
import getMouseSpot from "../../helpers/getMouseSpot";
import getTeam from "../../helpers/getTeam";
import { Board, Move, Position, Team } from "../../types";

type Props = {
  board: Board;
  availableMoves: Move[];
  makeMove: (move: Move) => void;
  currentTurn: Team;
};

export default function useMouseDown({ board, availableMoves, makeMove, currentTurn }: Props) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const position = getMouseSpot(e);
      if (!position) return;

      // Selected an empty square (try to make a move if available)
      if (board[position.y][position.x].piece === " " || getTeam(board, position) !== currentTurn) {
        const move = availableMoves.find((move) => move.to.x === position.x && move.to.y === position.y);
        if (move) makeMove(move);
        setSelectedPosition(null);
      }

      // Selected a piece
      else setSelectedPosition(position);
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [board, availableMoves, selectedPosition]);

  return { selectedPosition, setSelectedPosition };
}
