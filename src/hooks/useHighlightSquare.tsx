import { useEffect, useState } from "react";
import { Position } from "../types";
import getMouseSpot from "../helpers/getMouseSpot";

export default function useHighlightSquare() {
  // Get highlighted squares on right click
  const [highlightedSquares, setHighlightedSquares] = useState<Position[]>([]);
  useEffect(() => {
    let mouseDownPos: Position;
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setHighlightedSquares([]);
        return;
      }

      if (e.button !== 2) return;
      const position = getMouseSpot(e);
      if (!position) return;

      const { x, y } = position;

      if (position.x !== mouseDownPos.x || position.y !== mouseDownPos.y) return;

      setHighlightedSquares((prev) => {
        const newSquares = [...prev];
        const index = newSquares.findIndex((s) => s.x === x && s.y === y);
        if (index === -1) newSquares.push({ x, y });
        else newSquares.splice(index, 1);
        return newSquares;
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return;

      const position = getMouseSpot(e);
      if (position) mouseDownPos = position;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return highlightedSquares;
}
