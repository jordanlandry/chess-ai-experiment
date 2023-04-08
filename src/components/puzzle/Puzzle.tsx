// import { useContext, useEffect, useState } from "react";
// import { ArrowCounterclockwise, ArrowLeftCircleFill, ArrowRight, ArrowRightCircleFill } from "react-bootstrap-icons";
// import { Store } from "../../App";
// import centerPieces from "../../helpers/centerPieces";
// import makeMove from "../../helpers/makeMove";
// import { Teams } from "../../properties";
// import { puzzleData, puzzleProps, PuzzleTypes } from "../../puzzles/puzzleData";
// import SideTab from "../board/SideTab";

// import Chess from "../Chess";
// import MoveEvaluationIcon, { MoveEvaluationType } from "../MoveEvaluationIcon";

// import "../_scss/puzzle.scss";

// export default function Puzzle() {
//   const { startPuzzle, setStartPuzzle } = useContext(Store);

//   // Must await so the pieces render after the board is set when resetting the board
//   // because of silly little react updating state asynchroneously... what a silly little guy react is ¯\_(ツ)_/¯
//   async function handleSetBoard(b: string[][]) {
//     await setStartPuzzle(false);
//     // await setBoard(b);
//     await setStartPuzzle(true);
//   }

//   // Get all the puzzles of the current puzzle style
//   const puzzles = puzzleProps.puzzleType === PuzzleTypes.Mixed ? puzzleData : puzzleData.filter((p) => p.type === puzzleProps.puzzleType);

//   const [canReset, setCanReset] = useState(false);

//   const [currentMove, setCurrentMove] = useState(-1);
//   const [index, setIndex] = useState(Math.floor(Math.random() * puzzles.length));
//   const [turn, setTurn] = useState(Teams.None);
//   const [lastMove, setLastMove] = useState<any>({ from: -1, to: -1 });

//   const [numberOfPuzzlesPlayed, setNumberOfPuzzlesPlayed] = useState(0);

//   const [puzzleOver, setPuzzleOver] = useState(false);

//   async function nextPuzzle() {
//     await setIndex(Math.floor(Math.random() * puzzles.length));
//     handleReset();
//   }

//   const handleNextMove = () => {
//     setCurrentMove((prev) => {
//       const { from, to } = puzzles[index].solution[prev + 1];

//       makeMove(from, to, undefined, undefined, undefined);
//       centerPieces();

//       return prev + 1;
//     });
//   };

//   const handleReset = async () => {
//     await handleSetBoard(puzzles[index].board);

//     setTurn(puzzles[index].currentTurn);
//     setCurrentMove(-1);
//     setCanReset(false);
//     setPuzzleOver(false);

//     centerPieces();

//     setTimeout(() => {
//       setLastMove({ from: -1, to: -1 });
//     }, 1);
//   };

//   useEffect(() => {
//     handleSetBoard(puzzles[index].board);
//     setTurn(puzzles[index].currentTurn);
//   }, [index]);

//   useEffect(() => {
//     console.log(lastMove);
//     console.log(puzzles[index].solution);
//     console.log(currentMove + 1);
//     if (lastMove.from === -1) return;

//     let over = currentMove + 1 === puzzles[index].solution.length - 1;

//     // If you made the correct move
//     if (lastMove.from === puzzles[index].solution[currentMove + 1].from && lastMove.to === puzzles[index].solution[currentMove + 1].to) {
//       setCurrentMove((prev) => prev + 1);

//       // Make the next move
//       setTimeout(() => {
//         if (!over) handleNextMove();
//       }, 500);
//     }

//     // Made a wrong move
//     else {
//       setCanReset(true);
//       centerPieces();

//       return;
//     }

//     if (over) setPuzzleOver(true);
//   }, [lastMove]);

//   return (
//     <>
//       {startPuzzle ? (
//         <Chess usingAI={false} turn={puzzles[index].currentTurn} setLastMove={setLastMove} isPuzzle={true} lastMoveSet={lastMove} />
//       ) : null}

//       {startPuzzle ? (
//         <SideTab className="puzzle-info-wrapper" right={true}>
//           <h1>{turn === Teams.Black ? "Black" : "White"} to move</h1>
//           <h2>{puzzles[index].type}</h2>

//           <div className="puzzle-btn-wrapper">
//             {canReset ? (
//               <div className="puzzle-reset-wrapper">
//                 <h2>Incorrect</h2>
//                 <button onClick={handleReset}>
//                   <ArrowCounterclockwise />
//                 </button>
//               </div>
//             ) : null}
//           </div>

//           {puzzleOver ? (
//             <button onClick={nextPuzzle} className="button">
//               <ArrowRight /> Next Puzzle
//             </button>
//           ) : null}
//         </SideTab>
//       ) : null}

//       {lastMove.from !== -1 ? (
//         <MoveEvaluationIcon evalType={canReset ? MoveEvaluationType.Blunder : MoveEvaluationType.Best} move={lastMove} />
//       ) : null}
//     </>
//   );
// }
