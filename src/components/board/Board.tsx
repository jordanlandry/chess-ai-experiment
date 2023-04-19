import { useContext } from "react";
import nextId from "react-id-generator";
import { Store } from "../../App";

import "../_scss/board.scss";

export default function Board() {
  const { boardColor } = useContext(Store);

  // Colors
  // const light = properties.styles[boardColor].light;
  // const dark = properties.styles[boardColor].dark;

  const light = "#f0d9b5";
  const dark = "#b58863";

  // Elements
  const squareElements = new Array(64).fill(0).map((_, i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);

    return (
      <div
        id={"square" + i}
        key={nextId()}
        className="square"
        style={{
          backgroundColor: (x + y) % 2 === 0 ? light : dark,
          width: "100%",
          height: "100%",
        }}
      />
    );
  });

  // Render
  return (
    <div className="board-wrapper">
      <div id="board">{squareElements}</div>
    </div>
  );
}
