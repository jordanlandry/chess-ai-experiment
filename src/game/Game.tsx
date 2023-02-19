import { useState } from "react";
import BoardOverlay from "../components/BoardOverlay";
import useMouseDown from "../hooks/mouse/useMouseDown";
import useMouseMove from "../hooks/mouse/useMouseMove";
import useMouseUp from "../hooks/mouse/useMouseUp";
import useLoad from "../hooks/useLoad";
import useCenterPieces from "../hooks/usePieceCentering";
import { useSelectedpiecePosition } from "../hooks/useSelectedPiecePosition";
import { Moves, PiecesType, STARTING_BOARD, Teams } from "../properties";

export default function Game1() {
  const loaded = useLoad();

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [whosTurn, setTurn] = useState(Teams.White);
  const [board, setBoard] = useState(STARTING_BOARD.map((row) => [...row]));
  const [availableMoves, setAvailableMoves] = useState<Moves[]>([]);
  const [moveHistory, setMoveHistory] = useState<Moves[]>([]);

  const [mouseDown, setMouseDown] = useState(false);

  const [selectedPiece, setSelectedPiece] = useMouseDown(board, setBoard, setAvailableMoves, setMouseDown, whosTurn, setTurn, setMoveHistory);

  useMouseUp(board, setBoard, setSelectedPiece, whosTurn, setTurn, availableMoves, setAvailableMoves, setMouseDown, setMoveHistory);
  useMouseMove(mouseDown, selectedPiece);
  useCenterPieces(board);

  const availableMoveOverlayElements = availableMoves.map((move, i) => {
    const { x, y } = move.to;
    const { piece, color } = board[y][x];
    if (piece === PiecesType.None) return <BoardOverlay key={i} x={x} y={y} style="available" />;
    return <BoardOverlay key={i} x={move.to.x} y={move.to.y} style="capture" />;
  });

  const { selectedPieceX, selectedPieceY } = useSelectedpiecePosition(board, selectedPiece);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (!loaded) return null;
  return (
    <div>
      <BoardOverlay x={selectedPieceX} y={selectedPieceY} style="selected" />
      {availableMoveOverlayElements}
    </div>
  );
}
