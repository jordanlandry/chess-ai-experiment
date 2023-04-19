import useBoardBound from "../../hooks/useBoardBound";
import { Position } from "../../types";

type Props = { position: Position };

export default function AvailableMove({ position }: Props) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  const x = boardLeft + position.x * squareSize;
  const y = boardTop + position.y * squareSize;

  const color = "rgba(0, 0, 0, 0.15)";

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
        backgroundColor: color,
        zIndex: 1,
      }}
    />
  );
}
