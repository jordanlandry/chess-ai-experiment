import { useEffect, useState } from "react";
import BoardOverlay from "../components/BoardOverlay";
import Piece from "../components/Piece";
import Promotion from "../components/Promotion";
import useAI from "../hooks/game/useAI";
import usePromotePiece from "../hooks/game/usePromotePiece";
import useMouseDown from "../hooks/mouse/useMouseDown";
import useMouseMove from "../hooks/mouse/useMouseMove";
import useMouseUp from "../hooks/mouse/useMouseUp";
import useBoardBound from "../hooks/useBoardBound";
import useLoad from "../hooks/useLoad";
import useCenterPieces from "../hooks/usePieceCentering";
import usePrevMove from "../hooks/usePrevMove";
import { useSelectedpiecePosition } from "../hooks/useSelectedPiecePosition";
import properties, {
  baseMinimaxResults,
  MinimaxReturn,
  Moves,
  PiecesType,
  PieceType,
  PromotionPieceType,
  STARTING_BOARD,
  Teams,
} from "../properties";

export default function Game1() {
  const loaded = useLoad();
  const { boardLeft } = useBoardBound();

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // AI
  const [whosTurn, setTurn] = useState(Teams.White);
  const [usingAi, setUsingAi] = useState(true);
  const [aiTeam, setAiTeam] = useState(usingAi ? Teams.Black : Teams.None);
  const [minimaxMove, setMinimaxMove] = useState<MinimaxReturn>(baseMinimaxResults);

  // Game
  const [board, setBoard] = useState(STARTING_BOARD.map((row) => [...row]));
  const [availableMoves, setAvailableMoves] = useState<Moves[]>([]);
  const [moveHistory, setMoveHistory] = useState<Moves[]>([]);
  const [boardHistory, setBoardHistory] = useState<PieceType[][][]>([STARTING_BOARD]);

  // Promotion
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotedPieces, setPromotedPieces] = useState<PromotionPieceType[]>([]);
  const [promotionPiece, setPromotionPiece] = useState<PromotionPieceType>({
    piece: PiecesType.None,
    color: Teams.None,
    id: -1,
    hasMoved: false,
    x: -1,
    y: -1,
  });

  // Mouse hooks
  const [mouseDown, setMouseDown] = useState(false);
  const setStateProps = {
    setBoard,
    setTurn,
    setAvailableMoves,
    setMouseDown,
    setMoveHistory,
    setBoardHistory,
    setIsPromoting,
    setPromotedPieces,
    setPromotionPiece,
  };
  const [selectedPiece, setSelectedPiece] = useMouseDown(board, whosTurn, aiTeam, isPromoting, setStateProps);
  useMouseUp(board, whosTurn, aiTeam, availableMoves, { ...setStateProps, setSelectedPiece });
  useMouseMove(mouseDown, selectedPiece);

  useCenterPieces(board);

  const { from, to } = usePrevMove(moveHistory);

  const availableMoveOverlayElements = availableMoves.map((move, i) => {
    const { x, y } = move.to;
    const { piece, color } = board[y][x];
    if (piece === PiecesType.None && !move.enPassant) return <BoardOverlay key={i} x={x} y={y} style="available" />;
    return <BoardOverlay key={i} x={move.to.x} y={move.to.y} style="capture" />;
  });

  const { selectedPieceX, selectedPieceY } = useSelectedpiecePosition(board, selectedPiece);

  usePromotePiece(promotionPiece, isPromoting, setPromotionPiece, setBoard, setIsPromoting, setTurn);

  // Image elements for promoted pieces as they aren't initially on the board
  const promotedPiecesElements = promotedPieces.map((promotedPiece, i) => {
    const { id, piece, color } = promotedPiece;
    return <Piece key={i} piece={piece} id={id} color={color} />;
  });

  useAI(board, whosTurn, aiTeam, { ...setStateProps, setMinimaxMove });

  // Update the global board history
  useEffect(() => {
    properties.boardHistory = boardHistory;
  }, [boardHistory]);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (!loaded) return null;
  return (
    <>
      <div>
        <BoardOverlay x={selectedPieceX} y={selectedPieceY} style="selected" />
        <BoardOverlay x={from.x} y={from.y} style="lastMove" />
        <BoardOverlay x={to.x} y={to.y} style="lastMove" />
        {availableMoveOverlayElements}

        {isPromoting ? (
          <Promotion
            team={whosTurn}
            x={moveHistory[moveHistory.length - 1].to.x}
            y={moveHistory[moveHistory.length - 1].to.y}
            setIsPromoting={setIsPromoting}
            setPromotionPiece={setPromotionPiece}
            setPromotedPieces={setPromotedPieces}
          />
        ) : null}

        {promotedPiecesElements}
      </div>
      <div style={{ fontSize: "1.25rem", textAlign: "center", position: "absolute", top: 100, left: boardLeft, transform: "translateX(-125%)" }}>
        <div>Score: {minimaxMove?.score.toLocaleString()}</div>
        <div>Calculations: {minimaxMove?.count.toLocaleString()}</div>
        <div>Time: {minimaxMove?.time}ms</div>

        <table style={{ margin: "auto" }}>
          <tbody>
            <tr>
              <th>Function</th>
              <th>Time</th>
              <th>Percent</th>
            </tr>
            {Object.keys(minimaxMove?.times || {}).map((key) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{minimaxMove?.times[key]}ms</td>
                  <td>{((minimaxMove?.times[key] / minimaxMove?.time) * 100).toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
