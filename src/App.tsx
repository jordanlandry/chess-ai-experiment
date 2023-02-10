import { createContext, useEffect, useState } from "react";
import Board from "./components/Board";
import Game from "./components/Game";
import Piece from "./components/Piece";
import Pieces from "./components/Pieces";
import useLocalStorage from "./hooks/useLocalStorage";

export const BoardColorContext = createContext<string | null>(null);
export const SetBoardColorContext = createContext<any>(null);
export const PieceStyleContext = createContext<string | null>(null);
export const SetPieceStyleContext = createContext<any>(null);

function App() {
  const [boardColor, setBoardColor] = useLocalStorage("chess_board_color", "brown");
  const [pieceStyle, setPieceStyle] = useLocalStorage("chess_piece_style", "cartoon");

  return (
    <div className="App">
      <BoardColorContext.Provider value={boardColor}>
        <SetBoardColorContext.Provider value={setBoardColor}>
          <PieceStyleContext.Provider value={pieceStyle}>
            <SetPieceStyleContext.Provider value={setPieceStyle}>
                <Board />
                <Game />
                <Pieces />
            </SetPieceStyleContext.Provider>
          </PieceStyleContext.Provider>
        </SetBoardColorContext.Provider>
      </BoardColorContext.Provider>
    </div>
  );
}

export default App;
