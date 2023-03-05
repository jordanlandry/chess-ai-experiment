import React, { useEffect, useState } from "react";
import getMouseSpot from "../helpers/getMouseSpot";
import useBoardBound from "../hooks/useBoardBound";
import { getAvailableMovesNew } from "./testBoard";

export default function AvailableMoves() {
  const [moves, setAvailableMoves] = useState<any>();

  useEffect(() => {
    const click = (e: MouseEvent) => {
      setAvailableMoves(getAvailableMovesNew(getMouseSpot(e)!));
    };

    window.addEventListener("mousedown", click);
    return () => window.removeEventListener("mousedown", click);
  }, []);

  return (
    <div>
      {Array.from(moves || []).map((move: any) => (
        <Overlay key={move} index={move} color="rgba(255, 155, 0)" />
      ))}
    </div>
  );
}

function Overlay({ index, color }: { index: number; color: string }) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  const x = boardLeft + (index % 8) * squareSize;
  const y = boardTop + Math.floor(index / 8) * squareSize;

  return (
    <div
      style={{
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: squareSize + "px",
        height: squareSize + "px",
        backgroundColor: color,
      }}
    />
  );
}
