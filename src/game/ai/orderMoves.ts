import { board, Move } from "../../board";

export default function orderMovesTest(moves: Move[]) {
  return moves;

  const orderedMoves: Move[] = Array.from(moves);

  let left = 0;
  let right = moves.length - 1;

  while (left < right) {
    const move = moves[left];
    const target = board[move.to];

    // Prioritize captures
    if (target !== 0) {
      orderedMoves[left] = move;
      left++;
    } else orderedMoves[right] = move;

    left++;
    right--;
  }

  // console.log(orderedMoves);
  return orderedMoves;
}
