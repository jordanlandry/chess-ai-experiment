import { useEffect, useRef, useState } from "react";
import getAvailableMoves from "../helpers/getAvailableMoves";
import getPiecePosition from "../helpers/getPiecePosition";
import sameTeam from "../helpers/sameTeam";
import useWidth from "../hooks/useWidth";
import properties from "../properties";

export default function Game() {
  // Using window.innerWidth and window.innerHeight I can calculate the exact position of each piece
  const BOARD_TOP_MARGIN = 16; // 1rem = 16px
  const BOARD_WIDTH = Math.min(window.innerWidth, window.innerHeight, 1000) * 0.8; // 80% of the smaller screen dimension ~ 800px is the max
  const BOARD_LEFT_OFFSET = (window.innerWidth - BOARD_WIDTH) / 2;

  const width = useWidth();

  const [selectedPiece, setSelectedPiece] = useState(-1);
  const [selectedSquare, setSelectedSquare] = useState(-1);

  const history = [];

  let mouseDown = false;

  // See properties.ts for the meaning of these numbers
  const [board, setBoard] = useState([
    [0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62, 63],
  ]);

  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = document.getElementById(board[i][j] + "");
        if (!piece) continue;

        piece.style.transition = "0.25s";

        piece.style.top = BOARD_TOP_MARGIN + i * (BOARD_WIDTH / 8) + "px";
        piece.style.left = j * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET + "px";
      }
    }
  }, [board]);

  const getSpot = ({ x, y }: MouseEvent) => {
    const spot = {
      x: Math.floor((x - BOARD_LEFT_OFFSET) / (BOARD_WIDTH / 8)),
      y: Math.floor((y - BOARD_TOP_MARGIN) / (BOARD_WIDTH / 8)),
    };

    return spot;
  };

  // ~~~ MOUSE FUNCTIONS ~~~ \\
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDown = true;
      // handleMove(e);

      const { x, y } = getSpot(e);
      if (x < 0 || x > 7 || y < 0 || y > 7) return;

      setSelectedPiece((prevPiece) => {
        // If no piece is selected, select the piece that was clicked
        if (prevPiece === -1) return board[y][x];

        // If you click on the same spot return
        if (prevPiece === board[y][x]) return prevPiece;

        // If you click on a spot with a piece that is the same color as the selected piece, select the new piece        return -1;
        if (sameTeam(board[y][x], prevPiece)) return board[y][x];

        // Wherever else you click, move the piece to that spot
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];

          newBoard[getPiecePosition(prevPiece, prevBoard).y][getPiecePosition(prevPiece, prevBoard).x] = -1;
          newBoard[y][x] = prevPiece;

          return newBoard;
        });

        // Deselect the piece
        return -1;
      });
    };

    const centerPieces = () => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = document.getElementById(board[i][j] + "");
          if (!piece) continue;

          piece.style.transition = "0.25s";

          piece.style.top = BOARD_TOP_MARGIN + i * (BOARD_WIDTH / 8) + "px";
          piece.style.left = j * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET + "px";
        }
      }
    };

    // ---------------------------- \\
    const handleMouseUp = (e: MouseEvent) => {
      mouseDown = false;

      const { x, y } = getSpot(e);
      if (x < 0 || x > 7 || y < 0 || y > 7) {
        centerPieces();
        return;
      }

      setSelectedPiece((prevPiece) => {
        if (prevPiece === -1) return -1; // If no piece is selected, return

        const piece = document.getElementById(prevPiece + "")!;
        piece.style.zIndex = "0";

        // If you let go of the mouse on the same spot return
        if (prevPiece === board[y][x]) {
          // Make sure the piece is centered
          piece.style.transition = "0.25s";
          piece.style.top = BOARD_TOP_MARGIN + y * (BOARD_WIDTH / 8) + "px";
          piece.style.left = x * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET + "px";

          return prevPiece;
        }

        // Update the board
        setBoard((prevBoard) => {
          // Find the position of the piece that was selected
          let prevX = -1;
          let prevY = -1;
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (prevBoard[i][j] === prevPiece) {
                prevX = j;
                prevY = i;
              }
            }
          }

          const newBoard = [...prevBoard];

          newBoard[y][x] = prevPiece;
          newBoard[prevY][prevX] = -1;

          return newBoard;
        });

        return -1;
      });
    };

    // ---------------------------- \\
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDown || !selectedPiece) return;
      setSelectedPiece((prev) => {
        // Set the position of the selected piece to the mouse position
        const piece = document.getElementById(prev + "");
        if (!piece) return prev;

        piece.style.transition = "none";
        piece.style.zIndex = "100";

        piece.style.top = e.clientY - width / 32 + "px";
        piece.style.left = e.clientX - width / 32 + "px";

        return prev;
      });
    };

    // ---------------------------- \\
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ~~~ RESIZING FUNCTIONS ~~~ \\
  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = document.getElementById(board[i][j] + "");
        if (!piece) continue;

        piece.style.transition = "0s";

        piece.style.top = BOARD_TOP_MARGIN + i * (BOARD_WIDTH / 8) + "px";
        piece.style.left = j * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET + "px";
      }
    }
  }, [width]);

  // ~~~ REMOVE PIECES FROM BOARD ~~~ \\
  useEffect(() => {
    const remainingPieces = new Set();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] !== -1) remainingPieces.add(board[i][j]);
      }
    }

    for (let i = 0; i < 64; i++) {
      const piece = document.getElementById(i + "");
      if (!piece) continue;

      if (!remainingPieces.has(i)) piece.style.display = "none";
      else piece.style.display = "block";
    }
  }, [board]);

  // ~~~ GET AVAILABLE MOVES ~~~ \\
  useEffect(() => {
    if (selectedPiece === -1) return;
    getAvailableMoves(selectedPiece, board);
  }, [selectedPiece]);

  const reset = () => {
    setBoard([
      [0, 1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [48, 49, 50, 51, 52, 53, 54, 55],
      [56, 57, 58, 59, 60, 61, 62, 63],
    ]);

    setSelectedPiece(-1);
  };

  return (
    <div>
      <button onClick={reset}>Reset</button>

      <div
        style={{
          position: "absolute",
          width: BOARD_WIDTH / 8,
          height: BOARD_WIDTH / 8,
          backgroundColor: `rgba(255, 255, 0, ${selectedPiece === -1 ? 0 : 0.5})`,
          top: Math.ceil(BOARD_TOP_MARGIN + getPiecePosition(selectedPiece, board).y * (BOARD_WIDTH / 8)),
          left: Math.ceil(getPiecePosition(selectedPiece, board).x * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET),
        }}
      ></div>
    </div>
  );
}
