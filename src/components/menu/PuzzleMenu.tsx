// import React, { useContext } from "react";
// import { GameState, Store } from "../../App";
// import { puzzleProps, PuzzleTypes } from "../../puzzles/puzzleData";
// import BackButton from "./BackButton";
// import { SetMenuStateContext } from "./MainMenu";

// export default function PuzzleMenu() {
//   const setMenuState = React.useContext(SetMenuStateContext);

//   const { setGameState } = useContext(Store);

//   const handleClick = (puzzleType: string) => {
//     puzzleProps.puzzleType = PuzzleTypes[puzzleType];
//     setGameState(GameState.Puzzle);
//   };

//   return (
//     <>
//       <h1>Puzzles</h1>

//       {Object.keys(PuzzleTypes).map((puzzleType) => (
//         <button key={puzzleType} onClick={() => handleClick(puzzleType)}>
//           {PuzzleTypes[puzzleType]}
//         </button>
//       ))}
//       <BackButton />
//     </>
//   );
// }
