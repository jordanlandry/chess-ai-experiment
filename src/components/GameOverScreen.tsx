import { useState } from "react";
import useBoardBound from "../hooks/useBoardBound";
import { EndGameState, Teams } from "../properties";
import Modal from "./Modal";

type Props = { winState: EndGameState; aiTeam: Teams; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };

export default function GameOverScreen({ winState, aiTeam, open, setOpen }: Props) {
  const { boardWidth, boardTop } = useBoardBound();

  const width = Math.ceil(boardWidth / 2);

  const top = width - boardTop / 2;

  if (!winState.isOver) return null;
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      customStyles={{
        top: top,
      }}
    >
      <div
        style={{
          width: width + "px",
          height: width / 2 + "px",
          backgroundColor: "white",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            clipPath: "circle(200% at 50% -250%)",
            backgroundColor: "pink",
            width: width + "px",
            height: width / 2 + "px",
          }}
        ></div>
        <div style={{ position: "absolute", left: "50%", top: "25%", transform: "translate(-50%, -50%)" }}>
          <h2 style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: width / 10 + "px" }}>
            {winState.winningTeam === Teams.None ? "Draw" : winState.winningTeam === aiTeam ? "You Lost" : "You Won"}
          </h2>
          <div style={{ fontSize: width / 16 + "px" }}>by {winState.wonBy}</div>
        </div>
      </div>
    </Modal>
  );
}
