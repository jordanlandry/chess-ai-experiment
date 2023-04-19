import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import { Position } from "../../types";

type Props = { position: Position };

export default function AvailableCapture({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  const x = boardLeft + position!.x * squareSize;
  const y = boardTop + position!.y * squareSize;

  const borderSize = Math.ceil(squareSize * 0.1);

  const color = "rgba(255, 0, 0, 0.5)";

  return (
    <div
      style={{
        position: "absolute",
        left: x + borderSize + "px",
        top: y + borderSize + "px",
        width: squareSize - borderSize * 2 + "px",
        height: squareSize - borderSize * 2 + "px",
        outline: `${borderSize}px solid ${color}`,
        borderRadius: "50%",
        zIndex: 1,
      }}
    />
  );
}
