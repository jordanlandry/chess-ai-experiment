import useBoardBound from "../../hooks/useBoardBound";
import properties from "../../properties";

type Props = { index: number | null };

export default function SelectedPiece({ index }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();
  if (index === null) return null;

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
        backgroundColor: properties.overlayColors.selected,
        zIndex: 1,
      }}
    />
  );
}
