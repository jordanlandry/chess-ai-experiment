import { boardToKey, KeyStringObject, Moves, PiecesType, PieceType, STARTING_BOARD, Teams } from "../../../properties";

const boards = [
  {
    position: [
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
        { piece: PiecesType.None, color: Teams.Black, id: 26, hasMoved: false },
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
        { piece: PiecesType.Pawn, color: Teams.White, id: 52, hasMoved: true },
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
        { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false },
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
    ],
    turn: Teams.Black,
    response: {
      from: { x: 4, y: 1 },
      to: { x: 4, y: 3 },
      piece: {
        piece: PiecesType.Pawn,
        color: Teams.Black,
        id: 12,
      },
    },
  },
];

// Converts the board positions into board hash and adds the response
export function generateOpenings() {
  const openings = {} as { [key: string]: { from: { x: number; y: number }; to: { x: number; y: number }; piece: PieceType } };
  for (const board of boards) {
    const key = boardToKey(board.position, board.turn === Teams.White);
    openings[key] = board.response;
  }

  return openings;
}

const openings = generateOpenings() as { [key: string]: { from: { x: number; y: number }; to: { x: number; y: number }; piece: PieceType } };
export default openings;
