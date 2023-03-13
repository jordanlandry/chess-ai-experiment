import { getAvailableMoves, squareIsAttacked } from "./game/getAvailableMoves";
import { PiecesType, Teams } from "./properties";

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

export const castleMoveProperties = {
  [Teams.White]: {
    rightRook: false,
    leftRook: false,
    king: false,
  } as { [key: string]: boolean },

  [Teams.Black]: {
    rightRook: false,
    leftRook: false,
    king: false,
  } as { [key: string]: boolean },
} as { [key: string]: { [key: string]: boolean } };

// Keep track of the piece positions so we can check right away instead of looping through the board
// The value is the board index of the piece
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

// prettier-ignore
const boardKeysRand = Array(64).fill(0).map((_) => Math.random());

export const updateLastMoveProps = {
  updateLastMove: true,
};

// This will be added to the key if these pieces have been moved
const castleMap = {
  wrRook: Math.random(),
  wlRook: Math.random(),
  wKing: Math.random(),

  brRook: Math.random(),
  blRook: Math.random(),
  bKing: Math.random(),
};

// The position that is en passantable (only 1 is possible at a time) if none, it is -1
export let enPassant = -1;

export function getKey() {
  let key = 0;
  for (let i = 0; i < 64; i++) {
    if (!board[i]) continue;
    key += boardKeysRand[i];
  }

  // Castling
  if (castleMap.wrRook) key += castleMap.wrRook;
  if (castleMap.wlRook) key += castleMap.wlRook;
  if (castleMap.wKing) key += castleMap.wKing;

  if (castleMap.brRook) key += castleMap.brRook;
  if (castleMap.blRook) key += castleMap.blRook;
  if (castleMap.bKing) key += castleMap.bKing;

  return key;
}

export function calcXY(pos: number) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  return { x, y };
}

export const readableBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

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

export let totalNumberOfPieces = 32;

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

export const Rook = 1;
export const Knight = 2;
export const Bishop = 4;
export const Queen = 8;
export const King = 16;
export const Pawn = 32;

export const fenToPieceHelper = {
  r: { piece: -Rook, piecePositions: BlackRooks },
  n: { piece: -Knight, piecePositions: BlackKnights },
  b: { piece: -Bishop, piecePositions: BlackBishops },
  q: { piece: -Queen, piecePositions: BlackQueens },
  k: { piece: -King, piecePositions: BlackKing },
  p: { piece: -Pawn, piecePositions: BlackPawns },
  R: { piece: Rook, piecePositions: WhiteRooks },
  N: { piece: Knight, piecePositions: WhiteKnights },
  B: { piece: Bishop, piecePositions: WhiteBishops },
  Q: { piece: Queen, piecePositions: WhiteQueens },
  K: { piece: King, piecePositions: WhiteKing },
  P: { piece: Pawn, piecePositions: WhitePawns },
  "": { piece: 0, piecePositions: [] },
} as { [key: string]: { piece: number; piecePositions: number[] } };

