
interface Move {
  from: {x: number, y: number},
  to: {x: number, y: number},
  piece: number,
  castle?: boolean,
}

// Order the moves how likely they are to be the best move
export default function orderMoves(board: number[][], moves: Move[]) {
  const orderedMoves = [];
  interface NewMove extends Move {
    score: number,
  }
  
  // If the move is a capture, it's probably a good move
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    let score = 0;
    if (board[move.to.y][move.to.x] !== -1) score++;

    orderedMoves.push({...move, score});
  }

  // Order the moves by score
  orderedMoves.sort((a: NewMove, b: NewMove) => b.score - a.score);

  return orderedMoves.slice(0, Math.ceil(orderedMoves.length));
}