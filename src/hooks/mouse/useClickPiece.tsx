import { useEffect, useState } from "react";
import getMouseSpot from "../../helpers/getMouseSpot";
import getTeam from "../../helpers/getTeam";
import { Board, Move, Position, Team } from "../../types";

type Props = {
  board: Board;
  availableMoves: Move[];
  makeMove: (move: Move) => void;
  currentTurn: Team;
  aiThinking: boolean;
  promotionPieceId: number;
};

export default function useClickPiece({ board, availableMoves, makeMove, currentTurn, aiThinking, promotionPieceId }: Props) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (aiThinking) return;
    if (promotionPieceId !== -1) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // 0 = left click
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
