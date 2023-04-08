import React, { useContext } from "react";
import { Store } from "../App";

export default function EvaluationBar() {
  const { score } = useContext(Store);
  return <div>{score}</div>;
}
