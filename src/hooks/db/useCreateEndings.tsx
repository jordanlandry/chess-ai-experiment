import { useEffect, useState } from "react";
import openings from "../../database/openings";
import { generateOpenings } from "../../game/ai/db/openings";
import getBestMove from "../../game/ai/minimax";
import { movePiece } from "../../game/movePiece";
import { boardToKey, MinimaxProps, MinimaxReturn, Moves, PiecesType, PieceType, PromotionPieceType, Teams } from "../../properties";

export default function useCreateEndings(isRunning: boolean) {
  const minimaxProps = {
    aiIsWhite: false,
    difficulty: 3,
    maxTime: 60_000,
    maxDepth: 0, // This does nothing when the time limit is being used
    doAlphaBeta: true,
    doMoveOrdering: true,
    doTranspositionTable: true,
    doQuiescence: true,
    doNullMove: true,
    useTimeLimit: true,
  };

  const [generatedBoard, setGeneratedBoard] = useState<PieceType[][]>();

  const possiblePieces = [PiecesType.Pawn, PiecesType.Knight, PiecesType.Bishop, PiecesType.Rook, PiecesType.Queen];

  function generateBoard() {
    const newBoard = [
      [
        { piece: PiecesType.None, color: Teams.None, id: 0, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 1, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 2, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 3, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 4, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 5, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 6, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 7, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 8, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 9, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 10, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 11, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 12, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 13, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 14, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 15, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 16, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 17, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 18, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 19, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 20, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 21, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 22, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 23, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 24, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 25, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 26, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 27, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 28, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 29, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 30, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 31, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 32, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 33, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 34, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 35, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 36, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 37, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 38, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 39, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 40, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 41, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 42, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 43, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 44, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 45, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 46, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 47, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 48, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 49, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 50, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 51, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 52, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 53, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 54, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 55, hasMoved: false },
      ],
      [
        { piece: PiecesType.None, color: Teams.None, id: 56, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 57, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 58, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 59, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 60, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 61, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 62, hasMoved: false },
        { piece: PiecesType.None, color: Teams.None, id: 63, hasMoved: false },
      ],
    ];

    const takenSpots = new Set<{ x: number; y: number }>();

    // Add both kings
    const king1 = { x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) };
    takenSpots.add(king1);

    let king2;

    do king2 = { x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) };
    while (takenSpots.has(king2));

    takenSpots.add(king2);

    newBoard[king1.y][king1.x].piece = PiecesType.King;
    newBoard[king1.y][king1.x].color = Teams.White;

    newBoard[king2.y][king2.x].piece = PiecesType.King;
    newBoard[king2.y][king2.x].color = Teams.Black;

    // Add random pieces
    for (let i = 0; i < 6; i++) {
      let piece;
      do piece = { x: Math.floor(Math.random() * 8), y: Math.floor(Math.random() * 8) };
      while (takenSpots.has(piece));

      takenSpots.add(piece);

      const pieceType = possiblePieces[Math.floor(Math.random() * possiblePieces.length)];

      newBoard[piece.y][piece.x].piece = pieceType;
      newBoard[piece.y][piece.x].color = Math.random() > 0.5 ? Teams.White : Teams.Black;
    }

    // Update the board
    setGeneratedBoard(newBoard);
  }

  const [count, setCount] = useState(0);

  const totalTimeLimit = 60 * 1000 * 5; // 5 minutes

  useEffect(() => {
    if (!isRunning) return;

    if (count * minimaxProps.maxTime >= totalTimeLimit) return; // Run 30 times
    generateBoard();
    if (!generatedBoard) return;
    setCount((prev) => prev + 1);
    const bestMove = getBestMove(generatedBoard, minimaxProps);

    const result = { board: generatedBoard, bestMove };
    const previousResults = localStorage.getItem("chess_results");
    if (previousResults) {
      const parsedResults = JSON.parse(previousResults);
      parsedResults.push(result);
      localStorage.setItem("chess_results", JSON.stringify(parsedResults));
    } else localStorage.setItem("chess_results", JSON.stringify([result]));

    console.log(result);
  }, [generatedBoard, isRunning]);
}
