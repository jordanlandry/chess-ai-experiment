import { board, Move, Queen, Rook } from "../../board";
import { currentDepth, Minimax, minimaxProperties, previousBestMoves } from "./minimax";

export default function orderMovesTest(moves: Move[], previousBestMove: Move, isMax: boolean, depth: number) {
  // Sort previousBestMoves
  // if (depth === currentDepth - 1) {
  //   if (isMax) previousBestMoves[currentDepth].max[depth].sort((a, b) => b.score - a.score);
  //   if (!isMax) previousBestMoves[currentDepth].min[depth].sort((a, b) => a.score - b.score);
  // }

  const orderedMoves = [] as Minimax[];
  const movesWithConfidence = [] as { move: Move; confidence: number }[];

  for (let i = 0; i < moves.length; i++) {
    let confidence = 0;
    const { from, to, castle, enPassant } = moves[i];

    // If the move is the previous best move, give it a high confidence
    if (from === previousBestMove.from && to === previousBestMove.to) {
      confidence += 100;
    }

    // increase confidence if the move is a capture
    // Increase more based on the value of the piece being captured
    const pieceAtTo = board[to];
    if (pieceAtTo) {
      confidence += 10;
      if (pieceAtTo === Queen) confidence += 9;
      else if (pieceAtTo === Rook) confidence += 5;
    }

    if (castle) confidence += 5;
    if (enPassant) confidence += 5;

    movesWithConfidence.push({ move: moves[i], confidence });
  }

  movesWithConfidence.sort((a, b) => b.confidence - a.confidence);

  const numberOfMovesToReturn = Math.ceil(minimaxProperties.movesPercent * moves.length);

  for (let i = 0; i < numberOfMovesToReturn; i++) {
    orderedMoves.push({ move: movesWithConfidence[i].move, score: 0 });
  }

  return orderedMoves;

  // This should work similary but it makes the AI make some really bad moves
  // Not sure why but I'll leave it here for now because this is the way I want it to work
  // As this is much more efficient than the other way
  // Currently without move ordering, it thinks to a depth of 7 in 2.5 seconds
  // With the above code, it does a depth of 8 in 2.5 seconds
  // With the below code, it does a depth of 9 in 2.5 seconds but won't play good moves at all
  // Like it'll literally just leave a hanging queen for no benefit it's really bad :(

  // const orderedMoves: Move[] = Array.from(moves);

  // let left = 0;
  // let right = moves.length - 1;

  // while (left < right) {
  //   const move = moves[left];
  //   const target = board[move.to];

  //   // Prioritize captures
  //   if (target !== 0) {
  //     orderedMoves[left] = move;
  //     left++;
  //   } else orderedMoves[right] = move;

  //   left++;
  //   right--;
  // }

  // return orderedMoves;
}
