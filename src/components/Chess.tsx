import { useState } from "react";
import { board, Move } from "../board";
import useAITest from "../hooks/game/useAI";
import useMouseDownTest from "../hooks/mouse/useMouseDownTest";
import useMouseUp from "../hooks/mouse/useMouseUp";
import useMouseUpTest from "../hooks/mouse/useMouseUpTest";
import usePieceCenteringTest from "../hooks/usePieceCenteringTest";
import { Teams } from "../properties";
import AvailableCapture from "./overlays/AvailableCapture";
import AvailableMove from "./overlays/AvailableMove";

export default function Chess() {
  // AI
  const [usingAi, setUsingAi] = useState(true);
  const [aiTeam, setAiTeam] = useState(usingAi ? Teams.Black : Teams.None);

  // Game
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState(Teams.White);

  // Mouse hooks
  const [mouseDown, setMouseDown] = useState(false);

  const [selectedPiece, setSelectedPiece] = useMouseDownTest(currentTurn, setAvailableMoves, setCurrentTurn);

  useAITest(currentTurn, aiTeam, setCurrentTurn);
  usePieceCenteringTest();

  return (
    <div>
      {availableMoves.map((move, i) => {
        if (board[move.to] === 0) return <AvailableMove key={i} index={move.to} />;
        return <AvailableCapture key={i} index={move.to} />;
      })}
    </div>
  );
}
