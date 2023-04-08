import { useEffect } from "react";
import { Board, Move, Position } from "../types";
import getTeam from "../helpers/getTeam";
import { getAvailableMoves } from "../game/getAvailableMoves";

type Props = {
  board: Board;
  selectedPosition: Position | null;
  setAvailableMoves: React.Dispatch<React.SetStateAction<Move[]>>;
  boardHistory: Board[];
};

export default function useGetAvailableMoves({ board, selectedPosition, setAvailableMoves, boardHistory }: Props) {
  useEffect(() => {
    if (selectedPosition === null) {
      setAvailableMoves([]);
      return;
    }

    const piece = board[selectedPosition.y][selectedPosition.x];
    const team = getTeam(board, selectedPosition);

    const moves = getAvailableMoves(board, selectedPosition, boardHistory[boardHistory.length - 1]);
    setAvailableMoves(moves);
  }, [selectedPosition, boardHistory]);
}
