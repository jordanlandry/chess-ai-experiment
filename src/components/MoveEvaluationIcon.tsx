import { Check, ExclamationLg, X, XLg } from "react-bootstrap-icons";
import { Move } from "../board";
import useBoardBound from "../hooks/useBoardBound";
import "./_scss/evaluationIcons.scss";

export enum MoveEvaluationType {
  Good = "icon-good",
  Mistake = "icon-mistake",
  Neutral = "icon-neutral",
  Blunder = "icon-blunder",
  Brilliant = "icon-brilliant",
  Best = "icon-best",
}

type Props = { evalType: MoveEvaluationType; move: Move };

export default function MoveEvaluationIcon({ evalType, move }: Props) {
  const x = move.to % 8;
  const y = Math.floor(move.to / 8);

  const { boardLeft, boardTop, squareSize } = useBoardBound();

  return (
    <div
      className={`eval-icon ${evalType}`}
      style={{
        left: boardLeft + x * squareSize + squareSize / 2 + squareSize / 4,
        top: boardTop + y * squareSize + squareSize / 2 - squareSize / 1.5,
        width: squareSize / 2 + "px",
        height: squareSize / 2 + "px",
      }}
    >
      {evalType === MoveEvaluationType.Best ? (
        <Check />
      ) : evalType === MoveEvaluationType.Blunder ? (
        <X />
      ) : evalType === MoveEvaluationType.Brilliant ? (
        <>
          <ExclamationLg />
        </>
      ) : evalType === MoveEvaluationType.Good ? (
        <Check />
      ) : evalType === MoveEvaluationType.Mistake ? (
        <XLg />
      ) : evalType === MoveEvaluationType.Neutral ? (
        <XLg />
      ) : (
        <XLg />
      )}
    </div>
  );
}
