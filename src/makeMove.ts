import { Board, Move, Team } from "./types";

type Props = {
  move: Move;
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  setAvailableMoves: React.Dispatch<React.SetStateAction<Move[]>>;
  setCurrentTurn: React.Dispatch<React.SetStateAction<Team>>;
  setMoveHistory: React.Dispatch<React.SetStateAction<Move[]>>;
  setBoardHistory: React.Dispatch<React.SetStateAction<Board[]>>;
  ANIMATION_TIME_MS: number;
  squareSize: number;
  boardLeft: number;
  boardTop: number;
};

export default function handleMakeMove({
  move,
  board,
  setBoard,
  setAvailableMoves,
  setCurrentTurn,
  setMoveHistory,
  setBoardHistory,
  ANIMATION_TIME_MS,
  squareSize,
  boardLeft,
  boardTop,
}: Props) {
  function animatePiece(move: Move) {
    const piece = document.getElementById(board[move.from.y][move.from.x].id.toString());
    if (!piece) return;

    piece.style.transition = `${ANIMATION_TIME_MS}ms`;

    piece.style.left = `${move.to.x * squareSize + boardLeft}px`;
    piece.style.top = `${move.to.y * squareSize + boardTop}px`;

    let rook: HTMLElement | null = null;
    if (move.castle) {
      rook = document.getElementById(board[move.castle.rookFrom.y][move.castle.rookFrom.x].id.toString());
      if (rook) {
        rook.style.transition = `${ANIMATION_TIME_MS}ms`;

        rook.style.left = `${move.castle.rookTo.x * squareSize + boardLeft}px`;
        rook.style.top = `${move.castle.rookTo.y * squareSize + boardTop}px`;
      }
    }

    setTimeout(() => {
      piece.style.transition = "none";
      piece.style.zIndex = "2";

      if (rook) {
        rook.style.transition = "none";
        rook.style.zIndex = "2";
      }
    }, ANIMATION_TIME_MS);
  }

  animatePiece(move);

  setBoard((prevBoard) => {
    if (prevBoard[move.to.y][move.to.x].piece !== " ") {
      const piece = document.getElementById(prevBoard[move.to.y][move.to.x].id.toString());
      if (piece) piece.style.display = "none";
    }

    const newBoard = prevBoard.map((row) => [...row]);
    if (move.enPassant) {
      newBoard[move.enPassant.y][move.enPassant.x] = { piece: " ", id: -1, hasMoved: true };
      const capturedPiece = document.getElementById(prevBoard[move.enPassant.y][move.enPassant.x].id.toString());
      if (capturedPiece) capturedPiece.style.display = "none";
    }

    if (move.castle) {
      newBoard[move.castle.rookTo.y][move.castle.rookTo.x] = newBoard[move.castle.rookFrom.y][move.castle.rookFrom.x];
      newBoard[move.castle.rookTo.y][move.castle.rookTo.x].hasMoved = true;
      newBoard[move.castle.rookFrom.y][move.castle.rookFrom.x] = { piece: " ", id: -1, hasMoved: true };
    }

    newBoard[move.to.y][move.to.x] = newBoard[move.from.y][move.from.x];
    newBoard[move.to.y][move.to.x].hasMoved = true;
    newBoard[move.from.y][move.from.x] = { piece: " ", id: -1, hasMoved: true };
    return newBoard;
  });

  setAvailableMoves([]);
  setCurrentTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
  setMoveHistory((prevHistory) => [...prevHistory, move]);
  setBoardHistory((prevHistory) => [...prevHistory, board]);
}
