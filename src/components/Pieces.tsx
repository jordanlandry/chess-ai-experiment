import useBoardBound from "../hooks/useBoardBound";
import { Board } from "../types";
import Piece from "./Piece";

type Props = { board: Board };

export default function Pieces({ board }: Props) {
  return (
    <div>
      {board.map((row, i) =>
        row.map((piece, j) => {
          if (piece.piece === " ") return null;
          return <Piece id={piece.id} key={piece.id} piece={piece.piece} position={{ x: j, y: i }} board={board} />;
        })
      )}
    </div>
  );
}
