import { STARTING_BOARD } from "../properties";
import Piece from "./Piece";

export default function Pieces() {
  const pieces = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const { id } = STARTING_BOARD[i][j];
      pieces.push(<Piece key={id} {...STARTING_BOARD[i][j]} />);
    }
  }

  return <div>{pieces}</div>;
}
