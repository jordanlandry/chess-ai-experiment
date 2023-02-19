import React from "react";
import useBoardBound from "../hooks/useBoardBound";
import properties from "../properties";

type Props = { x: number; y: number; style: "capture" | "available" | "selected" };

export default function BoardOverlay({ x, y, style }: Props) {
  const { squareSize, boardLeft, boardTop } = useBoardBound();

  const additionalStyles: React.CSSProperties =
    style === "capture"
      ? {
          opacity: 0.5,
          zIndex: 100,
          borderRadius: "50%",
          transform: "scale(0.75) translate(-10px, -10px)",
          border: "8px solid " + properties.availableCaptureColor,
        }
      : style === "available"
      ? {
          backgroundColor: properties.availableMoveColor,
          borderRadius: "50%",
          width: squareSize / 3,
          height: squareSize / 3,
          transform: `translate(${squareSize / 2 - squareSize / 6}px, ${squareSize / 2 - squareSize / 6}px)`,
        }
      : style === "selected"
      ? { backgroundColor: properties.selectedPieceColor }
      : {};

  if (x === -1 || y === -1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: boardTop + y * squareSize + "px",
        left: boardLeft + x * squareSize + "px",
        width: squareSize + "px",
        height: squareSize + "px",
        ...additionalStyles,
      }}
    />
  );
}
