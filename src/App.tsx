import { createContext, useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

import Board from "./components/board/Board";
import Chess from "./components/Chess";
import MainMenu from "./components/menu/MainMenu";
import Pieces from "./components/Pieces";
import Puzzle from "./components/puzzle/Puzzle";
import TestElement from "./Testing/TestElement";
import useDebounce from "./hooks/useDebounce";

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

  const [gameState, setGameState] = useState(GameState.Menu);

  const [score, setScore] = useState(0);
  const [startPuzzle, setStartPuzzle] = useState(false);

  const [test, setTest] = useState("loading...");

  useEffect(() => {
    setTimeout(() => {
      fetch("http://127.0.0.1:8000/test/Chess")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setTest(data.val);
          console.log(data);
        });
    }, 800);
  });

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

  const testValue = useDebounce(test, 1000);

  return (
    <div className="App">
      <h1>{testValue}</h1>
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
