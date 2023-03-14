import React, { useContext } from "react";
import { Store } from "../App";
import { Bishop, Knight, Queen, Rook } from "../board";
import clamp from "../helpers/clamp";
import useBoardBound from "../hooks/useBoardBound";
import { Teams } from "../properties";

type Props = {
  index: number;
  team: Teams;
  setPromotionPosition: React.Dispatch<React.SetStateAction<number>>;
  setPromotionPiece: React.Dispatch<React.SetStateAction<number>>;
};

export default function PromotionSelect({ index, team, setPromotionPiece, setPromotionPosition }: Props) {
  const { pieceStyle } = useContext(Store);

  const c = team === Teams.White ? "0" : "1";
  const base = `./assets/images/styles/${pieceStyle}`;

  const { squareSize, boardTop, boardLeft } = useBoardBound();

  const y = clamp(Math.floor(index / 8), 0, 4);
  const x = clamp(index % 8, 0, 7);

  const top = boardTop + squareSize * y;
  const left = boardLeft + squareSize * x;

  const X_STYLES: React.CSSProperties = {
    width: squareSize + "px",
    backgroundColor: "rgb(200, 200, 200)",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: squareSize / 2 + "px",
  };

  const pieces = [
    { name: "q", val: Queen },
    { name: "r", val: Rook },
    { name: "b", val: Bishop },
    { name: "n", val: Knight },
  ];

  const handleCancel = () => {
    setPromotionPosition(-1);
  };

  const handleSelect = (piece: number) => {
    setPromotionPiece(piece);
    setPromotionPosition(-1);
  };

  if (index === -1) return null;
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        top: top - (y === 4 ? squareSize / 2 : 0) + "px",
        left: left,
        zIndex: 500,
      }}
    >
      {y === 4 ? <CancelButton styles={X_STYLES} onClick={handleCancel} /> : null}

      {pieces.map((piece, i) => (
        <img
          key={i}
          className="promote-img"
          src={`${base}/${piece.name}${c}.png`}
          alt={piece.name}
          width={squareSize}
          id={i + ""}
          draggable={false}
          style={{ width: squareSize + "px", height: squareSize + "px" }}
          onClick={() => handleSelect(piece.val)}
        />
      ))}

      {y === 0 ? <CancelButton styles={X_STYLES} onClick={handleCancel} /> : null}
    </div>
  );
}

function CancelButton({ styles, onClick }: { styles: React.CSSProperties; onClick: () => void }) {
  return (
    <div className="promote-img" style={styles} onClick={onClick}>
      X
    </div>
  );
}
