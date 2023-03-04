import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import properties from "../../properties";

type Props = { index: number };

export default function AvailableCapture({ index }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  const x = boardLeft + (index % 8) * squareSize;
  const y = boardTop + Math.floor(index / 8) * squareSize;

  const borderSize = Math.ceil(squareSize * 0.05);

  return (
    <div
      style={{
        position: "absolute",
        left: x + borderSize + "px",
        top: y + borderSize + "px",
        width: squareSize - borderSize * 2 + "px",
        height: squareSize - borderSize * 2 + "px",
        outline: `${borderSize}px solid ${properties.overlayColors.capture}`,
        borderRadius: "50%",
        zIndex: 600,
      }}
    />
  );
}
