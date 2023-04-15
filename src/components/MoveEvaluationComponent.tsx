import React, { useContext } from "react";
import { Store } from "../App";

import "./_scss/moveEvaluation.scss";
import { Board, Move, MoveEvaluation, Team } from "../types";
import getNameOfMove from "../helpers/getNameOfMove";
import getTeam from "../helpers/getTeam";
type Props = {
  lastMove: Move | null;
  board: Board;
  moveEvaluation: MoveEvaluation;
  aiTeam: Team;
};

export default function MoveEvaluationComponent({ lastMove, board, moveEvaluation, aiTeam }: Props) {
  const moveName = getNameOfMove(lastMove, board);

  if (!lastMove) return null;

  return (
    <div className="move-evaluation-wrapper">
      <div className="move-evaluation-name">{moveName}: </div>
      <div className={`move-evaluation-eval ${moveEvaluation}`}> {moveEvaluation}</div>
    </div>
  );
}
