import { Moves, PiecesType, PieceType } from "../../properties";

export default function orderMoves(board: PieceType[][], moves: Moves[], prevBestMoves: Moves[], isMaximizing: boolean) {
  // const orderedMoves: Moves[] = new Array();
  const orderedMoves: Moves[] = [];

  let left = 0;
  let right = moves.length - 1;
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    
    // Move the previous best move to the front of the array
    if (prevBestMoves.length > 0 && move.from.x === prevBestMoves[0].from.x && move.from.y === prevBestMoves[0].from.y && move.to.x === prevBestMoves[0].to.x && move.to.y === prevBestMoves[0].to.y) {
      orderedMoves.unshift(move);
      // orderedMoves[left] = move;
      // left++;
    }
    
    // If the move is a capture, we want to put it at the front
    else if (board[move.to.y][move.to.x].piece !== PiecesType.None) {
      // orderedMoves[left] = move;
      // left++;
      orderedMoves.unshift(move);
    }

    // else if (move.promotion) {
    //   // orderedMoves[left] = move;
    //   // left++;
    //   orderedMoves.unshift(move);
    // }

    // else if (move.castle) {
    //   // orderedMoves[left] = move;
    //   // left++;
    //   orderedMoves.unshift(move);
    // }
    
    else {
      // orderedMoves[right] = move;
      // right--;
      orderedMoves.push(move);
    } 
  }

  // console.log(left, right);
  // console.log(orderedMoves)

  return orderedMoves;
}
