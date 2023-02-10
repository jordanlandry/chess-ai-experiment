import properties, { KeyStringObject } from "../properties";

interface Move {
  from: {x: number, y: number},
  to: {x: number, y: number},
  piece: number,
  castle?: boolean,
}

const values:KeyStringObject = {
  "P": 1,
  "N": 3,
  "B": 3,
  "R": 5,
  "Q": 9,
  "K": 100,

  "p": 1,
  "n": 3,
  "b": 3,
  "r": 5, 
  "q": 9,
  "k": 100
}

// Order the moves how likely they are to be the best move
export default function orderMoves(board: number[][], moves: Move[], prevBestMove: Move | null = null) {
  const numToPiece = properties.aiIsWhite ? properties.numPairWhite : properties.numPairBlack;

  const orderedMoves = [];
  interface NewMove extends Move {
    score: number,
  }
  
  // If the move is a capture, it's probably a good move
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    let score = 0;

    // If the move is a capture, it's probably a good move
    if (board[move.to.y][move.to.x] !== -1) {
      score+=5;

      const value = values[numToPiece[board[move.to.y][move.to.x]]];
      score += value > 0 ? value : -value;

      // If the move is a capture of a piece that is worth more than the piece being moved, it's a good move
      // if (isMax) {
      //   if (values[numToPiece[board[move.to.y][move.to.x]]] < values[numToPiece[board[move.from.y][move.from.x]]]) {
      //     score+=5;
      //   }
      // }
      // else {
      //   if (values[numToPiece[board[move.to.y][move.to.x]]] < values[numToPiece[board[move.from.y][move.from.x]]]) {
      //     score+=5;
      //   }
      // }
    };

    // If the move is a castle, it's probably a good move
    if (move.castle) score += 2;

    // If the move is the same as the previous best move, it's probably a good move
    if (prevBestMove) {
      if (board[move.to.y][move.to.x] === board[prevBestMove.to.y][prevBestMove.to.x] && board[move.from.y][move.from.x] === board[prevBestMove.from.y][prevBestMove.from.x]) {
          score++;
      }
    }

    orderedMoves.push({...move, score});
  }

  // Order the moves by score
  orderedMoves.sort((a: NewMove, b: NewMove) => b.score - a.score);
  return orderedMoves;

}