import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { Store } from "../App";
import { board, Move, Queen } from "../board";
import { depthTimes, functionTimes } from "../game/ai/minimax";
import useAITest from "../hooks/game/useAI";
import useMoveUpdater from "../hooks/game/useMoveUpdater";
import usePiecePromotion from "../hooks/game/usePiecePromotion";
import useMouseDown from "../hooks/mouse/useMouseDown";
import usePieceCenteringTest from "../hooks/usePieceCentering";
import { EndGameState, Teams, WinStates } from "../properties";
import FunctionTimeTable from "./FunctionTimeTable";
import GameOverScreen from "./GameOverScreen";
import AvailableCapture from "./overlays/AvailableCapture";
import AvailableMove from "./overlays/AvailableMove";
import LastMove from "./overlays/LastMove";
import SelectedPiece from "./overlays/SelectedPiece";
import PromotionSelect from "./PromotionSelect";

type Props = {
  turn?: Teams;
  usingAI?: boolean;
  setLastMove?: React.Dispatch<React.SetStateAction<Move | undefined>>;
  isPuzzle?: boolean;
};

export default function Chess({ turn, usingAI, setLastMove, isPuzzle }: Props) {
  const { changingStyles } = useContext(Store);

  // AI
  const [usingAi, setUsingAi] = useState(usingAI ?? true);
  const [aiTeam, setAiTeam] = useState(usingAi ? Teams.Black : Teams.None);

  // Game
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState(turn ?? Teams.White);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Game over
  const [gameOverOpen, setGameOverOpen] = useState(false);
  const [winState, setWinState] = useState<EndGameState>({
    isOver: false,
    winningTeam: Teams.None,
    wonBy: WinStates.None,
  });

  // Promotion
  const [promotionPosition, setPromotionPosition] = useState(-1);
  const [promotionPiece, setPromotionPiece] = useState(0);
  const [promotion, setPromotion] = useState<Move | null>(null);

  // Mouse hooks
  const [mouseDown, setMouseDown] = useState(false);

  const { selectedPiece, setSelectedPiece } = useMouseDown(
    changingStyles!,
    promotionPosition,
    currentTurn,
    setPromotionPosition,
    setAvailableMoves,
    setCurrentTurn,
    setPromotion
  );

  useMoveUpdater(currentTurn, setMoveHistory, setWinState, setGameOverOpen);

  useAITest(currentTurn, aiTeam, setCurrentTurn);
  usePieceCenteringTest(promotionPiece, moveHistory);

  // Promotion
  usePiecePromotion(promotion, promotionPiece, setPromotion, setPromotionPiece, setCurrentTurn);

  // Update last move (This is for the puzzle component)
  useEffect(() => {
    if (!setLastMove) return;
    if (moveHistory.length > 0) {
      setLastMove!(moveHistory[moveHistory.length - 1]);

      // This is for the puzzle component, this is to make sure the current turn is correct
      setCurrentTurn(turn!);
    }
  }, [moveHistory]);

  return (
    <div>
      {!isPuzzle ? <GameOverScreen winState={winState} aiTeam={aiTeam} open={gameOverOpen} setOpen={setGameOverOpen} /> : null}
      {availableMoves.map((move, i) => {
        // Only show one of the promotion moves
        if (move.promoteTo && move.promoteTo !== Queen && move.promoteTo !== -Queen) return null;

        if (board[move.to] === 0) return <AvailableMove key={i} index={move.to} />;
        else return <AvailableCapture key={i} index={move.to} />;
      })}

      <SelectedPiece index={selectedPiece} />

      <LastMove from={moveHistory[moveHistory.length - 1]?.from} to={moveHistory[moveHistory.length - 1]?.to} />

      <PromotionSelect
        index={promotionPosition}
        team={currentTurn}
        setPromotionPosition={setPromotionPosition}
        setPromotionPiece={setPromotionPiece}
      />
    </div>
  );
}
