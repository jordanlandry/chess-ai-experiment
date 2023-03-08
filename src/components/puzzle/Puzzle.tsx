import React, { useContext, useEffect, useState } from "react";
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
import makeMove from "../../helpers/makeMove";
import useMouseDown from "../../hooks/mouse/useMouseDown";
import useMouseDownTest from "../../hooks/mouse/useMouseDown";
import usePieceCentering from "../../hooks/usePieceCentering";
import { Teams } from "../../properties";
import { puzzleData, puzzleProps } from "../../puzzles/puzzleData";
import Board from "../Board";
import Chess from "../Chess";
import Pieces from "../Pieces";

export default function Puzzle() {
  function setBoard(b: string[][]) {
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

    setLoaded(true);
  }

  const [test, setTest] = useState(-1);

  const [index, setIndex] = useState(2);
  const [turn, setTurn] = useState(Teams.None);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBoard(puzzleData[index].board);
    setTurn(puzzleData[index].currentTurn);
  }, [index]);

  useEffect(() => {
    if (!loaded) return;

    const { from, to } = puzzleData[index].solution[test];
    makeMove(from, to, undefined, undefined, undefined);

    console.log(board);
  }, [test]);

  return (
    <>
      {loaded ? (
        <>
          <Chess turn={turn} usingAI={false} />
          <Board />
          <Pieces />

          <button onClick={() => setTest((prev) => prev + 1)}>Next Move</button>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
