import { useEffect, useState } from "react";
import { board, Move, getTeam } from "../../board";
import getAvailableMoves from "../../game/getAvailableMovesOld";
import getAvailableMovesTest from "../../game/getAvailableMoves";
import getMouseSpot from "../../helpers/getMouseSpot";
import makeMove from "../../helpers/makeMove";
import properties, { Teams } from "../../properties";

export default function useMouseDownTest(
  changingStyles: boolean,
  currentTurn: Teams,
  setAvailableMoves: React.Dispatch<React.SetStateAction<Move[]>>,
  setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>
) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  useEffect(() => {
    if (changingStyles) return;
    const handleMouseDown = async (e: MouseEvent) => {
      const position = getMouseSpot(e);
      if (position === null) return; // Have to have === null (instead of !position) because 0 is a valid position

      if (selectedPiece === null) {
        if (getTeam(board[position]) !== currentTurn) return;

        setSelectedPiece(position);

        const piece = board[position];
        const team = getTeam(piece);

        const moves = getAvailableMovesTest(position, team);
        setAvailableMoves(moves);
      }

      // If you have a piece selected and you click somewhere
      else {
        setAvailableMoves((prevMoves) => {
          // Selecting a new piece
          if (getTeam(board[position]) === currentTurn) {
            setSelectedPiece(position);
            return getAvailableMovesTest(position, getTeam(board[position]));
          }

          // If you selecting a square that's not a piece, deselect the piece, and move the piece if it's a valid move
          for (let i = 0; i < prevMoves.length; i++) {
            if (prevMoves[i].to === position) {
              makeMove(selectedPiece, position, prevMoves[i].castle, prevMoves[i].enPassant);

              setTimeout(() => {
                setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));
              }, properties.animationTimeMs + 100);
              return [];
            }
          }

          setSelectedPiece(null);
          return [];
        });
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [selectedPiece, currentTurn]);

  // Put the piece z index above everything else
  useEffect(() => {
    if (!selectedPiece) return;
    for (let i = 0; i < 64; i++) {
      const square = document.getElementById(i.toString());
      if (square) square.style.zIndex = i === selectedPiece ? "100" : "1";
    }
  }, [selectedPiece]);

  return { selectedPiece, setSelectedPiece };
}
