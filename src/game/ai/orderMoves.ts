import { Moves, PiecesType, PieceType } from "../../properties";

export default function orderMoves(board: PieceType[][], moves: Moves[], isMaximizing: boolean) {
  const orderedMoves: Moves[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    // If the move is a capture, we want to put it at the front
    if (board[move.to.y][move.to.x].piece !== PiecesType.None) {
      orderedMoves.unshift(move);
    }

    orderedMoves.push(move);
  }

  return orderedMoves;
}
