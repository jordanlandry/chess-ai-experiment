import getNameOfMove from "../helpers/getNameOfMove";
import useBoardBound from "../hooks/useBoardBound";
import { Board, Move } from "../types";
import "./_scss/moveHistory.scss";

type Props = {
  boardHistory: Board[];
  moveHistory: Move[];
};

export default function MoveHistory({ boardHistory, moveHistory }: Props) {
  const { boardWidth } = useBoardBound();

  return (
    <div style={{ height: `${boardWidth * 0.75}px` }}>
      <div className="move-history-wrapper">
        {moveHistory.map((move, index) => {
          return (
            <div key={index}>
              {index % 2 === 0 ? `${index / 2 + 1}. ` : ""}
              {getNameOfMove(move, boardHistory[index])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
