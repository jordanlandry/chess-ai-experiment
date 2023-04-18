import React from "react";
import { Position } from "../../types";
import useBoardBound from "../../hooks/useBoardBound";

type Props = {
  position: Position;
};

export default function HighlightedSquare({ position }: Props) {
  const { squareSize, boardLeft, boardTop } = useBoardBound();

  const squareStyles: React.CSSProperties = {
    position: "absolute",
    left: `${boardLeft + position.x * squareSize}px`,
    top: `${boardTop + position.y * squareSize}px`,
    width: `${squareSize}px`,
    height: `${squareSize}px`,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  };

  return <div style={squareStyles} />;
}
