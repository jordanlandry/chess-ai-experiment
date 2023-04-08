import useBoardBound from "../../hooks/useBoardBound";
import properties from "../../properties";
import { Position } from "../../types";

type Props = { position: Position | null };

export default function SelectedPiece({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  if (position === null) return null;

  const x = boardLeft + position.x * squareSize;
  const y = boardTop + position.y * squareSize;

  return (
    <div
      style={{
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: squareSize + "px",
        height: squareSize + "px",
        backgroundColor: properties.overlayColors.selected,
        zIndex: 1,
      }}
    />
  );
}
