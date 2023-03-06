import { useEffect, useState } from "react";
import { board, getTeam, Move } from "../../board";
import getAvailableMovesTest from "../../game/getAvailableMoves";
import getMouseSpot from "../../helpers/getMouseSpot";
import makeMove from "../../helpers/makeMove";
import { makeMoveNew } from "../../helpers/makeMoveNew";
import { Teams } from "../../properties";
import { availableMoves, testBoard } from "../../Testing/testBoard";

export default function useMouseDownTest(
  changingStyles: boolean,
  promotionPosition: number,
  currentTurn: Teams,
  setPromotionPosition: React.Dispatch<React.SetStateAction<number>>,
  setAvailableMoves: React.Dispatch<React.SetStateAction<Set<number>>>,
  setCurrentTurn: React.Dispatch<React.SetStateAction<Teams>>,
  setPromotion: React.Dispatch<React.SetStateAction<Move | null>>
) {
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  useEffect(() => {
    if (changingStyles || promotionPosition !== -1) return;

    const handleMouseDown = async (e: MouseEvent) => {
      if (e.button !== 0) return;

      const position = getMouseSpot(e);
      if (position === null) return; // Have to have === null (instead of !position) because 0 is a valid position

      if (selectedPiece === null) {
        if (getTeam(testBoard[position]) !== currentTurn) return;

        setSelectedPiece(position);

        const piece = testBoard[position];
        const team = getTeam(piece);

        const moves = availableMoves[position];
        setAvailableMoves(moves);

        // const moves = getAvailableMovesTest(position, team);
        // setAvailableMoves(moves);
      }

      // If you have a piece selected and you click somewhere
      else {
        setAvailableMoves((prevMoves) => {
          // Selecting a new piece
          if (getTeam(testBoard[position]) === currentTurn) {
            setSelectedPiece(position);
            return availableMoves[position];
          }

          // If you're selecting a square that's not a piece, check if it's a valid move
          if (prevMoves.has(position)) {
            // makeMove(selectedPiece, position, undefined, undefined, undefined, false, false);
            makeMoveNew({ from: selectedPiece, to: position });
            setCurrentTurn((prevTurn) => (prevTurn === Teams.White ? Teams.Black : Teams.White));
          }

          setSelectedPiece(null);
          return new Set();
        });
      }

      //   setAvailableMoves((prevMoves) => {
      //     // Selecting a new piece
      //     if (getTeam(board[position]) === currentTurn) {
      //       setSelectedPiece(position);
      //       return getAvailableMovesTest(position, getTeam(board[position]));
      //     }

      //     // If you selecting a square that's not a piece, deselect the piece, and move the piece if it's a valid move
      //     for (let i = 0; i < prevMoves.length; i++) {
      //       if (prevMoves[i].to === position) {
      //         if (prevMoves[i].promoteTo) {
      //           setPromotionPosition(prevMoves[i].to);
      //           setPromotion(prevMoves[i]);
      //           return [];
      //         }

      //         makeMove(selectedPiece, position, prevMoves[i].castle, prevMoves[i].enPassant, prevMoves[i].promoteTo);
      //         setSelectedPiece(null);
      //         setCurrentTurn((currentTurn) => (currentTurn === Teams.White ? Teams.Black : Teams.White));

      //         return [];
      //       }
      //     }

      //     setSelectedPiece(null);
      //     return [];
      //   });
      // }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [selectedPiece, currentTurn, promotionPosition, changingStyles]);

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
