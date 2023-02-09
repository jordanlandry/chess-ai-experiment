import { useContext, useState } from "react";
import { SetBoardColorContext, BoardColorContext, PieceStyleContext, SetPieceStyleContext } from "../App";

import properties from "../properties";
import Modal from "./Modal";

export default function Board() {
  const [changingSettings, setChangingSettings] = useState(false);

  // Context Imports
  const boardColor = useContext(BoardColorContext)!;
  const setBoardColor = useContext(SetBoardColorContext)!;

  const pieceStyle = useContext(PieceStyleContext)!;
  const setPieceStyle = useContext(SetPieceStyleContext)!;

  // Colors
  const light = properties.styles[boardColor].light;
  const dark = properties.styles[boardColor].dark;

  const [score, setScore] = useState(0);
  const MAX_SCORE = 20; // Max before the eval bar is full

  // Elements
  const squareElements = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      squareElements.push(
        <div
          id={"square" + (i * 8 + j)}
          key={i * 8 + j}
          className="square"
          style={{
            backgroundColor: (i + j) % 2 === 0 ? dark : light,
            width: "100%",
            height: "100%",
          }}
        />
      );
    }
  }

  // Functions
  const changeSettings = (e: any) => {
    setBoardColor(e.target.value);
    setChangingSettings(false);
  };

  const [b, a] = useState(10);
  // Render
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
      }}
    >
      <div
        style={{
          width: "min(10vw, 100px, 10vh)",
          height: "min(80vw, 800px, 80vh)",
          flexDirection: "column",
          display: "flex",
          alignItems: "end",
        }}
      >
        <div style={{ backgroundColor: "ddd", height: "100%", border: "1px solid black", width: "25%" }}>
          <div
            style={{ backgroundColor: "#444", height: score + "%", width: "100%", transition: "0.5s" }}
            onClick={() => a(50)}
          ></div>
        </div>
      </div>
      <div
        id="board"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          width: "min(80vw, 800px, 80vh)",
          height: "min(80vw, 800px, 80vh)",
          outline: "1px solid black",
        }}
      >
        {squareElements}
      </div>
      <div style={{ width: "min(10vw, 100px, 10vh)", height: "min(80vw, 800px, 80vh)" }}>
        <svg
          onClick={() => setChangingSettings(true)}
          style={{ padding: "1rem", cursor: "pointer" }}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
        </svg>
      </div>

      <Modal onClose={() => setChangingSettings(false)} open={changingSettings}>
        <h2 style={{ fontSize: "2rem" }}>Settings</h2>
        <div>Change Style</div>
        <select value={boardColor} onChange={changeSettings} style={{ textTransform: "capitalize" }}>
          {Object.keys(properties.styles).map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        <div>Change Piece Style</div>
        <select
          value={pieceStyle}
          onChange={(e) => setPieceStyle(e.target.value)}
          style={{ textTransform: "capitalize" }}
        >
          {properties.pieceStyles.map((style: string) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
}
