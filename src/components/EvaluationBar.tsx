import React, { useContext } from "react";
import { Store } from "../App";
import useBoardBound from "../hooks/useBoardBound";
import clamp from "../helpers/clamp";

type Props = {
  mateIn: number;
};

export default function EvaluationBar({ mateIn }: Props) {
  const { boardWidth } = useBoardBound();

  const { score } = useContext(Store);

  // Max score until the bar is completely filled
  const MAX_SCORE = 25;
  const MIN_SCORE = -25;

  // This is what I set the max score to in the minimax function (server/src/minimax.rs)
  const maxScore = 9_999_999;

  // Calculate the percentage of the bar that should be filled
  const percentage = clamp((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE), 0, 1);

  // Width of the bar in px
  const WIDTH = 20;

  const evaluation = Math.abs(score);

  let scoreString = "";
  if (evaluation % 1 === 0) scoreString = Math.abs(score).toFixed(0);
  else if (evaluation < 10) scoreString = Math.abs(score).toFixed(1);
  else scoreString = Math.abs(score).toFixed(0);

  if (mateIn > -1) scoreString = `M${mateIn}`;
  if (mateIn === 0) scoreString = "Checkmate";

  const DARK = "rgb(50, 50, 50)";
  const LIGHT = "rgb(240, 240, 240)";

  return (
    <div
      style={{
        height: boardWidth + "px",
        display: "flex",
        flexDirection: "column",
        justifyContent: score > 0 ? "flex-end" : "space-between",
        alignItems: "center",
        backgroundColor: DARK,
        width: WIDTH + "px",
      }}
    >
      {score > 0 ? (
        <div style={{ position: "absolute", color: DARK, marginBottom: "5px", fontSize: `${WIDTH * 0.65}px`, fontWeight: "bold" }}>{scoreString}</div>
      ) : null}

      <div style={{ color: LIGHT, marginTop: "5px", fontSize: `${WIDTH * 0.65}px`, fontWeight: "bold", display: score > 0 ? "none" : "block" }}>
        {scoreString}
      </div>

      <div style={{ backgroundColor: LIGHT, width: WIDTH + "px", height: `${boardWidth * percentage}px`, transition: "250ms" }}></div>
    </div>
  );
}
