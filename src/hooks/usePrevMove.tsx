import { useEffect, useState } from "react";
import { Moves } from "../properties";

export default function usePrevMove(moveHistory: Moves[]) {
  const [move, setMove] = useState({
    from: { x: -1, y: -1 },
    to: { x: -1, y: -1 },
  });

  useEffect(() => {
    if (moveHistory.length === 0) return;
    setMove(moveHistory[moveHistory.length - 1]);
  }, [moveHistory]);

  return move;
}
