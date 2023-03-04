export interface KeyStringObject {
  [key: string]: any;
}

const properties = {
  styles: {
    brown: {
      light: "#f0d9b5",
      dark: "#b58863",
    },

    green: {
      light: "#eeeed2",
      dark: "#769656",
    },

    grey: {
      light: "#ababab",
      dark: "#dcdcdc",
    },

    red: {
      light: "#ffdddd",
      dark: "#bb4444",
    },
  } as KeyStringObject,

  pieceStyles: ["cartoon", "wood", "jannin"],

  aiIsWhite: false,

  overlayColors: {
    selected: "rgba(255, 255, 0, 0.5)",
    available: "rgba(0, 0, 0, 0.15)",
    capture: "rgba(255, 0, 0, 0.5)",
    lastMove: "rgba(255, 255, 0, 0.5)",
  },

  animationTimeMs: 150,

  boardHistory: [] as PieceType[][][],

  currentId: 64,
};

export enum WinStates {
  Time = "time",
  Checkmate = "checkmate",
  Stalemate = "stalemate",
  RepeatMoves = "repeatMoves",
  None = "none",
}

export interface EndGameState {
  isOver: boolean;
  winningTeam: Teams;
  wonBy: WinStates;
}

export enum Teams {
  White = 0,
  Black = 1,
  None = -1,
}

export enum PiecesType {
  Pawn = "p",
  Rook = "r",
  Knight = "n",
  Bishop = "b",
  Queen = "q",
  King = "k",
  None = "",
}

export const takenPiece = {
  piece: PiecesType.None,
  color: Teams.None,
  id: -1,
  hasMoved: true,
};

export const blankPiece = {
  piece: PiecesType.None,
  color: Teams.None,
  id: -1,
  hasMoved: false,
};

export const audioSettings = {
  isPlaying: false,
};

// Interfaces
export interface PieceType {
  piece: PiecesType;
  color: Teams;
  id: number;
  hasMoved?: boolean;
  promotionPiece?: boolean;
}

export interface PromotionPieceType extends PieceType {
  x: number;
  y: number;
}

export interface Moves {
  from: { x: number; y: number };
  to: { x: number; y: number };
  piece: PieceType;
  enPassant?: boolean;
  castle?: {
    rookFrom: { x: number; y: number };
    rookTo: { x: number; y: number };
  };
  promotion?: boolean;
  promotionPiece?: PiecesType;
}

export interface MinimaxProps {
  aiIsWhite: boolean;
  difficulty: number;
  maxTime: number;
  useTimeLimit: boolean;
  maxDepth: number;
  doAlphaBeta: boolean;
  doMoveOrdering: boolean;
  doTranspositionTable: boolean;
  doQuiescence: boolean;
  doNullMove: boolean;
}

export interface MinimaxReturn {
  score: number;
  time: number;
  count: number;
  move: Moves;
  times: { [key: string]: number };
}

export const times = {
  gettingMoves: 0,
  evaluatingBoard: 0,
  orderingMoves: 0,
  makingMove: 0,
  undoingMove: 0,
  boardCopy: 0,
} as { [key: string]: number };

export const baseMinimaxResults: MinimaxReturn = {
  score: 0,
  time: 0,
  count: 0,
  move: {
    from: { y: -1, x: -1 },
    to: { y: -1, x: -1 },
    piece: {
      piece: PiecesType.None,
      color: Teams.None,
      id: -1,
    },
  },
  times: times,
};

// After lots of testing, I found that having a map of random is the fastest way of calculating the keys
// This is to generate a unique key for each board so we can store it in the transposition table
// This is much faster than converting the whole board array into a string and using that as the key
// And faster than using 1-64 as the keys
export const map = [
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
  [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
];

export function boardToKey(board: PieceType[][], isMaximizing: boolean) {
  let key = 1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      key += (board[i][j].id + 1) * map[i][j];
    }
  }

  key *= isMaximizing ? 1 : -1;

  return key + "";
}

export const kingPositions = {
  [Teams.White]: { x: 4, y: 7 },
  [Teams.Black]: { x: 4, y: 0 },
} as { [key: string]: { x: number; y: number } };

export default properties;
