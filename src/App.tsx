import { createContext, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

import React from "react";
import Board from "./components/Board";
import Chess from "./components/Chess";
import Pieces from "./components/Pieces";
import MainMenu from "./components/menu/MainMenu";
import Puzzle from "./components/puzzle/Puzzle";
import { Teams } from "./properties";

export const Store = createContext<any>(null);
export enum GameState {
  Menu,
  Bot,
  Puzzle,
}

function App() {
  const [boardColor, setBoardColor] = useLocalStorage("chess_board_color", "brown");
  const [pieceStyle, setPieceStyle] = useLocalStorage("chess_piece_style", "cartoon");
  const [changingStyles, setChangingStyles] = useState(false);

  const [gameState, setGameState] = useState(GameState.Menu);

  const [score, setScore] = useState(0);
  const [startPuzzle, setStartPuzzle] = useState(false);

  console.log(startPuzzle);

  const store = {
    boardColor,
    setBoardColor,
    pieceStyle,
    setPieceStyle,
    changingStyles,
    setChangingStyles,
    gameState,
    setGameState,
    score,
    setScore,
    startPuzzle,
    setStartPuzzle,
  };

  return (
    <div className="App">
      <Store.Provider value={store}>
        {gameState === GameState.Menu ? (
          <MainMenu />
        ) : gameState === GameState.Bot ? (
          <>
            <Board />
            <Chess />
            <Pieces />
          </>
        ) : gameState === GameState.Puzzle ? (
          <>
            <Puzzle />
            {startPuzzle ? (
              <>
                <Board />
                <Pieces />
              </>
            ) : null}
          </>
        ) : null}
      </Store.Provider>
    </div>
  );
}

export default App;
