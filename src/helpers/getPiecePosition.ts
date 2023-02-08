export default function getPiecePosition(piece: number, board: number[][]) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === piece) return { x: j, y: i };
    }
  }

  return { x: -1, y: -1 };
}
