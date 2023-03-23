import { bitboard, getAvailableMovesBitboard, getPawnMoves, initializeBitboard, printBitboard } from "../bitBoard";
import { board, Move } from "../board";
import { whitePawn } from "../game/getAvailableMoves";
import testFunctionSpeed from "../helpers/testFunctionSpeed";
import { Teams } from "../properties";

type Props = {};

export default function TestElement({}: Props) {
  const handleClick = () => {
    initializeBitboard();

    getAvailableMovesBitboard();

    // const moves: Move[] = [];
    // testFunctionSpeed(() => {
    //   for (let i = 0; i < 8; i++) {
    //     whitePawn(moves, 48 + i);
    //   }
    // }, "Original pawns");

    testFunctionSpeed(() => {
      getPawnMoves(Teams.White);
    }, "Bitboard pawns");
  };

  return (
    <>
      <button onClick={handleClick}>Click</button>
    </>
  );
}
