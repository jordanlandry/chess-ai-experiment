import { useEffect, useState } from "react";
import { board, getAllPieces } from "../board";

export default function useLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaded(() => {
        for (let i = 0; i < 64; i++) {
          if (board[i] === 0) continue;
          const piece = document.getElementById(i + "");
          if (!piece) return false;
        }

        return true;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return loaded;
}
