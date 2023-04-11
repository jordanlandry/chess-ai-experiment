import { MoveEvaluation, Team } from "../types";

export default function evaluateMove(newScore: number, lastScore: number, currentTurn: Team): MoveEvaluation {
  const diff = newScore - lastScore;

  if (currentTurn === "white") {
    if (diff > 1) return "great";
    if (diff > -0.5) return "good";
    if (diff > -1) return "inaccuracy";
    if (diff > -2) return "mistake";
    return "blunder";
  }

  if (diff < -1) return "great";
  if (diff < 0.5) return "good";
  if (diff < 1) return "inaccuracy";
  if (diff < 2) return "mistake";
  return "blunder";
}