export const pieceToPiecePositions = {
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

export let lastMove: Move | null = null;

const pieceToFen = {
  [PiecesType.Pawn]: "p",
  [PiecesType.Rook]: "r",
  [PiecesType.Knight]: "n",
  [PiecesType.Bishop]: "b",
  [PiecesType.Queen]: "q",
  [PiecesType.King]: "k",
} as { [key: string]: string };

export function updateReadableBoard() {
  for (let i = 0; i < 64; i++) {
    const piece = board[i];
    const { x, y } = calcXY(i);

    if (piece === 0) readableBoard[y][x] = "";
    else {
      const team = getTeam(piece);
      const type = pieceType(piece);
      const fen = pieceToFen[type];

      readableBoard[y][x] = team === Teams.White ? fen.toUpperCase() : fen;
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function updatePiecePositions(
  piece: PiecesType,
  team: Teams,
  from: number,
  to: number,
  castle: boolean | undefined,
  doEnPassant: boolean | undefined,
  promotionPiece: number | undefined
) {
  const piecePositions = pieceToPiecePositions[team][piece];
  const pieceIndex = piecePositions.indexOf(from);

  // Update en passant
  if (updateLastMoveProps.updateLastMove) {
    if (piece === PiecesType.Pawn && Math.abs(from - to) === 16) enPassant = to;
    else enPassant = -1;
  }

  // En passant is speacial, so we need to handle it differently
  // If we are the white team, remove the piece below our new position
  // If we are the black team, remove the piece above our new position
  if (doEnPassant) {
    if (team === Teams.White) {
      board[to + 8] = 0;
      occupiedSquares[to + 8] = Teams.None;

      // Remove the piece from the black pawns array
      const blackPawnIndex = BlackPawns.indexOf(to + 8);
      BlackPawns.splice(blackPawnIndex, 1);
    }

    // Black team
    else {
      board[to - 8] = 0;
      occupiedSquares[to - 8] = Teams.None;

      // Remove the piece from the white pawns array
      const whitePawnIndex = WhitePawns.indexOf(to - 8);
      WhitePawns.splice(whitePawnIndex, 1);
    }
  }

  // Update piece positions
  piecePositions[pieceIndex] = to;

  // If it was a castle, we need to update the rook's position by running this function again
  if (castle) {
    if (to === 62) updatePiecePositions(PiecesType.Rook, team, 63, 61, undefined, undefined, undefined);
    if (to === 58) updatePiecePositions(PiecesType.Rook, team, 56, 59, undefined, undefined, undefined);
    if (to === 6) updatePiecePositions(PiecesType.Rook, team, 7, 5, undefined, undefined, undefined);
    if (to === 2) updatePiecePositions(PiecesType.Rook, team, 0, 3, undefined, undefined, undefined);
  }

  // If you capture a piece you need the position to be removed from it's array
  if (board[to] !== 0) {
    const capturedPiece = pieceType(board[to]);
    const capturedPiecePositions = pieceToPiecePositions[team === Teams.White ? Teams.Black : Teams.White][capturedPiece];
    const capturedPieceIndex = capturedPiecePositions.indexOf(to);
    capturedPiecePositions.splice(capturedPieceIndex, 1);

    // Update the counts
    pieceCounts[team === Teams.White ? Teams.Black : Teams.White][capturedPiece]--;
    totalNumberOfPieces--;
  }

  board[to] = board[from];
  board[from] = 0;

  // If it was a promotion, we need to remove the pawn and add the new piece
  if (promotionPiece) {
    const promotionPieceType = pieceType(promotionPiece);
    if (team === Teams.Black) promotionPiece *= -1;
    piecePositions.splice(pieceIndex, 1);

    pieceToPiecePositions[team][promotionPieceType].push(to);
    board[to] = promotionPiece;
  }

  // Update the occupied squares
  occupiedSquares[from] = Teams.None;
  occupiedSquares[to] = team;

  // Update the last move
  if (updateLastMoveProps.updateLastMove) {
    lastMove = { from, to, castle, enPassant: doEnPassant, promoteTo: promotionPiece };

    // Update castling properties
    if (piece === PiecesType.King) castleMoveProperties[team].king = true;
    if (piece === PiecesType.Rook) {
      if (from === 0 || from === 56) castleMoveProperties[team].leftRook = true;
      if (from === 7 || from === 63) castleMoveProperties[team].rightRook = true;
    }
  }

  // updateAvailableMoves({ from, to, castle, enPassant: doEnPassant, promoteTo: promotionPiece });
}

// When undoing, the from and to are given in reverse order from the move that was actually made
export function undoPiecePosition(
  piece: PiecesType,
  team: Teams,
  from: number,
  to: number,
  castle: boolean | undefined,
  doEnPassant: boolean | undefined,
  promotionPiece: number | undefined,
  capturedPiece?: number
) {
  const piecePositions = pieceToPiecePositions[team][piece];
  const pieceIndex = piecePositions.indexOf(from);

  piecePositions[pieceIndex] = to;

  // If it was an en passant, we need to add the piece back to the board
  if (doEnPassant) {
    // If we are the white team, add the piece below our from position
    if (team === Teams.White) {
      const target = from + 8;
      board[target] = -Pawn;
      occupiedSquares[target] = Teams.Black;

      // Add the piece to the black pawns array
      BlackPawns.push(target);
    } else {
      const target = from - 8;
      board[target] = Pawn;
      occupiedSquares[target] = Teams.White;

      // Add the piece to the white pawns array
      WhitePawns.push(target);
    }
  }

  // If it was a castle, run the same function again but with the rook
  if (castle) {
    if (from === 62) undoPiecePosition(PiecesType.Rook, team, 61, 63, undefined, undefined, undefined);
    if (from === 58) undoPiecePosition(PiecesType.Rook, team, 59, 56, undefined, undefined, undefined);
    if (from === 6) undoPiecePosition(PiecesType.Rook, team, 5, 7, undefined, undefined, undefined);
    if (from === 2) undoPiecePosition(PiecesType.Rook, team, 3, 0, undefined, undefined, undefined);
  }

  // If you capture a piece you need the position to be added to it's array
  if (capturedPiece) {
    const capturedPieceType = pieceType(capturedPiece);
    const capturedPiecePositions = pieceToPiecePositions[team === Teams.White ? Teams.Black : Teams.White][capturedPieceType];
    capturedPiecePositions.push(from);

    // Update the counts
    pieceCounts[team === Teams.White ? Teams.Black : Teams.White][capturedPieceType]++;

    totalNumberOfPieces++;
  }

  // Update the board
  board[to] = board[from];
  board[from] = capturedPiece || 0;

  // If it was a promotion, we need to remove the new piece and add the pawn back
  if (promotionPiece) {
    const promotedPieceType = pieceType(promotionPiece);
    const promotedPiecePositions = pieceToPiecePositions[team][promotedPieceType];
    const promotedPieceIndex = promotedPiecePositions.indexOf(to);
    promotedPiecePositions.splice(promotedPieceIndex, 1);

    pieceToPiecePositions[team][PiecesType.Pawn].push(to);

    board[to] = team === Teams.White ? Pawn : -Pawn;
  }

  // To undo the castle properties, we need a local state from the move that was made, because
  // From the AI, it gets called recursively, and the properties will be overwritten on each iteration.
  // So we need to save the properties before they are overwritten
  // In order to do this, I am going to update it in recursive calls from the AI as that is the only place
  // where it would work properly ~ Similar to the capturedPiece property

  // Update the occupied squares
  occupiedSquares[to] = team;
  occupiedSquares[from] = capturedPiece ? (team === Teams.White ? Teams.Black : Teams.White) : Teams.None;

  // updateAvailableMoves({ from, to, castle, enPassant: doEnPassant, promoteTo: promotionPiece });
}

// This will only be called if there are no moves available
// So I don't need to check for that in this function so
// I only have to check if the king is attacked
export function inStalemate(team: Teams) {
  const king = team === Teams.White ? WhiteKing[0] : BlackKing[0];
  return !squareIsAttacked(king, team === Teams.White ? Teams.Black : Teams.White);
}

export interface Move {
  from: number;
  to: number;
  castle?: boolean;
  enPassant?: boolean;
  promoteTo?: number;
}

export async function setBoard(newBoard: string[][]) {
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

    const team = newBoard[y][x] === newBoard[y][x].toUpperCase() ? Teams.White : Teams.Black;
    if (newBoard[y][x] !== "") {
      occupiedSquares[i] = team;
      fenToPieceHelper[newBoard[y][x]].piecePositions.push(i);
    }

    board[i] = fenToPieceHelper[newBoard[y][x]].piece;
  }
}

function getInitialAvailableMoves() {
  const moves = [] as Move[][];
  new Array(64).fill(0).forEach((_, i) => moves.push(getAvailableMoves(i, occupiedSquares[i])));
  return moves;
}

// export function getBlackMoves() {
//   const moves = [] as Move[];
//   getBlackPieces().forEach((square) => moves.push(...getAvailableMovesTest(square, Teams.Black)));
//   return moves;
// }

// export function getWhiteMoves() {
//   const moves = [] as Move[];
//   getWhitePieces().forEach((square) => moves.push(...getAvailableMovesTest(square, Teams.White)));
//   return moves;
// }
