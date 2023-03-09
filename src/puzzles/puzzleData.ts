import { Move } from "../board";
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

enum PuzzleDifficulties {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

interface Puzzle {
  id: number;
  difficulty: PuzzleDifficulties;
  type: keyof typeof PuzzleTypes;
  board: string[][];
  solution: Move[];
  currentTurn: Teams;
}

export const puzzleData: Puzzle[] = [
  {
    id: 1,
    difficulty: PuzzleDifficulties.Easy,
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
    difficulty: PuzzleDifficulties.Easy,
    type: PuzzleTypes.Checkmate,
    board: [
      ["", "r", "", "", "", "", "", "k"],
      ["", "", "p", "", "P", "", "", "p"],
      ["", "", "", "", "", "", "p", ""],
      ["", "", "p", "P", "", "", "", ""],
      ["p", "", "B", "", "", "P", "", ""],
      ["", "", "P", "", "Q", "", "", "P"],
      ["P", "", "", "K", "", "", "", ""],
      ["", "", "", "", "", "", "", "q"],
    ],
    solution: [
      { from: 1, to: 49 },
      { from: 51, to: 43 },
      { from: 63, to: 57 },
    ],
    currentTurn: Teams.Black,
  },
];
