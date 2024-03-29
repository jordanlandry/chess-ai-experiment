import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

export default function useBoardBound() {
  const [boardLeft, setBoardLeft] = useState(0);
  const [boardTop, setBoardTop] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [squareSize, setSquareSize] = useState(0);
  const [boardRight, setBoardRight] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  const loaded = false;

  useEffect(() => {
    const board = document.getElementById("board");
    if (!board) return;

    const handleResize = () => {
      const { left, top, width, right } = board.getBoundingClientRect();
      setBoardLeft(left);
      setBoardTop(top);
      setBoardWidth(width);
      setBoardRight(right);
      setSquareSize(width / 8);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("fullscreenchange", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fullscreenchange", handleResize);
    };
  }, [loaded]);

  return { boardLeft, boardTop, boardWidth, squareSize, boardRight };
}
