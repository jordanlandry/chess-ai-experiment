import { useContext, useState } from "react";
import { ChangingStylesContext } from "../App";
import { board, Move } from "../board";
import useAITest from "../hooks/game/useAI";
import useMouseDown from "../hooks/mouse/useMouseDown";
import usePieceCenteringTest from "../hooks/usePieceCentering";
import { Teams } from "../properties";
import AvailableCapture from "./overlays/AvailableCapture";
import AvailableMove from "./overlays/AvailableMove";
import LastMove from "./overlays/LastMove";
import SelectedPiece from "./overlays/SelectedPiece";
import TestElement from "./Testing/TestElement";

export default function Chess() {
  // Imports
  const changingStyles = useContext(ChangingStylesContext);

  // AI
  const [usingAi, setUsingAi] = useState(true);
  const [aiTeam, setAiTeam] = useState(usingAi ? Teams.Black : Teams.None);

  // Game
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState(Teams.White);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Mouse hooks
  const [mouseDown, setMouseDown] = useState(false);

  const { selectedPiece, setSelectedPiece } = useMouseDown(changingStyles!, currentTurn, setAvailableMoves, setCurrentTurn);

  useAITest(currentTurn, aiTeam, setCurrentTurn);
  usePieceCenteringTest(setCurrentTurn);

  return (
    <div>
      {availableMoves.map((move, i) => {
        if (board[move.to] === 0) return <AvailableMove key={i} index={move.to} />;
        return <AvailableCapture key={i} index={move.to} />;
      })}

      <SelectedPiece index={selectedPiece} />

      <LastMove from={moveHistory[moveHistory.length - 1]?.from} to={moveHistory[moveHistory.length - 1]?.to} />

      {/* <TestElement /> */}
    </div>
  );
}
