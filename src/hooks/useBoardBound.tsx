import { useEffect, useState } from "react";
import useLoad from "./useLoad";

export default function useBoardBound() {
  const [boardLeft, setBoardLeft] = useState(0);
  const [boardTop, setBoardTop] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [squareSize, setSquareSize] = useState(0);

  const loaded = useLoad();

  useEffect(() => {
    const board = document.getElementById("board");
    if (!board) return;

    const handleResize = () => {
      const { left, top, width } = board.getBoundingClientRect();
      setBoardLeft(left);
      setBoardTop(top);
      setBoardWidth(width);
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

  return {
    boardLeft: boardLeft,
    boardTop: boardTop,
    boardWidth: boardWidth,
    squareSize: squareSize,
  };
}
