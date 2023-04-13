import { Board, Position, Team } from "../types";

export default function getTeam(board: Board, position: Position): Team {
  const piece = board[position.y][position.x].piece;
  if (piece.toLowerCase() === piece) return "black";
  return "white";
}
