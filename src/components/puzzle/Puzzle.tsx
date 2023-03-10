import { useContext, useEffect, useState } from "react";
import { ArrowCounterclockwise, ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons";
import { Store } from "../../App";
import { Move, setBoard } from "../../board";
import centerPieces from "../../helpers/centerPieces";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";
import { puzzleData, puzzleProps, PuzzleTypes } from "../../puzzles/puzzleData";
import Chess from "../Chess";
import MoveEvaluationIcon, { MoveEvaluationType } from "../MoveEvaluationIcon";

import "../_scss/puzzle.scss";

export default function Puzzle() {
  const { startPuzzle, setStartPuzzle } = useContext(Store);

  // Must await so the pieces render after the board is set when resetting the board
  // because of silly little react updating state asynchroneously... what a silly little guy react is ¯\_(ツ)_/¯
  async function handleSetBoard(b: string[][]) {
    await setStartPuzzle(false);
    await setBoard(b);
    await setStartPuzzle(true);
  }

  // Get all the puzzles of the current puzzle style
  const puzzles = puzzleProps.puzzleType === PuzzleTypes.Mixed ? puzzleData : puzzleData.filter((p) => p.type === puzzleProps.puzzleType);

  const [canReset, setCanReset] = useState(false);

  const [currentMove, setCurrentMove] = useState(-1);
  const [index, setIndex] = useState(Math.floor(Math.random() * puzzles.length));
  const [turn, setTurn] = useState(Teams.None);
  const [lastMove, setLastMove] = useState<Move | undefined>(undefined);

  const [numberOfPuzzlesPlayed, setNumberOfPuzzlesPlayed] = useState(0);

  const [puzzleOver, setPuzzleOver] = useState(false);

  async function nextPuzzle() {
    await setIndex(Math.floor(Math.random() * puzzles.length));
    handleReset();
  }

  const handleNextMove = () => {
    setCurrentMove((prev) => {
      const { from, to } = puzzles[index].solution[prev + 1];

      makeMove(from, to, undefined, undefined, undefined);
      centerPieces();

      return prev + 1;
    });
  };

  const handleReset = async () => {
    await handleSetBoard(puzzles[index].board);

    setTurn(puzzles[index].currentTurn);
    setCurrentMove(-1);
    setCanReset(false);

    centerPieces();
  };

  useEffect(() => {
    handleSetBoard(puzzles[index].board);
    setTurn(puzzles[index].currentTurn);
  }, [index]);

  useEffect(() => {
    if (!lastMove) return;
    if (currentMove + 1 === puzzles[index].solution.length - 1) {
      setPuzzleOver(true);
      return;
    }

    // If you made the correct move
    if (lastMove.from === puzzles[index].solution[currentMove + 1].from && lastMove.to === puzzles[index].solution[currentMove + 1].to) {
      setCurrentMove((prev) => prev + 1);

      // Make the next move
      setTimeout(() => {
        handleNextMove();
      }, 500);
    }

    // Made a wrong move
    else {
      setCanReset(true);
      centerPieces();
    }
  }, [lastMove]);

  return (
    <div className="puzzle-wrapper">
      {startPuzzle ? (
        <>
          <h1>{turn === Teams.Black ? "Black" : "White"} to move</h1>
          <Chess usingAI={false} turn={puzzles[index].currentTurn} setLastMove={setLastMove} isPuzzle={true} />
          <div className="puzzle-btn-wrapper">
            {canReset ? (
              <>
                <div className="puzzle-reset-wrapper">
                  <h2>Incorrect</h2>
                  <button onClick={handleReset}>
                    <ArrowCounterclockwise />
                  </button>
                </div>
                {lastMove ? <MoveEvaluationIcon evalType={MoveEvaluationType.Blunder} move={lastMove} /> : null}
              </>
            ) : lastMove ? (
              <MoveEvaluationIcon evalType={MoveEvaluationType.Best} move={lastMove} />
            ) : null}
          </div>
        </>
      ) : null}

      {puzzleOver ? <button onClick={nextPuzzle}>Next Puzzle</button> : null}
    </div>
  );
}
