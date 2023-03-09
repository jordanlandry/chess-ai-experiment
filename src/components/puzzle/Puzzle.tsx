import React, { useContext, useEffect, useState } from "react";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowLeftCircleFill,
  ArrowRight,
  ArrowRightCircleFill,
  FastForwardBtnFill,
  RewindBtnFill,
} from "react-bootstrap-icons";
import { Store } from "../../App";
import {
  BlackBishops,
  BlackKing,
  BlackKnights,
  BlackPawns,
  BlackQueens,
  BlackRooks,
  board,
  letterHelper,
  Move,
  occupiedSquares,
  WhiteBishops,
  WhiteKing,
  WhiteKnights,
  WhitePawns,
  WhiteQueens,
  WhiteRooks,
} from "../../board";
import centerPieces from "../../helpers/centerPieces";
import makeMove from "../../helpers/makeMove";
import useMouseDown from "../../hooks/mouse/useMouseDown";
import useMouseDownTest from "../../hooks/mouse/useMouseDown";
import usePieceCentering from "../../hooks/usePieceCentering";
import { Teams } from "../../properties";
import { puzzleData, puzzleProps } from "../../puzzles/puzzleData";
import Board from "../Board";
import Chess from "../Chess";
import Pieces from "../Pieces";

import "../_scss/puzzle.scss";

export default function Puzzle() {
  const { startPuzzle, setStartPuzzle } = useContext(Store);

  function setBoard(b: string[][]) {
    setStartPuzzle(false);

    // Reset occupied squares and pieces
    for (let i = 0; i < 64; i++) {
      occupiedSquares[i] = Teams.None;
    }

    // Reset white pieces
    WhitePawns.splice(0, WhitePawns.length);
    WhiteRooks.splice(0, WhiteRooks.length);
    WhiteKnights.splice(0, WhiteKnights.length);
    WhiteBishops.splice(0, WhiteBishops.length);
    WhiteQueens.splice(0, WhiteQueens.length);
    WhiteKing.splice(0, WhiteKing.length);

    // Reset black pieces
    BlackPawns.splice(0, BlackPawns.length);
    BlackRooks.splice(0, BlackRooks.length);
    BlackKnights.splice(0, BlackKnights.length);
    BlackBishops.splice(0, BlackBishops.length);
    BlackQueens.splice(0, BlackQueens.length);
    BlackKing.splice(0, BlackKing.length);

    for (let i = 0; i < 64; i++) {
      const x = i % 8;
      const y = Math.floor(i / 8);

      const team = b[y][x] === b[y][x].toUpperCase() ? Teams.White : Teams.Black;
      if (b[y][x] !== "") {
        occupiedSquares[i] = team;
        letterHelper[b[y][x]].piecePositions.push(i);
      }

      board[i] = letterHelper[b[y][x]].piece;
    }

    setStartPuzzle(true);
  }

  const [currentMove, setCurrentMove] = useState(-1);
  const [index, setIndex] = useState(1);
  const [turn, setTurn] = useState(Teams.None);
  const [lastMove, setLastMove] = useState<Move | undefined>(undefined);

  const handleNextMove = () => {
    setCurrentMove((prev) => {
      const { from, to } = puzzleData[index].solution[prev + 1];

      makeMove(from, to, undefined, undefined, undefined);
      centerPieces();

      return prev + 1;
    });
  };

  const handlePrevMove = () => {
    setCurrentMove((prev) => {
      const { from, to } = puzzleData[index].solution[prev];
      makeMove(to, from, undefined, undefined, undefined);
      centerPieces();

      return prev - 1;
    });
  };

  useEffect(() => {
    setBoard(puzzleData[index].board);
    setTurn(puzzleData[index].currentTurn);
  }, [index]);

  const handleReset = () => {
    setBoard(puzzleData[index].board);
    setTurn(puzzleData[index].currentTurn);
    setCurrentMove(-1);

    centerPieces();
  };

  useEffect(() => {
    if (!lastMove) return;

    if (lastMove.from === puzzleData[index].solution[currentMove + 1].from && lastMove.to === puzzleData[index].solution[currentMove + 1].to) {
      console.log("Correct");
      setCurrentMove((prev) => prev + 1);

      // Make the next move

      setTimeout(() => {
        handleNextMove();
      }, 500);
    } else {
      console.log("Incorrect");
      handleReset();
    }
  }, [lastMove]);

  return (
    <div className="puzzle-wrapper">
      {startPuzzle ? (
        <>
          <h1>{turn === Teams.Black ? "Black" : "White"} to move</h1>
          <Chess usingAI={false} turn={puzzleData[index].currentTurn} setLastMove={setLastMove} />
          <div className="puzzle-btn-wrapper">
            <button onClick={handlePrevMove} disabled={currentMove < 0}>
              <ArrowLeftCircleFill />
            </button>
            <button onClick={handleNextMove} disabled={currentMove === puzzleData[index].solution.length - 1}>
              <ArrowRightCircleFill />
            </button>
            <button onClick={handleReset}>
              <ArrowClockwise />{" "}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
