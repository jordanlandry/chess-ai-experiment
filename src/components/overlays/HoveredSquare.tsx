import React from "react";
import useBoardBound from "../../hooks/useBoardBound";

type Props = {
  position: { x: number; y: number };
};

export default function HoveredSquare({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  const borderSize = Math.ceil(squareSize * 0.1);

  return (
    <div
      style={{
        position: "absolute",
        left: boardLeft + position.x * squareSize + borderSize + "px",
        top: boardTop + position.y * squareSize + borderSize + "px",
        width: squareSize - borderSize * 2 + "px",
        height: squareSize - borderSize * 2 + "px",
        outline: `${borderSize}px solid rgba(255, 255, 255, 0.9)`,
        zIndex: 1000,
      }}
    ></div>
  );
}
