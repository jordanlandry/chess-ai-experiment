import React from "react";
import SelectedPiece from "./SelectedPiece";
import { Move, Position } from "../../types";

type Props = { from: Position | null; to: Position | null };
export default function LastMove({ from, to }: Props) {
  if (!from || !to) return null;

  return (
    <>
      <SelectedPiece position={from} />
      <SelectedPiece position={to} />
    </>
  );
}
