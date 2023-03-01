import { PiecesType, PieceType, Teams } from "./properties";

// prettier-ignore
// Keep track of occupied squares so we don't have to loop through the board
export const occupiedSquares = [
  Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black,
  Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black, Teams.Black,
  Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None,
  Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None,
  Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None,
  Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None, Teams.None,
  Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White,
  Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White, Teams.White,
]

interface Piece {
  [key: number]: number;
}

// Keep track of the piece positions so we can check right away instead of looping through the board
// The object key is the id of the piece (same as position in the starting position)
export const WhitePawns = [48, 49, 50, 51, 52, 53, 54, 55];
export const WhiteRooks = [56, 63];
export const WhiteKnights = [57, 62];
export const WhiteBishops = [58, 61];
export const WhiteQueens = [59];
export const WhiteKing = [60];

export const BlackPawns = [8, 9, 10, 11, 12, 13, 14, 15];
export const BlackRooks = [0, 7];
export const BlackKnights = [1, 6];
export const BlackBishops = [2, 5];
export const BlackQueens = [3];
export const BlackKing = [4];

export const INITIAL_WHITE_PAWN_Y = 6;
export const INITIAL_BLACK_PAWN_Y = 1;

function initZobrist() {
  const zobrist = new Array(64);
  for (let i = 0; i < 64; i++) {
    zobrist[i] = new Array(12);
    for (let j = 0; j < 12; j++) {
      zobrist[i][j] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
  }
  return zobrist;
}

export const zobrist = initZobrist();

export function getZobristKey() {
  let key = 0;
  for (let i = 0; i < 64; i++) {
    const piece = board[i];
    if (piece !== 0) {
      key ^= zobrist[i][Math.abs(piece) - 1];
    }
  }
  return key;
}

export const pieceValues = {
  [PiecesType.Pawn]: 100,
  [PiecesType.Knight]: 320,
  [PiecesType.Bishop]: 330,
  [PiecesType.Rook]: 500,
  [PiecesType.Queen]: 900,
  [PiecesType.King]: 20000,
} as { [key: string]: number };

// The reason for this is because this is faster than .length, and we'll need to check this a lot with minimax
// So this will be updated every time a piece is captured
export const pieceCounts = {
  [Teams.White]: {
    [PiecesType.Pawn]: 8,
    [PiecesType.Rook]: 2,
    [PiecesType.Knight]: 2,
    [PiecesType.Bishop]: 2,
    [PiecesType.Queen]: 1,
    [PiecesType.King]: 1,
  } as { [key: string]: number },

  [Teams.Black]: {
    [PiecesType.Pawn]: 8,
    [PiecesType.Rook]: 2,
    [PiecesType.Knight]: 2,
    [PiecesType.Bishop]: 2,
    [PiecesType.Queen]: 1,
    [PiecesType.King]: 1,
  } as { [key: string]: number },
} as { [key: string]: { [key: string]: number } };

// prettier-ignore
export const board = [
  -1, -2, -4, -8, -16, -4, -2, -1, 
  -32, -32, -32, -32, -32, -32, -32, -32, 
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 0, 0, 0, 0, 0, 
  32, 32, 32, 32, 32, 32, 32, 32,
  1, 2, 4, 8, 16, 4, 2, 1,
];

export function pieceType(id: number) {
  const piece = Math.abs(id);

  const idToPiece = {
    1: PiecesType.Rook,
    2: PiecesType.Knight,
    4: PiecesType.Bishop,
    8: PiecesType.Queen,
    16: PiecesType.King,
    32: PiecesType.Pawn,
  } as { [key: number]: PiecesType };

  return idToPiece[piece];
}

export function getTeam(id: number) {
  if (id === 0) return Teams.None;
  return id > 0 ? Teams.White : Teams.Black;
}

export const getWhitePieces = () => [...WhitePawns, ...WhiteRooks, ...WhiteKnights, ...WhiteBishops, ...WhiteQueens, ...WhiteKing];
export const getBlackPieces = () => [...BlackPawns, ...BlackRooks, ...BlackKnights, ...BlackBishops, ...BlackQueens, ...BlackKing];
export const getAllPieces = () => [...getWhitePieces(), ...getBlackPieces()];

export function updateOccupiedSquares(from: number, to: number, team: Teams) {
  occupiedSquares[from] = Teams.None;
  occupiedSquares[to] = team;
}

export function updateBoard(from: number, to: number) {
  board[to] = board[from];
  board[from] = 0;
}

const pieceToPiecePositions = {
  [Teams.White]: {
    [PiecesType.Pawn]: WhitePawns,
    [PiecesType.Rook]: WhiteRooks,
    [PiecesType.Knight]: WhiteKnights,
    [PiecesType.Bishop]: WhiteBishops,
    [PiecesType.Queen]: WhiteQueens,
    [PiecesType.King]: WhiteKing,
  } as { [key: string]: number[] },

  [Teams.Black]: {
    [PiecesType.Pawn]: BlackPawns,
    [PiecesType.Rook]: BlackRooks,
    [PiecesType.Knight]: BlackKnights,
    [PiecesType.Bishop]: BlackBishops,
    [PiecesType.Queen]: BlackQueens,
    [PiecesType.King]: BlackKing,
  } as { [key: string]: number[] },
} as { [key: number]: { [key: string]: number[] } };

export function updatePiecePositions(piece: PiecesType, team: Teams, from: number, to: number) {
  const piecePositions = pieceToPiecePositions[team][piece];
  const pieceIndex = piecePositions.indexOf(from);

  piecePositions[pieceIndex] = to;

  // If you capture a piece you need the position to be removed from it's array
  if (board[to] !== 0) {
    const capturedPiece = pieceType(board[to]);
    const capturedPiecePositions = pieceToPiecePositions[team === Teams.White ? Teams.Black : Teams.White][capturedPiece];
    const capturedPieceIndex = capturedPiecePositions.indexOf(to);
    capturedPiecePositions.splice(capturedPieceIndex, 1);
  }

  // Update the board
  board[to] = board[from];
  board[from] = 0;

  // Update the occupied squares
  occupiedSquares[from] = Teams.None;
  occupiedSquares[to] = team;
}

// When undoing, the from and to are given in reverse order from the move that was actually made
export function undoPiecePosition(piece: PiecesType, team: Teams, from: number, to: number, capturedPiece?: number) {
  const piecePositions = pieceToPiecePositions[team][piece];
  const pieceIndex = piecePositions.indexOf(from);

  piecePositions[pieceIndex] = to;

  // If you capture a piece you need the position to be added to it's array
  if (capturedPiece) {
    const capturedPieceType = pieceType(capturedPiece);
    const capturedPiecePositions = pieceToPiecePositions[team === Teams.White ? Teams.Black : Teams.White][capturedPieceType];
    capturedPiecePositions.push(from);

    // Update the counts
    pieceCounts[team === Teams.White ? Teams.Black : Teams.White][capturedPieceType]++;
  }

  // Update the board
  board[to] = board[from];
  board[from] = capturedPiece || 0;

  // Update the occupied squares
  occupiedSquares[to] = team;
  occupiedSquares[from] = capturedPiece ? (team === Teams.White ? Teams.Black : Teams.White) : Teams.None;
}

export interface Move {
  from: number;
  to: number;
}
