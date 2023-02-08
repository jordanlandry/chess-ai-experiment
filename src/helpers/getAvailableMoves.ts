import properties from "../properties";

let lastMove = "";

// Returns an array of board indexes that are available to move to
export default function getAvailableMoves(piece: number, board: number[][]) {
  const moves = [];
  const p = properties.numToPiece[piece];

  // ~~~ WHITE PAWN ~~~ \\
  if (p === "p") {
  }
}
