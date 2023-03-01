import React from "react";
import SelectedPiece from "./SelectedPiece";

type Props = { from: number | null; to: number | null };
export default function LastMove({ from, to }: Props) {
  if (!from || !to) return null;
  if (from < 0 || from > 63 || to < 0 || to > 63) return null;

  return (
    <>
      <SelectedPiece index={from} />
      <SelectedPiece index={to} />
    </>
  );
}
