import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import "../_scss/board.scss";

type Props = { children: React.ReactNode; className?: string };

export default function RightTab({ children, className }: Props) {
  const { boardLeft, boardWidth, boardTop } = useBoardBound();

  const leftOffset = boardLeft + boardWidth + 10; // + 10 to give some space

  return (
    <div className={`right-tab ${className ?? ""}`} style={{ left: leftOffset, height: boardWidth, top: boardTop }}>
      {children}
    </div>
  );
}
