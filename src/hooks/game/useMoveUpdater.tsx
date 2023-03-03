import { useEffect } from "react";
import { board, lastMove, Move } from "../../board";
import { Teams } from "../../properties";

export default function useMoveUpdater(currentTurn: Teams, setMoveHistory: React.Dispatch<React.SetStateAction<Move[]>>) {
  useEffect(() => {
    if (!lastMove) return;
    setMoveHistory((moveHistory) => [...moveHistory, lastMove!]);
  }, [currentTurn]);
}
