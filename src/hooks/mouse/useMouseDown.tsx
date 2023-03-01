import { useEffect, useState } from "react";
import { board, Move, getTeam } from "../../board";
import getAvailableMoves from "../../game/getAvailableMovesOld";
import getAvailableMovesTest from "../../game/getAvailableMoves";
import getMouseSpot from "../../helpers/getMouseSpot";
import makeMove from "../../helpers/makeMove";
import { Teams } from "../../properties";

export default function useMouseDownTest(
  currentTurn: Teams,
  setAvailableMoves: React.Dispatch<React.SetStateAction<Move[]>>,
  setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>
) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const position = getMouseSpot(e);
      if (selectedPiece === null) {
        if (getTeam(board[position]) !== currentTurn) return;

        setSelectedPiece(position);

        const piece = board[position];
        const team = getTeam(piece);

        const moves = getAvailableMovesTest(position, team);
        setAvailableMoves(moves);
      } else {
        setAvailableMoves((prevMoves) => {
          // Selecting a new piece
          if (getTeam(board[position]) === currentTurn) {
            setSelectedPiece(position);
            return getAvailableMovesTest(position, getTeam(board[position]));
          }

          // If you selecting a square that's not a piece, deselect the piece, and move the piece if it's a valid move
          for (let i = 0; i < prevMoves.length; i++) {
            if (prevMoves[i].to === position) {
              makeMove(selectedPiece, position);
              setCurrentTurn((prevTurn) => (prevTurn === Teams.White ? Teams.Black : Teams.White));
              return [];
            }
          }

          return [];
        });

        setSelectedPiece(null);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [selectedPiece, currentTurn]);

  return [selectedPiece, setSelectedPiece];
}
