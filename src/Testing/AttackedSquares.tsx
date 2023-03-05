import { useEffect, useState } from "react";
import useBoardBound from "../hooks/useBoardBound";
import { blackAttacksTest, update, whiteAttacksTest } from "./testBoard";

export default function AttackedSquares() {
  const [whiteAttacks, setWhiteAttacks] = useState(Array.from(whiteAttacksTest));

  useEffect(() => {
    const update = () => setWhiteAttacks(Array.from(whiteAttacksTest));

    window.addEventListener("mousedown", update);
    return () => window.removeEventListener("mousedown", update);
  }, []);

  return (
    <div>
      <>
        {Array.from(whiteAttacks).map((attack) => {
          return <Overlay key={attack} index={attack} color="rgba(255, 0, 0, 0.5)" />;
        })}
      </>
    </div>
  );
}

function Overlay({ index, color }: { index: number; color: string }) {
  const { boardLeft, boardTop, squareSize } = useBoardBound();

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
        backgroundColor: color,
      }}
    />
  );
}
