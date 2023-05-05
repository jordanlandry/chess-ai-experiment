import useBoardBound from "../../hooks/useBoardBound";
import { Position } from "../../types";

type Props = {
  position: Position;
};

export default function HoveredSquare({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  const borderSize = Math.ceil(squareSize * 0.075);

  return (
    <div
      style={{
        position: "absolute",
        left: boardLeft + position.x * squareSize + borderSize - borderSize / 2 + 3 + "px",
        top: boardTop + position.y * squareSize + borderSize - borderSize / 2 + 3 + "px",
        width: squareSize - borderSize * 2 + "px",
        height: squareSize - borderSize * 2 + "px",
        zIndex: 1,
        boxShadow: `0 0 0 ${borderSize}px rgba(255, 255, 255, 0.9)`,
      }}
    ></div>
  );
}
