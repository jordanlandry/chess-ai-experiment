import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import properties from "../../properties";

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
        transform: "translate(100%, 100%)",
        borderRadius: "50%",
        width: squareSize / 3 + "px",
        height: squareSize / 3 + "px",
        backgroundColor: properties.overlayColors.available,
        zIndex: 1,
      }}
    />
  );
}
