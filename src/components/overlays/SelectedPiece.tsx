import useBoardBound from "../../hooks/useBoardBound";
import { Position } from "../../types";

type Props = { position: Position | null };

export default function SelectedPiece({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  if (position === null) return null;

  const x = boardLeft + position.x * squareSize;
  const y = boardTop + position.y * squareSize;

  const color = "rgba(255, 255, 0, 0.5)";

  return (
    <div
      style={{
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: squareSize + "px",
        height: squareSize + "px",
        backgroundColor: color,
        zIndex: 1,
      }}
    />
  );
}
