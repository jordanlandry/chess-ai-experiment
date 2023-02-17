import { useEffect, useRef, useState } from "react";
import nextId from "react-id-generator";
import getBestMove, { checks, elapsedTime } from "../ai/minimax";
import playAudio from "../helpers/audioPlayer";
import getAvailableMoves, { castleData } from "../helpers/getAvailableMoves";
import getPiecePosition from "../helpers/getPiecePosition";
import sameTeam from "../helpers/sameTeam";
import useWidth from "../hooks/useWidth";
import properties, { boardHistory } from "../properties";

// export let moveCount = 0;

let hasMoved = false;
export default function Game() {
  const width = useWidth();

  // Using window.innerWidth and window.innerHeight I can calculate the exact position of each piece
  const BOARD_TOP_MARGIN = 16; // 1rem = 16px
  const BOARD_WIDTH = Math.min(window.innerWidth, window.innerHeight, 1000) * 0.8; // 80% of the smaller screen dimension ~ 800px is the max
  const BOARD_LEFT_OFFSET = (window.innerWidth - BOARD_WIDTH) / 2;

  const [playingAgainstAI, setPlayingAgainstAI] = useState(false);

  const boardTopRef = useRef(BOARD_TOP_MARGIN);
  boardTopRef.current = BOARD_TOP_MARGIN;

  const boardWidthRef = useRef(BOARD_WIDTH);
  boardWidthRef.current = BOARD_WIDTH;

  const boardLeftRef = useRef(BOARD_LEFT_OFFSET);
  boardLeftRef.current = BOARD_LEFT_OFFSET;

  const PIECE_ANIMATION_DURATION = 0.2; // seconds

  const [whiteTurn, setWhiteTurn] = useState(true);
  const aiIsWhite = properties.aiIsWhite;

  const [loaded, setLoaded] = useState(false);

  const whiteTurnRef = useRef(whiteTurn);
  whiteTurnRef.current = whiteTurn;

  const [selectedPiece, setSelectedPiece] = useState(-1);
  const [availableMoves, setAvailableMoves] = useState<
    { x: number; y: number; castle?: boolean; enPassant?: boolean }[]
  >([]);
  const availableMovesRef = useRef(availableMoves);
  availableMovesRef.current = availableMoves;

  let mouseDown = false; // Used to prevent dragging the pieces when your mouse is not down
  // let draggable = false;    // Used to prevent dragging pieces when you are not dragging them, but the mouse is down

  // See properties.ts for the meaning of these numbers
  const [board, setBoard] = useState([
    [0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62, 63],
  ]);
  // const [board, setBoard] = useState([
  //   [-1, 1, -1, -1, 4, 5, 6, 7],
  //   [8, 9, 10, 11, 12, 13, 14, 15],
  //   [-1, -1, -1, 2, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1, -1],
  //   [-1, -1, 3, -1, -1, -1, -1, -1],
  //   [-1, -1, -1, -1, -1, -1, -1, -1],
  //   [48, -1, -1, 51, 52, -1, -1, 55],
  //   [56, -1, -1, 59, -1, -1, -1, 63],
  // ]);

  const getSpot = ({ x, y }: MouseEvent) => {
    const spot = {
      x: Math.floor((x - boardLeftRef.current) / (boardWidthRef.current / 8)),
      y: Math.floor((y - BOARD_TOP_MARGIN) / (boardWidthRef.current / 8)),
    };

    return spot;
  };

  // ~~~ MOUSE FUNCTIONS ~~~ \\
  const handleMouseDown = (e: MouseEvent) => {
    mouseDown = true;

    const { x, y } = getSpot(e);
    if (x < 0 || x > 7 || y < 0 || y > 7) return;

    // Don't select the piece if it's not the player's turn
    if (!aiIsWhite) {
      if (!whiteTurnRef.current && board[y][x] > 47) return;
      if (whiteTurnRef.current && board[y][x] < 16) return;
    }

    if (aiIsWhite) {
      if (!whiteTurnRef.current && board[y][x] < 16) return;
      if (whiteTurnRef.current && board[y][x] > 47) return;
    }

    setSelectedPiece((prevPiece) => {
      // If no piece is selected, select the piece that was clicked (for clicking on a possible move)
      if (prevPiece === -1) return board[y][x];

      // If you click on the same spot return
      if (prevPiece === board[y][x]) return prevPiece;

      // If you click on a spot with a piece that is the same color as the selected piece, select the new piece
      if (sameTeam(board[y][x], prevPiece)) return board[y][x];

      // Deselect the piece
      return prevPiece;
    });
  };

  const centerPieces = (transition: number) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = document.getElementById(board[i][j] + "");
        if (!piece) continue;

        piece.style.transition = transition + "s";

        piece.style.top = BOARD_TOP_MARGIN + i * (boardWidthRef.current / 8) + "px";
        piece.style.left = j * (boardWidthRef.current / 8) + boardLeftRef.current + "px";
      }
    }
  };

  // ---------------------------- \\
  const handleMouseUp = async (e: MouseEvent) => {
    mouseDown = false;
    // draggable = false;

    const { x, y } = getSpot(e);
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      centerPieces(0);
      return;
    }

    setSelectedPiece((prevPiece) => {
      if (prevPiece === -1) return -1; // If no piece is selected, return

      // If it's not your turn return
      if (!aiIsWhite) {
        if (!whiteTurnRef.current && sameTeam(prevPiece, 63)) return -1;
        if (whiteTurnRef.current && sameTeam(prevPiece, 0)) return -1;
      }

      if (aiIsWhite) {
        if (!whiteTurnRef.current && sameTeam(prevPiece, 0)) return -1;
        if (whiteTurnRef.current && sameTeam(prevPiece, 63)) return -1;
      }

      const piece = document.getElementById(prevPiece + "")!;
      piece.style.zIndex = "0";

      // If you let go of the mouse on the same spot
      if (prevPiece === board[y][x]) {
        centerPieces(PIECE_ANIMATION_DURATION);
        return prevPiece;
      }

      for (let i = 0; i < availableMovesRef.current.length; i++) {
        if (availableMovesRef.current[i].x !== x || availableMovesRef.current[i].y !== y) continue;

        const move = availableMovesRef.current[i];

        // Update the board
        setBoard((prevBoard) => {
          hasMoved = true;
          const { x: prevX, y: prevY } = getPiecePosition(prevPiece, prevBoard);
          if (board[y][x] !== -1 || move.enPassant)
            playAudio("../assets/sounds/capture.mp3", () => setWhiteTurn((prev) => !prev));
          else if (move.castle) playAudio("../assets/sounds/castle.mp3", () => setWhiteTurn((prev) => !prev));
          else playAudio("../assets/sounds/move-self.mp3", () => setWhiteTurn((prev) => !prev));

          if (properties.aiIsWhite) {
            if (board[prevY][prevX] === 0) castleData.whiteLeftRookMoved = true;
            if (board[prevY][prevX] === 7) castleData.whiteRightRookMoved = true;

            if (board[prevY][prevX] === 56) castleData.blackLeftRookMoved = true;
            if (board[prevY][prevX] === 63) castleData.blackRightRookMoved = true;
          }

          if (!properties.aiIsWhite) {
            if (board[prevY][prevX] === 63) castleData.whiteLeftRookMoved = true;
            if (board[prevY][prevX] === 56) castleData.whiteRightRookMoved = true;

            if (board[prevY][prevX] === 0) castleData.blackLeftRookMoved = true;
            if (board[prevY][prevX] === 7) castleData.blackRightRookMoved = true;
          }

          const newBoard = [...prevBoard];

          newBoard[y][x] = prevPiece;
          newBoard[prevY][prevX] = -1;

          if (move.castle && !aiIsWhite) {
            if (y === 0) castleData.blackKingMoved = true;
            if (y === 7) castleData.whiteKingMoved = true;

            if (x === 6) {
              const rook = newBoard[prevY][prevX + 3];
              newBoard[prevY][prevX + 3] = -1;
              newBoard[prevY][prevX + 1] = rook;
            } else if (x === 2) {
              const rook = newBoard[prevY][prevX - 4];
              newBoard[prevY][prevX - 4] = -1;
              newBoard[prevY][prevX - 1] = rook;
            }
          }

          if (move.castle && aiIsWhite) {
            if (y === 0) castleData.whiteKingMoved = true;
            if (y === 7) castleData.blackKingMoved = true;

            if (x === 5) {
              const rook = newBoard[prevY][prevX + 4];
              newBoard[prevY][prevX + 4] = -1;
              newBoard[prevY][prevX + 1] = rook;
            } else if (x === 1) {
              const rook = newBoard[prevY][prevX - 3];
              newBoard[prevY][prevX - 3] = -1;
              newBoard[prevY][prevX - 1] = rook;
            }
          }

          // En passant
          if (move.enPassant) newBoard[prevY][x] = -1;

          return newBoard;
        });
      }

      centerPieces(PIECE_ANIMATION_DURATION);
      return -1;
    });
  };

  useEffect(() => {
    centerPieces(PIECE_ANIMATION_DURATION);

    // Remove pieces that are no longer on the board
    const removedPieces: number[] = [];

    // Find the pieces that are no longer on the board
    Object.keys(properties.numPairBlack).forEach((piece) => {
      if (!board.flat().includes(parseInt(piece))) removedPieces.push(parseInt(piece));
    });

    // Display none the pieces that are no longer on the board
    removedPieces.forEach((piece) => {
      const pieceElement = document.getElementById(piece + "");
      if (pieceElement) pieceElement.style.display = "none";
    });

    // Add to board history, hasMoved is to prevent the board from being added to the history when the board is first rendered
    if (hasMoved) boardHistory.push(board.map((row) => [...row]));
  }, [board]);

  // ---------------------------- \\
  const handleMouseMove = (e: MouseEvent) => {
    if (!selectedPiece || !mouseDown) return;
    setSelectedPiece((prev) => {
      // Set the position of the selected piece to the mouse position
      const piece = document.getElementById(prev + "");
      if (!piece) return prev;

      piece.style.transition = "none";
      piece.style.zIndex = "100";

      piece.style.top = e.clientY - boardWidthRef.current / 8 + boardWidthRef.current / 16 + "px";
      piece.style.left = e.clientX - boardWidthRef.current / 8 / 2 + "px";
      return prev;
    });
  };

  // ---------------------------- \\
  useEffect(() => {
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
    centerPieces(0);
  }, [width]);

  // ~~~ GET AVAILABLE MOVES ~~~ \\
  useEffect(() => {
    if (selectedPiece === -1) {
      setAvailableMoves([]);
      return;
    }

    const { x, y } = getPiecePosition(selectedPiece, board);
    setAvailableMoves(getAvailableMoves(board, x, y));
  }, [selectedPiece]);

  useEffect(() => {
    availableMovesRef.current = availableMoves;
  }, [availableMoves]);

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

  useEffect(() => {
    if (!playingAgainstAI) return;
    if (!loaded) return;
    if (whiteTurnRef.current !== aiIsWhite) return;

    const move = getBestMove(board, 3);

    if (!move) return;

    let playingAudio = false;

    // Update the board
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      if (!playingAudio) {
        playingAudio = true;
        if (prevBoard[move.to.y][move.to.x] === -1)
          playAudio("../assets/sounds/move-self.mp3", () => (playingAudio = false));
        else playAudio("../assets/sounds/capture.mp3", () => (playingAudio = false));
      }

      newBoard[move.to.y][move.to.x] = move.piece;
      newBoard[move.from.y][move.from.x] = -1;
      return newBoard;
    });

    setWhiteTurn((prev) => !prev);
    whiteTurnRef.current = !whiteTurnRef.current;
  }, [whiteTurn, loaded]);

  // Check if the game has loaded
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if the first and last piece have loaded
      if (document.getElementById("0") && document.getElementById("63")) {
        setLoaded(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", width: "25%", margin: "auto" }}>
        {/* <button onClick={reset}>Reset</button> */}
        <span style={{ textAlign: "center", fontSize: "2rem" }}>{checks.toLocaleString()} Runs</span>
        <span style={{ textAlign: "center", fontSize: "2rem" }}>{elapsedTime.toLocaleString()}ms</span>
      </div>
      <div
        style={{
          position: "absolute",
          width: boardWidthRef.current / 8,
          height: boardWidthRef.current / 8,
          backgroundColor: `rgba(255, 255, 0, ${selectedPiece === -1 ? 0 : 0.5})`,
          top: Math.ceil(BOARD_TOP_MARGIN + getPiecePosition(selectedPiece, board).y * (boardWidthRef.current / 8)),
          left: Math.ceil(
            getPiecePosition(selectedPiece, board).x * (boardWidthRef.current / 8) + boardLeftRef.current
          ),
        }}
      />

      {availableMoves.map((move) => {
        return (
          <div
            key={nextId()}
            style={{
              position: "absolute",
              width: boardWidthRef.current / 8,
              height: boardWidthRef.current / 8,
              top: Math.ceil(BOARD_TOP_MARGIN + move.y * (boardWidthRef.current / 8)),
              left: Math.ceil(move.x * (boardWidthRef.current / 8) + boardLeftRef.current),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {board[move.y][move.x] !== -1 || move.enPassant ? (
              <div
                style={{
                  width: "75%",
                  height: "75%",
                  borderRadius: "50%",
                  outline: "0.5rem solid rgba(255, 0, 0, 0.25)",
                  zIndex: 101,
                }}
              />
            ) : (
              <div
                style={{
                  width: "25%",
                  height: "25%",
                  borderRadius: "50%",
                  backgroundColor: `rgba(50, 50, 50, ${move.x === -1 ? 0 : 0.15})`,
                  zIndex: 99,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
