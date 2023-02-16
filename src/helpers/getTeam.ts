import properties from "../properties";

export default function getTeam(board: number[][], x: number, y: number) {
  const numToPiece = properties.aiIsWhite ? properties.numPairWhite : properties.numPairBlack;
  const piece = numToPiece[board[y][x]];

  if (!piece) return "none";

  // console.log(piece);
  return piece.toLowerCase() === piece ? "black" : "white";
}
