import { PieceType } from "../properties";

export default function findPositionById(board: PieceType[][], id: number) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j].id === id) return { x: j, y: i };
    }
  }

  return { x: -1, y: -1 };
}
