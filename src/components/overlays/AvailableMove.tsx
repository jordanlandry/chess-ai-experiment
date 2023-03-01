import React from "react";
import useBoardBound from "../../hooks/useBoardBound";

type Props = { index: number };

export default function AvailableMove({ index }: Props) {
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}
