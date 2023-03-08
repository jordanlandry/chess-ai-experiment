import { Teams } from "../properties";

export const PuzzleTypes = {
  MateInOne: "Mate in One",
  Checkmate: "Checkmate",
  WinMaterial: "Win Material",
  Mixed: "Mixed",
} as { [key: string]: string };

export const puzzleProps = {
  puzzleType: PuzzleTypes.Mixed,
} as { [key: string]: string };

// The reason the board is like this and not the 1d number array is to make it easier for me to write these puzzles
// It is a lot more human readable this way than the 1d array with numbers.
// I will have a function to convert it over to the 1d array, as performance here doesn't matter like it would in minimax.
// This is to make it easier for the user to see what team they are playing as.

export const puzzleData = [
  {
    id: 1,
    difficulty: 1,
    type: PuzzleTypes.MateInOne,
    board: [
      ["k", "", "", "b", "", "", "", ""],
      ["", "", "", "R", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "Q", "", "", "", "K", ""],
    ],
    solution: [{ from: 58, to: 2 }],
    currentTurn: Teams.White,
  },

  {
    id: 2,
    difficulty: 3,
    type: PuzzleTypes.MateInOne,
    board: [
      ["r", "R", "", "", "Q", "", "r", ""],
      ["", "", "", "n", "P", "", "", ""],
      ["q", "", "", "B", "P", "R", "", ""],
      ["b", "B", "P", "", "", "", "", ""],
      ["", "", "p", "p", "", "", "", ""],
      ["", "", "k", "", "", "", "", ""],
      ["p", "", "N", "", "", "", "", ""],
      ["n", "", "", "", "", "", "K", ""],
    ],
    solution: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ],
    currentTurn: Teams.White,
  },

  {
    id: 3,
    difficulty: 3,
    type: PuzzleTypes.Checkmate,
    board: [
      ["", "", "b", "B", "", "", "", ""],
      ["p", "", "p", "", "", "", "", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "Q", "", "p", "k", "", ""],
      ["", "", "", "", "", "P", "", "P"],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "", "", "", "", ""],
      ["", "K", "R", "", "", "", "", "R"],
    ],
    solution: [
      { from: 26, to: 28 },
      { from: 29, to: 38 },
    ],
    currentTurn: Teams.White,
  },
];
