import React from "react";
import { blackAttacks, whiteAttacks } from "../../board";
import useBoardBound from "../../hooks/useBoardBound";
import properties from "../../properties";
import AvailableCapture from "../overlays/AvailableCapture";

export default function AttackedSquares() {
  return (
    <div>
      {whiteAttacks.map((attack, i) => {
        if (attack) return <Overlay key={i} index={i} color="rgba(255, 255, 255)" />;
      })}
      {blackAttacks.map((attack, i) => {
        const color = whiteAttacks[i] ? "rgb(128, 128, 128)" : "rgba(0, 0, 0)";
        if (attack) return <Overlay key={i} index={i} color={color} />;
      })}
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
