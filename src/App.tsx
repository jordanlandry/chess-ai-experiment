import { createContext, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

import React from "react";
import Board from "./components/Board";
import Chess from "./components/Chess";
import Pieces from "./components/Pieces";
import MainMenu from "./components/menu/MainMenu";

export const Store = createContext<any>(null);

function App() {
  const [boardColor, setBoardColor] = useLocalStorage("chess_board_color", "brown");
  const [pieceStyle, setPieceStyle] = useLocalStorage("chess_piece_style", "cartoon");
  const [changingStyles, setChangingStyles] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const store = {
    boardColor,
    setBoardColor,
    pieceStyle,
    setPieceStyle,
    changingStyles,
    setChangingStyles,
    gameStarted,
    setGameStarted,
  };

  return (
    <div className="App">
      <Store.Provider value={store}>
        {gameStarted ? (
          <>
            <Chess />
            <Board />
            <Pieces />
          </>
        ) : (
          <MainMenu />
        )}
      </Store.Provider>
    </div>
  );
}

export default App;
