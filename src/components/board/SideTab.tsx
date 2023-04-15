import React from "react";
import useBoardBound from "../../hooks/useBoardBound";
import "../_scss/board.scss";

type Props = { children: React.ReactNode; className?: string; right: boolean; showBackground?: boolean; sideOffset?: number; fixedWidth?: string };

export default function SideTab({ children, className, right, showBackground = true, sideOffset = 10, fixedWidth }: Props) {
  const { boardLeft, boardWidth, boardTop, boardRight } = useBoardBound();

  const offset = right ? boardLeft + boardWidth + sideOffset : boardRight + sideOffset;

  return (
    <div
      data-no-bg={!showBackground}
      className={`${right ? "right-tab" : "left-tab"} side-tab ${className ?? ""}`}
      style={{
        left: right ? offset : "",
        right: !right ? offset : "",
        height: boardWidth,
        top: boardTop,
        width: fixedWidth ? fixedWidth : "",
      }}
    >
      {children}
    </div>
  );
}
