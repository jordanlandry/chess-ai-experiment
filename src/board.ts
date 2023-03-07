import { squareIsAttacked } from "./game/getAvailableMoves";
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

// prettier-ignore
// export const whiteAttacks = [
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   true, true, true, true, true, true, true, true,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
// ]

// // prettier-ignore
// export const blackAttacks = [
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   true, true, true, true, true, true, true, true,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
//   false, false, false, false, false, false, false, false,
// ]
export const whiteAttacks = [
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
]

// prettier-ignore
export const blackAttacks = [
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false,
]

interface Piece {
  [key: number]: number;
}

export const castleWhoHasMoved = {
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
const boardKeys = [
  0x9D39247E33776D41, 0x2AF7398005AAA5C7, 0x44DB015024623547, 0x9C15F73E62A76AE2, 0x75834465489C0C89, 0x3290AC3A203001BF, 0x0FBBAD1F61042279, 0xE83A908FF2FB60CA,
  0x0D7E765D58755C10, 0x1A083822CEAFE02D, 0x9605D5F0E25EC3B0, 0xD021FF5CD13A2ED5,0x40BDF15D4A672E32, 0x011355146FD56395, 0x5DB4832046F3D9E5, 0x239F8B2D7FF719CC,
  0x05D1A1AE85B49AA1, 0x679F848F6E8FC971, 0x7449BBFF801FED0B, 0x7D11CDB1C3B7ADF0, 0x82C7709E781EB7CC, 0xF3218F1C9510786C, 0x331478F3AF51BBE6, 0x4BB38DE5E7219443,
  0xAA649C6EBCFD50FC, 0x8DBD98A352AFD40B, 0x87D2074B81D79217, 0x19F3C751D3E92AE1, 0xB4AB30F062B19ABF, 0x7B0500AC42047AC4, 0xC9452CA81A09D85D, 0x24AA6C514DA27500,
  0x4C9F34427501B447, 0x14A68FD73C910841, 0xA71B9B83461CBD93, 0x03488B95B0F1850F, 0x637B2B34FF93C040, 0x09D1BC9A3DD90A94, 0x3575668334A1DD3B, 0x735E2B97A4C45A23,
  0x18727070F1BD400B, 0x1FCBACD259BF02E7, 0xD310A7C2CE9B6555, 0xBF983FE0FE5D8244, 0x9F74D14F7454A824, 0x51EBDC4AB9BA3035, 0x5C82C505DB9AB0FA, 0xFCF7FE8A3430B241,
  0x3253A729B9BA3DDE, 0x8C74C368081B3075, 0xB9BC6C87167C33E7, 0x7EF48F2B83024E20, 0x11D505D4C351BD7F, 0x6568FCA92C76A243, 0x4DE0B0F40F32A7B8, 0x96D693460CC37E5D,
  0x42E240CB63689F2F, 0x6D2BDCDAE2919661, 0x42880B0236E4D951, 0x5F0F4A5898171BB6, 0x39F890F579F92F88, 0x93C5B5F47356388B, 0x63DC359D8D231B78, 0xEC16CA8AEA98AD76,
]

// prettier-ignore
const boardKeysRand = [
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
  Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(),
]

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

// prettier-ignore
const indexToXYObject = { 0: { x: 0, y: 0 }, 1: { x: 1, y: 0 }, 2: { x: 2, y: 0 }, 3: { x: 3, y: 0 }, 4: { x: 4, y: 0 }, 5: { x: 5, y: 0 }, 6: { x: 6, y: 0 }, 7: { x: 7, y: 0 }, 8: { x: 0, y: 1 }, 9: { x: 1, y: 1 }, 10: { x: 2, y: 1 }, 11: { x: 3, y: 1 }, 12: { x: 4, y: 1 }, 13: { x: 5, y: 1 }, 14: { x: 6, y: 1 }, 15: { x: 7, y: 1 }, 16: { x: 0, y: 2 }, 17: { x: 1, y: 2 }, 18: { x: 2, y: 2 }, 19: { x: 3, y: 2 }, 20: { x: 4, y: 2 }, 21: { x: 5, y: 2 }, 22: { x: 6, y: 2 }, 23: { x: 7, y: 2 }, 24: { x: 0, y: 3 }, 25: { x: 1, y: 3 }, 26: { x: 2, y: 3 }, 27: { x: 3, y: 3 }, 28: { x: 4, y: 3 }, 29: { x: 5, y: 3 }, 30: { x: 6, y: 3 }, 31: { x: 7, y: 3 }, 32: { x: 0, y: 4 }, 33: { x: 1, y: 4 }, 34: { x: 2, y: 4 }, 35: { x: 3, y: 4 }, 36: { x: 4, y: 4 }, 37: { x: 5, y: 4 }, 38: { x: 6, y: 4 }, 39: { x: 7, y: 4 }, 40: { x: 0, y: 5 }, 41: { x: 1, y: 5 }, 42: { x: 2, y: 5 }, 43: { x: 3, y: 5 }, 44: { x: 4, y: 5 }, 45: { x: 5, y: 5 }, 46: { x: 6, y: 5 }, 47: { x: 7, y: 5 }, 48: { x: 0, y: 6 }, 49: { x: 1, y: 6 }, 50: { x: 2, y: 6 }, 51: { x: 3, y: 6 }, 52: { x: 4, y: 6 }, 53: { x: 5, y: 6 }, 54: { x: 6, y: 6 }, 55: { x: 7, y: 6 }, 56: { x: 0, y: 7 }, 57: { x: 1, y: 7 }, 58: { x: 2, y: 7 }, 59: { x: 3, y: 7 }, 60: { x: 4, y: 7 }, 61: { x: 5, y: 7 }, 62: { x: 6, y: 7 }, 63: { x: 7, y: 7 } } as { [key: number]: { x: number; y: number } };
// prettier-ignore
const indexToXYArr = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }];

