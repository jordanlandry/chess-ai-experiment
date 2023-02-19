import { useEffect, useState } from "react";
import centerPieces from "../helpers/centerPieces";
import getBoardBound from "../helpers/getBoardBound";
import properties, { KeyStringObject, PiecesType, PieceType } from "../properties";
import useLoad from "./useLoad";

// Centers the pieces in the middle of their squares
export default function usePieceCentering(board: PieceType[][]) {
  const loaded = useLoad();

  const [squareSize, setSquareSize] = useState(0);
  const [boardLeft, setBoardHeight] = useState(0);
  const [boardTop, setBoardTop] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const { boardLeft, squareSize, boardTop } = getBoardBound();
      setSquareSize(squareSize);
      setBoardHeight(boardLeft);
      setBoardTop(boardTop);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [animationTimeMs, setAnimationTimeMs] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setAnimationTimeMs(properties.animationTimeMs);
    }, 500);
  }, []);

  useEffect(() => {
    centerPieces(board, animationTimeMs);
  }, [loaded, squareSize, boardLeft, boardTop, board, animationTimeMs]);

  // Remove pieces from the board when they're not on the board
  useEffect(() => {
    // Get the pieces that are not on the board
    const ids = new Set();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].piece === PiecesType.None) continue;

        ids.add(board[i][j].id);
      }
    }

    for (let i = 0; i < 64; i++) {
      if (ids.has(i)) continue;

      const piece = document.getElementById(`${i}`);
      if (piece) piece.style.display = "none";
    }
  }, [board]);
}
