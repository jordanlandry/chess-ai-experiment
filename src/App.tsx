import { createContext, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

import Board from "./components/board/Board";
import Chess from "./components/Chess";
import MainMenu from "./components/menu/MainMenu";
import Pieces from "./components/Pieces";
import Puzzle from "./components/puzzle/Puzzle";
import TestElement from "./Testing/TestElement";

export const Store = createContext<any>(null);
export enum GameState {
  Menu,
  Bot,
  Puzzle,
  Testing,
}

function App() {
  const [boardColor, setBoardColor] = useLocalStorage("chess_board_color", "brown");
  const [pieceStyle, setPieceStyle] = useLocalStorage("chess_piece_style", "cartoon");
  const [changingStyles, setChangingStyles] = useState(false);

  const [gameState, setGameState] = useState(GameState.Bot);

  const [score, setScore] = useState(0);
  const [startPuzzle, setStartPuzzle] = useState(false);

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
        ) : gameState === GameState.Testing ? (
          <>
            <TestElement />
          </>
        ) : null}
      </Store.Provider>
    </div>
  );
}

export default App;
