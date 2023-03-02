import { createContext, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

import Board from "./components/Board";
import Chess from "./components/Chess";
import Pieces from "./components/Pieces";

export const BoardColorContext = createContext<string | null>(null);
export const SetBoardColorContext = createContext<React.Dispatch<string | null> | null>(null);

export const PieceStyleContext = createContext<string | null>(null);
export const SetPieceStyleContext = createContext<React.Dispatch<string | null> | null>(null);

export const ChangingStylesContext = createContext<boolean | null>(null);
export const SetChangingStylesContext = createContext<any>(null);

function App() {
  const [boardColor, setBoardColor] = useLocalStorage("chess_board_color", "brown");
  const [pieceStyle, setPieceStyle] = useLocalStorage("chess_piece_style", "cartoon");
  const [changingStyles, setChangingStyles] = useState(false);

  return (
    <div className="App">
      <BoardColorContext.Provider value={boardColor}>
        <SetBoardColorContext.Provider value={setBoardColor}>
          <PieceStyleContext.Provider value={pieceStyle}>
            <SetPieceStyleContext.Provider value={setPieceStyle}>
              <ChangingStylesContext.Provider value={changingStyles}>
                <SetChangingStylesContext.Provider value={setChangingStyles}>
                  <Board />
                  <Pieces />
                  <Chess />
                </SetChangingStylesContext.Provider>
              </ChangingStylesContext.Provider>
            </SetPieceStyleContext.Provider>
          </PieceStyleContext.Provider>
        </SetBoardColorContext.Provider>
      </BoardColorContext.Provider>
    </div>
  );
}

export default App;
