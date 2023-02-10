import { useContext, useEffect, useRef, useState } from "react";
import getBestMove, { checks, elapsedTime } from "../ai/minimax";
import playAudio from "../helpers/audioPlayer";
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

  const PIECE_ANIMATION_DURATION = 0.2; // seconds

  const width = useWidth();

  const [whiteTurn, setWhiteTurn] = useState(true);
  const aiIsWhite = properties.aiIsWhite;

  const [loaded, setLoaded] = useState(false);

  const whiteTurnRef = useRef(whiteTurn);
  whiteTurnRef.current = whiteTurn;

  const [selectedPiece, setSelectedPiece] = useState(-1);
  const [availableMoves, setAvailableMoves] = useState<{ x: number; y: number, castle?: boolean }[]>([]);
  const availableMovesRef = useRef(availableMoves);
  availableMovesRef.current = availableMoves;

  const history = [];

  let mouseDown = false;    // Used to prevent dragging the pieces when your mouse is not down
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

  const getSpot = ({ x, y }: MouseEvent) => {
    const spot = {
      x: Math.floor((x - BOARD_LEFT_OFFSET) / (BOARD_WIDTH / 8)),
      y: Math.floor((y - BOARD_TOP_MARGIN) / (BOARD_WIDTH / 8)),
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
    //   // If no piece is selected, select the piece that was clicked (for clicking on a possible move)
      if (prevPiece === -1) {
        return board[y][x];
      }

      // If you click on the same spot return
      if (prevPiece === board[y][x]) {
        // draggable = true;
        return prevPiece;
      }

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

        piece.style.top = BOARD_TOP_MARGIN + i * (BOARD_WIDTH / 8) + "px";
        piece.style.left = j * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET + "px";
      }
    }
  };

  // ---------------------------- \\
  const handleMouseUp = async (e: MouseEvent) => {
    // centerPieces(0);
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
        if (!whiteTurnRef.current && sameTeam(prevPiece, 63)) return - 1;
        if (whiteTurnRef.current && sameTeam(prevPiece,  0)) return - 1;
      }

      if (aiIsWhite) {
        if (!whiteTurnRef.current && sameTeam(prevPiece,  0)) return - 1;
        if (whiteTurnRef.current && sameTeam(prevPiece, 63)) return - 1;
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

        // Update the board
        setBoard((prevBoard) => {
          const { x: prevX, y: prevY } = getPiecePosition(prevPiece, prevBoard);
          if (board[y][x] !== -1) playAudio("../assets/sounds/capture.mp3", () => setWhiteTurn((prev) => !prev));
          else if (availableMovesRef.current[i].castle) playAudio("../assets/sounds/castle.mp3", () => setWhiteTurn((prev) => !prev));
          else playAudio("../assets/sounds/move-self.mp3", () =>  setWhiteTurn((prev) => !prev));

          const newBoard = [...prevBoard];

          newBoard[y][x] = prevPiece;
          newBoard[prevY][prevX] = -1;

          if (availableMovesRef.current[i].castle && !aiIsWhite) {
            if (x === 6) {
              const rook = newBoard[prevY][prevX + 3];
              newBoard[prevY][prevX + 3] = -1;
              newBoard[prevY][prevX + 1] = rook;
            }

            else if (x === 2) {
              const rook = newBoard[prevY][prevX - 4];
              newBoard[prevY][prevX - 4] = -1;
              newBoard[prevY][prevX - 1] = rook;
            }
          }

          if (availableMovesRef.current[i].castle && aiIsWhite) {
            if (x === 5) {
              console.log(prevX);
              const rook = newBoard[prevY][prevX + 4];
              newBoard[prevY][prevX + 4] = -1;
              newBoard[prevY][prevX + 1] = rook;
            }

            else if (x === 1) {
              const rook = newBoard[prevY][prevX - 3];
              newBoard[prevY][prevX - 3] = -1;
              newBoard[prevY][prevX - 1] = rook;
            }
          }

          return newBoard;
        });
      }

      centerPieces(PIECE_ANIMATION_DURATION);
      // setWhiteTurn((prev) => !prev);

      return -1;
    });
  };

  useEffect(() => {
    centerPieces(PIECE_ANIMATION_DURATION);

    // Remove pieces that are no longer on the board
    // const remainingPieces = board.flat().filter((piece) => piece !== -1);
    const removedPieces: number[] = [];

    Object.keys(properties.numPairBlack).forEach((piece) => {
      if (!board.flat().includes(parseInt(piece))) removedPieces.push(parseInt(piece));
    });

    removedPieces.forEach((piece) => {
      const pieceElement = document.getElementById(piece + "");
      if (pieceElement) pieceElement.style.display = "none";
    });
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

      piece.style.top = e.clientY - width / 32 + "px";
      piece.style.left = e.clientX - width / 32 + "px";

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

    // console.log(selectedPiece);
    
    const { x, y } = getPiecePosition(selectedPiece, board);
    setAvailableMoves(getAvailableMoves(board, x, y));
  }, [selectedPiece]);

  useEffect(() => {
    availableMovesRef.current = availableMoves;

    // Show available moves
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
    if (!loaded) return;
    if (whiteTurnRef.current !== aiIsWhite) return;
    
    const move = getBestMove(board, true, 3);
    
    if (!move) return;
    
    let playingAudio = false;
    
    // Update the board
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      if (!playingAudio) {
        playingAudio = true;
        if (prevBoard[move.to.y][move.to.x] === -1) playAudio("../assets/sounds/move-self.mp3", () => playingAudio = false)
        else playAudio("../assets/sounds/capture.mp3", () => playingAudio = false);
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
  }, [])

  return (
    <div>
      <div style={{display: "flex", flexDirection: "column", width: '25%', margin: "auto"}}>

      {/* <button onClick={reset}>Reset</button> */}
      <span style={{textAlign: "center", fontSize: '2rem'}}>{checks.toLocaleString()} Runs</span>
      <span style={{textAlign: "center", fontSize: '2rem'}}>{elapsedTime.toLocaleString()}ms</span>
      </div>
      <div
        style={{
          position: "absolute",
          width: BOARD_WIDTH / 8,
          height: BOARD_WIDTH / 8,
          backgroundColor: `rgba(255, 255, 0, ${selectedPiece === -1 ? 0 : 0.5})`,
          top: Math.ceil(BOARD_TOP_MARGIN + getPiecePosition(selectedPiece, board).y * (BOARD_WIDTH / 8)),
          left: Math.ceil(getPiecePosition(selectedPiece, board).x * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET),
        }}
      />

      {availableMoves.map((move) => {
        return (
          <div
            key={move.x + "" + move.y}
            style={{
              position: "absolute",
              width: BOARD_WIDTH / 8,
              height: BOARD_WIDTH / 8,
              top: Math.ceil(BOARD_TOP_MARGIN + move.y * (BOARD_WIDTH / 8)),
              left: Math.ceil(move.x * (BOARD_WIDTH / 8) + BOARD_LEFT_OFFSET),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            >
            {board[move.y][move.x] !== -1 ? (
              <div
              style={{
                width: "75%",
                height: "75%",
                borderRadius: "50%",
                outline: board[move.y][move.x] !== -1 ? "0.5rem solid rgba(255, 0, 0, 0.25)" : "none",
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
