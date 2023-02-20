import React from "react";
import useBoardBound from "../hooks/useBoardBound";
import properties from "../properties";

type Props = { x: number; y: number; style: "capture" | "available" | "selected" | "lastMove" };

export default function BoardOverlay({ x, y, style }: Props) {
  const { squareSize, boardLeft, boardTop } = useBoardBound();

  const availableStyles: React.CSSProperties = {
    backgroundColor: properties.overlayColors.available,
    borderRadius: "50%",
    width: squareSize / 3,
    height: squareSize / 3,
    transform: `translate(${squareSize / 2 - squareSize / 6}px, ${squareSize / 2 - squareSize / 6}px)`,
  };

  const captureStyles: React.CSSProperties = {
    opacity: 0.5,
    zIndex: 100,
    borderRadius: "50%",
    transform: "scale(0.75) translate(-10px, -10px)",
    border: "8px solid " + properties.overlayColors.capture,
  };

  const additionalStyles: React.CSSProperties =
    style === "capture"
      ? captureStyles
      : style === "available"
      ? availableStyles
      : style === "selected"
      ? { backgroundColor: properties.overlayColors.selected }
      : style === "lastMove"
      ? { backgroundColor: properties.overlayColors.lastMove }
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
