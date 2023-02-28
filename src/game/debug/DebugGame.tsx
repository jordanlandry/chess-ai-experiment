import { useState } from "react";
import BoardOverlay from "../../components/BoardOverlay";
import Piece from "../../components/Piece";
import Promotion from "../../components/Promotion";
import useAI from "../../hooks/game/useAI";
import usePromotePiece from "../../hooks/game/usePromotePiece";
import useMouseDown from "../../hooks/mouse/useMouseDown";
import useMouseMove from "../../hooks/mouse/useMouseMove";
import useMouseUp from "../../hooks/mouse/useMouseUp";
import useBoardBound from "../../hooks/useBoardBound";
import useLoad from "../../hooks/useLoad";
import useCenterPieces from "../../hooks/usePieceCentering";
import usePrevMove from "../../hooks/usePrevMove";
import { useSelectedpiecePosition } from "../../hooks/useSelectedPiecePosition";
import { baseMinimaxResults, MinimaxReturn, Moves, PiecesType, PieceType, PromotionPieceType, STARTING_BOARD, Teams } from "../../properties";

import debugUseAI from "./debugUseAI";

export default function Game1() {
  const loaded = useLoad();

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [whosTurn, setTurn] = useState(Teams.White);
  const [aiTeam, setAiTeam] = useState(Teams.Black);
  const [board, setBoard] = useState(STARTING_BOARD.map((row) => [...row]));
  const [availableMoves, setAvailableMoves] = useState<Moves[]>([]);
  const [moveHistory, setMoveHistory] = useState<Moves[]>([]);
  const [boardHistory, setBoardHistory] = useState<PieceType[][][]>([STARTING_BOARD]);

  const [mouseDown, setMouseDown] = useState(false);
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

  // Set state for mouse hooks
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
    if (piece === PiecesType.None) return <BoardOverlay key={i} x={x} y={y} style="available" />;
    return <BoardOverlay key={i} x={move.to.x} y={move.to.y} style="capture" />;
  });

  const { selectedPieceX, selectedPieceY } = useSelectedpiecePosition(board, selectedPiece);

  usePromotePiece(promotionPiece, isPromoting, setPromotionPiece, setBoard, setIsPromoting, setTurn);

  // Image elements for promoted pieces as they aren't initially on the board
  const promotedPiecesElements = promotedPieces.map((promotedPiece, i) => {
    const { id, piece, color } = promotedPiece;
    return <Piece key={i} piece={piece} id={id} color={color} />;
  });

  const [minimaxMoves, setMinimaxMoves] = useState<MinimaxReturn[]>([]);

  debugUseAI(board, whosTurn, aiTeam, { ...setStateProps, setMinimaxMoves });

  const { boardLeft, boardTop } = useBoardBound();
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (!loaded) return null;
  return (
    <div style={{ fontSize: "1.25rem", textAlign: "center", position: "absolute", top: 100, left: boardLeft, transform: "translateX(-125%)" }}>
      {/* <div>Calculations: {minimaxMove?.count.toLocaleString()}</div>
      <div>Time: {minimaxMove?.time}ms</div> */}

      <table>
        <tbody>
          <tr>
            <th>Optimization</th>
            <th>Calculations</th>
            <th>Total time (ms)</th>
          </tr>
          <tr>
            <td>Alpha-beta pruning</td>
            <td>{minimaxMoves[0]?.count.toLocaleString()}</td>
            <td>{minimaxMoves[0]?.time}</td>
          </tr>

          <tr>
            <td>Transposition table</td>
            <td>{minimaxMoves[1]?.count.toLocaleString()}</td>
            <td>{minimaxMoves[1]?.time}</td>
          </tr>

          <tr>
            <td>Move Ordering</td>
            <td>{minimaxMoves[2]?.count.toLocaleString()}</td>
            <td>{minimaxMoves[2]?.time}</td>
          </tr>

          <tr>
            <td>Null Move Pruning</td>
            <td>{minimaxMoves[3]?.count.toLocaleString()}</td>
            <td>{minimaxMoves[3]?.time}</td>
          </tr>
        </tbody>
      </table>

      {/* <table style={{ margin: "auto" }}>
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
      </table> */}
    </div>
  );
}
