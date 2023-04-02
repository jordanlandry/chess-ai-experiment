import React from "react";
import useBoardBound from "../../hooks/useBoardBound";

type Props = {
  position: { x: number; y: number };
};

export default function HoveredSquare({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  const borderSize = Math.ceil(squareSize * 0.075);

  return (
    <div
      style={{
        position: "absolute",
        left: boardLeft + position.x * squareSize + borderSize - borderSize / 2 + "px",
        top: boardTop + position.y * squareSize + borderSize - borderSize / 2 + "px",
        width: squareSize - borderSize + "px",
        height: squareSize - borderSize + "px",
        zIndex: 1000,
        boxShadow: `0 0 0 ${borderSize}px rgba(255, 255, 255, 0.9)`,
      }}
    ></div>
  );
}