// For some reason, this is faster on the first call, but then slower on subsequent calls
// I feel like the array should be the fastest, but it's not but only on the first call... Weird
export function calcXY(pos: number) {
  const x = pos % 8;
  const y = Math.floor(pos / 8);

  return { x, y };
}

export function lookupObjectXY(pos: number) {
  return indexToXYObject[pos];
}

export function lookupArrayXY(pos: number) {
  return indexToXYArr[pos];
}

export const pieceValues = {
  [PiecesType.Pawn]: 1,
  [PiecesType.Knight]: 3,
  [PiecesType.Bishop]: 3,
  [PiecesType.Rook]: 5,
  [PiecesType.Queen]: 9,
  [PiecesType.King]: 20000,
} as { [key: string]: number };

// The reason for this is because this is faster than .length, and we'll need to check this a lot with minimax
// So this will be updated every time a piece is captured
// TODO Use this in minimax instead of .length
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

export let lastMove: Move | null = null;

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
    if (piece === PiecesType.King) castleWhoHasMoved[team].king = true;
    if (piece === PiecesType.Rook) {
      if (from === 0 || from === 56) castleWhoHasMoved[team].leftRook = true;
      if (from === 7 || from === 63) castleWhoHasMoved[team].rightRook = true;
    }
  }

  // Update the spots that are attacked
  // We need to update the pieces that were being attacked before the move
  // And the pieces that are being attacked after the move
  // updateAttackedSquares(from, to, team);

  // updateAttackedSquaresTest();
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
}

// This was to test if squareIsAttacked was working correctly,
// I have a test component that highlights the squares that are attacked
function updateAttackedSquaresTest() {
  // Go through the board
  for (let i = 0; i < 64; i++) {
    whiteAttacks[i] = squareIsAttacked(i, Teams.White);
  }

  for (let i = 0; i < 64; i++) {
    blackAttacks[i] = squareIsAttacked(i, Teams.Black);
  }
}

// TODO - This is a bit of a mess, clean it up and also finish it
// I'll probably need to rework it because if you move a piece there are a lot of
// Things that will change. You'll need to update multiple pieces and not just the piece
// That was moved. For now I will update the attacked squares when the move generation is called
// The more I think about it the more I think I'll need to keep track of what each piece is attacking

function updateAttackedSquares(from: number, to: number, team: Teams) {
  const attacks = team === Teams.White ? whiteAttacks : blackAttacks;

  // Rook
  if (board[to] === Rook) {
    const prevX = from % 8;
    const prevY = Math.floor(from / 8);

    const newX = to % 8;
    const newY = Math.floor(to / 8);

    // Up
    if (prevY === newY) {
      let blocked = false;
      for (let i = 1; i < 8; i++) {
        if (from - i * 8 > 0) attacks[from - i * 8] = false; // No longer attacked

        // Newly attacked
        const newlyAttacked = to - i * 8;
        if (!blocked) {
          if (board[newlyAttacked] === 0) attacks[newlyAttacked] = true; // No piece in the way
          if (board[newlyAttacked] > 0) blocked = true; // Your own piece is blocking

          // Enemy piece is blocking
          if (board[newlyAttacked] < 0) {
            attacks[newlyAttacked] = true;
            blocked = true;
          }
        }
      }

      // Down
      for (let i = 1; i < 8; i++) {
        let blocked = false;
        if (from + i * 8 < 64) attacks[from + i * 8] = false; // No longer attacked

        // Newly attacked
        const newlyAttacked = to + i * 8;
        if (!blocked) {
          if (board[newlyAttacked] === 0) attacks[newlyAttacked] = true; // No piece in the way
          if (board[newlyAttacked] > 0) blocked = true; // Your own piece is blocking

          // Enemy piece is blocking
          if (board[newlyAttacked] < 0) {
            attacks[newlyAttacked] = true;
            blocked = true;
          }
        }
      }
    }
  }

  // Pawn
  if (board[to] === Pawn) {
    const prevX = from % 8;
    const prevY = Math.floor(from / 8);

    const newX = to % 8;
    const newY = Math.floor(to / 8);

    // Up
    // Can attack left and right diagonally
    // Remove the previous attacks
    board[from - 7] === 0 && attacks[from - 7] && (attacks[from - 7] = false);
    board[from - 9] === 0 && attacks[from - 9] && (attacks[from - 9] = false);

    // Add the new attacks
    board[to - 7] === 0 && (attacks[to - 7] = true);
    board[to - 9] === 0 && (attacks[to - 9] = true);
  }
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
