import { Moves, PiecesType, PieceType } from "../../properties";

export default function orderMoves(board: PieceType[][], moves: Moves[], prevBestMoves: Moves[], isMaximizing: boolean) {
  let left = 0;
  let right = moves.length - 1;

  const movesWithConfidence: { move: Moves; confidence: number }[] = [];
  for (let i = 0; i < moves.length; i++) {
    let confidence = 0;
    const move = moves[i];

    // Move the previous best move to the front of the array
    if (
      prevBestMoves.length > 0 &&
      move.from.x === prevBestMoves[0].from.x &&
      move.from.y === prevBestMoves[0].from.y &&
      move.to.x === prevBestMoves[0].to.x &&
      move.to.y === prevBestMoves[0].to.y
    ) {
      confidence += 100;
    }

    // If the move is a capture, we want to put it at the front
    if (board[move.to.y][move.to.x].piece !== PiecesType.None) {
      confidence += 50;
    }

    if (move.promotion) {
      confidence += 25;
    }

    movesWithConfidence.push({ move, confidence });
  }

  // Sort the moves by confidence but ordered moves should just be an array of moves
  movesWithConfidence.sort((a, b) => b.confidence - a.confidence);
  const orderedMoves = movesWithConfidence.map((move) => move.move);

  return orderedMoves;
}
