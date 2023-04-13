import React, { useContext, useEffect, useState } from "react";
import useClickPiece from "../hooks/mouse/useClickPiece";
import useDragPiece from "../hooks/mouse/useDragPiece";
import useAI from "../hooks/useAI";
import useBoardBound from "../hooks/useBoardBound";
import useGetAvailableMoves from "../hooks/useGetAvailableMoves";
import handleMakeMove from "../makeMove";
import { EndGameState, Teams, WinStates } from "../properties";
import { Board, Move, MoveEvaluation, Team } from "../types";
import EvaluationBar from "./EvaluationBar";
import Pieces from "./Pieces";
import SideTab from "./board/SideTab";
import AvailableCapture from "./overlays/AvailableCapture";
import AvailableMove from "./overlays/AvailableMove";
import HoveredSquare from "./overlays/HoveredSquare";
import LastMove from "./overlays/LastMove";
import SelectedPiece from "./overlays/SelectedPiece";

import "./_scss/moveEvaluation.scss";

import { Store } from "../App";

type Props = {
  turn?: Teams;
  usingAI?: boolean;
  setLastMove?: React.Dispatch<React.SetStateAction<Move>>;
  isPuzzle?: boolean;
  lastMoveSet?: Move;
};

export default function Chess({ turn, usingAI, setLastMove, isPuzzle, lastMoveSet }: Props) {
  const ANIMATION_TIME_MS = 100;
  const { squareSize, boardLeft, boardTop } = useBoardBound();

  const { setScore, score } = useContext(Store);

  // AI
  const [usingAi, setUsingAi] = useState(usingAI ?? true);
  const [aiTeam, setAiTeam] = useState<Team>("black");
  const [depth, setDepth] = useState(0);
  const [mateIn, setMateIn] = useState(-1);
  const [aiThinking, setAiThinking] = useState(false);

  // Game
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Team>("white");
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // prettier-ignore
  const STARTING_BOARD: Board = [
    [{ piece: 'r', id: 0, hasMoved: false}, { piece: 'n', id: 1, hasMoved: false}, { piece: 'b', id: 2, hasMoved: false}, { piece: 'q', id: 3, hasMoved: false}, { piece: 'k', id: 4, hasMoved: false,}, { piece: 'b', id: 5, hasMoved: false}, { piece: 'n', id: 6, hasMoved: false}, { piece: 'r', id: 7, hasMoved: false}],
    [{ piece: 'p', id: 8, hasMoved: false}, { piece: 'p', id: 9, hasMoved: false}, { piece: 'p', id: 10, hasMoved: false}, { piece: 'p', id: 11, hasMoved: false}, { piece: 'p', id: 12, hasMoved: false,}, { piece: 'p', id: 13, hasMoved: false}, { piece: 'p', id: 14, hasMoved: false}, { piece: 'p', id: 15, hasMoved: false},],
    [{ piece: ' ', id: 16, hasMoved: false}, { piece: ' ', id: 17, hasMoved: false}, { piece: ' ', id: 18, hasMoved: false}, { piece: ' ', id: 19, hasMoved: false}, { piece: ' ', id: 20, hasMoved: false,}, { piece: ' ', id: 21, hasMoved: false}, { piece: ' ', id: 22, hasMoved: false}, { piece: ' ', id: 23, hasMoved: false},],
    [{ piece: ' ', id: 24, hasMoved: false}, { piece: ' ', id: 25, hasMoved: false}, { piece: ' ', id: 26, hasMoved: false}, { piece: ' ', id: 27, hasMoved: false}, { piece: ' ', id: 28, hasMoved: false,}, { piece: ' ', id: 29, hasMoved: false}, { piece: ' ', id: 30, hasMoved: false}, { piece: ' ', id: 31, hasMoved: false},],
    [{ piece: ' ', id: 32, hasMoved: false}, { piece: ' ', id: 33, hasMoved: false}, { piece: ' ', id: 34, hasMoved: false}, { piece: ' ', id: 35, hasMoved: false}, { piece: ' ', id: 36, hasMoved: false,}, { piece: ' ', id: 37, hasMoved: false}, { piece: ' ', id: 38, hasMoved: false}, { piece: ' ', id: 39, hasMoved: false},],
    [{ piece: ' ', id: 40, hasMoved: false}, { piece: ' ', id: 41, hasMoved: false}, { piece: ' ', id: 42, hasMoved: false}, { piece: ' ', id: 43, hasMoved: false}, { piece: ' ', id: 44, hasMoved: false,}, { piece: ' ', id: 45, hasMoved: false}, { piece: ' ', id: 46, hasMoved: false}, { piece: ' ', id: 47, hasMoved: false},],
    [{ piece: 'P', id: 48, hasMoved: false}, { piece: 'P', id: 49, hasMoved: false}, { piece: 'P', id: 50, hasMoved: false}, { piece: 'P', id: 51, hasMoved: false}, { piece: 'P', id: 52, hasMoved: false,}, { piece: 'P', id: 53, hasMoved: false}, { piece: 'P', id: 54, hasMoved: false}, { piece: 'P', id: 55, hasMoved: false},],
    [{ piece: 'R', id: 56, hasMoved: false}, { piece: 'N', id: 57, hasMoved: false}, { piece: 'B', id: 58, hasMoved: false}, { piece: 'Q', id: 59, hasMoved: false}, { piece: 'K', id: 60, hasMoved: false,}, { piece: 'B', id: 61, hasMoved: false}, { piece: 'N', id: 62, hasMoved: false}, { piece: 'R', id: 63, hasMoved: false},]
  ];
  // const STARTING_BOARD: Board = [
  //   [{ piece: 'r', id: 0, hasMoved: false}, { piece: 'n', id: 1, hasMoved: false}, { piece: 'b', id: 2, hasMoved: false}, { piece: 'q', id: 3, hasMoved: false}, { piece: 'k', id: 4, hasMoved: false,}, { piece: 'b', id: 5, hasMoved: false}, { piece: 'n', id: 6, hasMoved: false}, { piece: 'r', id: 7, hasMoved: false}],
  //   [{ piece: 'r', id: 8, hasMoved: false}, { piece: 'p', id: 9, hasMoved: false}, { piece: 'p', id: 10, hasMoved: false}, { piece: ' ', id: 11, hasMoved: false}, { piece: 'p', id: 12, hasMoved: false,}, { piece: ' ', id: 13, hasMoved: false}, { piece: 'p', id: 14, hasMoved: false}, { piece: 'p', id: 15, hasMoved: false},],
  //   [{ piece: ' ', id: 16, hasMoved: false}, { piece: ' ', id: 17, hasMoved: false}, { piece: ' ', id: 18, hasMoved: false}, { piece: ' ', id: 19, hasMoved: false}, { piece: ' ', id: 20, hasMoved: false,}, { piece: ' ', id: 21, hasMoved: false}, { piece: ' ', id: 22, hasMoved: false}, { piece: ' ', id: 23, hasMoved: false},],
  //   [{ piece: ' ', id: 24, hasMoved: false}, { piece: ' ', id: 25, hasMoved: false}, { piece: ' ', id: 26, hasMoved: false}, { piece: ' ', id: 27, hasMoved: false}, { piece: ' ', id: 28, hasMoved: false,}, { piece: ' ', id: 29, hasMoved: false}, { piece: ' ', id: 30, hasMoved: false}, { piece: ' ', id: 31, hasMoved: false},],
  //   [{ piece: ' ', id: 32, hasMoved: false}, { piece: ' ', id: 33, hasMoved: false}, { piece: ' ', id: 34, hasMoved: false}, { piece: ' ', id: 35, hasMoved: false}, { piece: ' ', id: 36, hasMoved: false,}, { piece: ' ', id: 37, hasMoved: false}, { piece: ' ', id: 38, hasMoved: false}, { piece: ' ', id: 39, hasMoved: false},],
  //   [{ piece: ' ', id: 40, hasMoved: false}, { piece: ' ', id: 41, hasMoved: false}, { piece: ' ', id: 42, hasMoved: false}, { piece: ' ', id: 43, hasMoved: false}, { piece: ' ', id: 44, hasMoved: false,}, { piece: ' ', id: 45, hasMoved: false}, { piece: ' ', id: 46, hasMoved: false}, { piece: ' ', id: 47, hasMoved: false},],
  //   [{ piece: ' ', id: 48, hasMoved: false}, { piece: ' ', id: 49, hasMoved: false}, { piece: ' ', id: 50, hasMoved: false}, { piece: ' ', id: 51, hasMoved: false}, { piece: ' ', id: 52, hasMoved: false,}, { piece: ' ', id: 53, hasMoved: false}, { piece: ' ', id: 54, hasMoved: false}, { piece: ' ', id: 55, hasMoved: false},],
  //   [{ piece: ' ', id: 56, hasMoved: false}, { piece: ' ', id: 57, hasMoved: false}, { piece: 'R', id: 58, hasMoved: false}, { piece: ' ', id: 59, hasMoved: false}, { piece: ' ', id: 60, hasMoved: false,}, { piece: ' ', id: 61, hasMoved: false}, { piece: ' ', id: 62, hasMoved: false}, { piece: 'K', id: 63, hasMoved: false},]
  // ];

  // prettier-ignore
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(STARTING_BOARD)) as Board);
  const [boardHistory, setBoardHistory] = useState<Board[]>([JSON.parse(JSON.stringify(STARTING_BOARD)) as Board]);

  const [moveEvalation, setMoveEvaluation] = useState<MoveEvaluation>("");

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
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  const makeMove = (move: Move) => {
    handleMakeMove({
      move,
      board,
      setBoard,
      setAvailableMoves,
      setCurrentTurn,
      setMoveHistory,
      setBoardHistory,
      ANIMATION_TIME_MS,
      squareSize,
      boardLeft,
      boardTop,
    });
  };

  const { selectedPosition, setSelectedPosition } = useClickPiece({ board, availableMoves, makeMove, currentTurn, aiThinking });
  useGetAvailableMoves({ board, selectedPosition, setAvailableMoves, boardHistory });
  useDragPiece({ board, availableMoves, setSelectedPosition, makeMove, currentTurn, aiThinking });

  useAI({ board, currentTurn, makeMove, aiTeam, setScore, score, setMoveEvaluation, setDepth, setMateIn, setAiThinking, setSelectedPosition });

  const [pieceElements, setPieceElements] = useState<JSX.Element>();

  // This is to only initialize the pieces once, otherwise they will be re-initialized every time the board is updated
  // Which would cause issues with the animations
  useEffect(() => {
    setPieceElements(<Pieces board={board} />);
  }, [boardLeft, boardTop, squareSize]);

  // --------------------------------------------------
  return (
    <div>
      {pieceElements}

      {availableMoves.map((move, index) => {
        if (board[move.to.y][move.to.x].piece === " ") return <AvailableMove key={index} position={move.to} />;
        return <AvailableCapture key={index} position={move.to} />;
      })}

      <SelectedPiece position={selectedPosition} />

      <LastMove from={moveHistory[moveHistory.length - 1]?.from} to={moveHistory[moveHistory.length - 1]?.to} />

      {hoveredPosition !== null ? <HoveredSquare position={hoveredPosition} /> : null}

      <SideTab right={false} showBackground={false} sideOffset={-10}>
        <EvaluationBar mateIn={mateIn} />
      </SideTab>
      <SideTab right={true}>
        <div className={`move-evaluation ${moveEvalation}`}>{moveEvalation}</div>
        <div>Depth: {depth ? depth : null}</div>

        {/* <MoveHistory moveHistory={moveHistory} board={board} />

        <div>Your estimated ELO is 1500</div>
        <div>
          <button>
            <Icon type="plus" />
          </button>
          <button>
            <Icon type="chevron-left" />
          </button>
          <button>
            <Icon type="chevron-right" />
          </button>
        </div> */}
      </SideTab>
    </div>
  );
}
