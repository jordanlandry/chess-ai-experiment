import { useEffect, useState } from "react";
import getAvailableMoves from "../../game/getAvailableMoves";
import { movePiece } from "../../game/movePiece";
import getSpot from "../../helpers/getSpot";
import { Moves, PiecesType, PieceType, Teams } from "../../properties";

export default function useMouseDown(
  board: PieceType[][],
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  setAvailableMoves: React.Dispatch<React.SetStateAction<Moves[]>>,
  setMouseDown: React.Dispatch<React.SetStateAction<boolean>>,
  whosTurn: Teams,
  setTurn: React.Dispatch<React.SetStateAction<Teams>>,
  setMoveHistory: React.Dispatch<React.SetStateAction<Moves[]>>
) {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [selectedPiece, setSelectedPiece] = useState<PieceType>({ piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      const { x, y } = getSpot(e);

      // Invalid square
      if (x < 0 || x > 7 || y < 0 || y > 7) {
        setSelectedPiece({ piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false });
        return;
      }

      // Valid square - if you clicked on your own piece, select it and show available moves
      if (board[y][x].piece !== PiecesType.None && board[y][x].color === whosTurn) {
        setSelectedPiece(board[y][x]);
        setAvailableMoves(getAvailableMoves(board, { x, y }));
      }

      // If you selecting a square that's not a piece, deselect the piece, and move the piece if it's a valid move
      else {
        setSelectedPiece({ piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false });

        setAvailableMoves((prevMove) => {
          for (let i = 0; i < prevMove.length; i++) {
            if (prevMove[i].to.x === x && prevMove[i].to.y === y) {
              movePiece(board, setBoard, prevMove[i], setAvailableMoves, setTurn, setMoveHistory);
            }
          }

          return [];
        });
      }

      setMouseDown(true);
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [board, whosTurn]);

  return [selectedPiece, setSelectedPiece] as const;
}
