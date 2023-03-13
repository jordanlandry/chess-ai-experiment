import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import useLoad from "./useLoad";

export default function useBoardBound() {
  const [boardLeft, setBoardLeft] = useState(0);
  const [boardTop, setBoardTop] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [squareSize, setSquareSize] = useState(0);
  const [boardRight, setBoardRight] = useState(0);

  const loaded = useLoad();

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

  const debounceTime = 10;

  const debouncedBoardLeft = useDebounce(boardLeft, debounceTime);
  const debouncedBoardTop = useDebounce(boardTop, debounceTime);
  const debouncedBoardWidth = useDebounce(boardWidth, debounceTime);
  const debouncedSquareSize = useDebounce(squareSize, debounceTime);
  const debouncedBoardRight = useDebounce(boardRight, debounceTime);

  return {
    boardLeft: debouncedBoardLeft,
    boardTop: debouncedBoardTop,
    boardWidth: debouncedBoardWidth,
    squareSize: debouncedSquareSize,
    boardRight: debouncedBoardRight,
  };
}
