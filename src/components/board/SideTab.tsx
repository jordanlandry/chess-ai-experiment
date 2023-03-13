import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import "../_scss/board.scss";

type Props = { children: React.ReactNode; className?: string; right: boolean };

export default function SideTab({ children, className, right }: Props) {
  const { boardLeft, boardWidth, boardTop, boardRight } = useBoardBound();

  const sideOffset = right ? boardLeft + boardWidth + 10 : boardRight + 10;

  return (
    <div
      className={`${right ? "right-tab" : "left-tab"} side-tab ${className ?? ""}`}
      style={{ left: right ? sideOffset : "", right: !right ? sideOffset : "", height: boardWidth, top: boardTop }}
    >
      {children}
    </div>
  );
}
