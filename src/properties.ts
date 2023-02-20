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
    available: "rgba(0, 0, 0, 0.1)",
    capture: "rgba(255, 0, 0, 0.5)",
    lastMove: "rgba(255, 255, 0, 0.5)",
  },

  animationTimeMs: 150,

  boardHistory: [] as PieceType[][][],
};

export enum Teams {
  White = "white",
  Black = "black",
  None = "",
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

export const STARTING_BOARD: PieceType[][] = [
  [
    { piece: PiecesType.Rook, color: Teams.Black, id: 0, hasMoved: false },
    { piece: PiecesType.Knight, color: Teams.Black, id: 1, hasMoved: false },
    { piece: PiecesType.Bishop, color: Teams.Black, id: 2, hasMoved: false },
    { piece: PiecesType.Queen, color: Teams.Black, id: 3, hasMoved: false },
    { piece: PiecesType.King, color: Teams.Black, id: 4, hasMoved: false },
    { piece: PiecesType.Bishop, color: Teams.Black, id: 5, hasMoved: false },
    { piece: PiecesType.Knight, color: Teams.Black, id: 6, hasMoved: false },
    { piece: PiecesType.Rook, color: Teams.Black, id: 7, hasMoved: false },
  ],
  [
    { piece: PiecesType.Pawn, color: Teams.Black, id: 8, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 9, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 10, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 11, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 12, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 13, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 14, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.Black, id: 15, hasMoved: false },
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
    { piece: PiecesType.Pawn, color: Teams.White, id: 48, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 49, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 50, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 51, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 52, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 53, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 54, hasMoved: false },
    { piece: PiecesType.Pawn, color: Teams.White, id: 55, hasMoved: false },
  ],
  [
    { piece: PiecesType.Rook, color: Teams.White, id: 56, hasMoved: false },
    { piece: PiecesType.Knight, color: Teams.White, id: 57, hasMoved: false },
    { piece: PiecesType.Bishop, color: Teams.White, id: 58, hasMoved: false },
    { piece: PiecesType.Queen, color: Teams.White, id: 59, hasMoved: false },
    { piece: PiecesType.King, color: Teams.White, id: 60, hasMoved: false },
    { piece: PiecesType.Bishop, color: Teams.White, id: 61, hasMoved: false },
    { piece: PiecesType.Knight, color: Teams.White, id: 62, hasMoved: false },
    { piece: PiecesType.Rook, color: Teams.White, id: 63, hasMoved: false },
  ],
];

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
}

export default properties;
