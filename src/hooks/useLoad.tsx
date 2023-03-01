import { useEffect, useState } from "react";
import { getAllPieces } from "../board";

export default function useLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const board = getAllPieces();
      setLoaded(() => {
        for (let i = 0; i < board.length; i++) {
          const piece = document.getElementById(board[i] + "");
          if (!piece) return false;
        }

        return true;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return loaded;
}
