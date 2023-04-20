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

  setPromotionPieceId: React.Dispatch<React.SetStateAction<number>>;
  setPromotionPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setPromotionMove: React.Dispatch<React.SetStateAction<Move | null>>;
};

type TypeOfMove = "capture" | "castle" | "normal" | "check" | "checkmate" | "draw";

const BASE_AUDIO_PATH = "assets/sounds/";
const audioPathMap = {
  capture: "capture.mp3",
  castle: "castle.mp3",
  normal: "move-self.mp3",
} as { [key in TypeOfMove]: string };

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
  setPromotionPieceId,
  setPromotionPosition,
  setPromotionMove,
}: Props) {
  function playAudio(move: Move) {
    // TODO - Add check, checkmate, and draw sounds
    let typeOfMove: TypeOfMove = "normal";
    if (move.capture) typeOfMove = "capture";
    else if (move.castle) typeOfMove = "castle";

    const audio = new Audio(BASE_AUDIO_PATH + audioPathMap[typeOfMove]);
    audio.play();
  }

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

    // Remove transition syles after animation is done
    setTimeout(() => {
      piece.style.transition = "none";
      piece.style.zIndex = "2";

      if (rook) {
        rook.style.transition = "none";
        rook.style.zIndex = "2";
      }
    }, ANIMATION_TIME_MS);
  }

  playAudio(move);
  animatePiece(move);

  // Promotions
  if (move.isPromotion) {
    setPromotionPosition({ x: move.to.x, y: move.to.y });
    setPromotionPieceId(board[move.from.y][move.from.x].id);
    setPromotionMove(move);
    return;
  }

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

    if (move.promotionPiece) {
      newBoard[move.to.y][move.to.x].piece = move.promotionPiece;
    }

    return newBoard;
  });

  setAvailableMoves([]);
  setCurrentTurn((prevTurn) => (prevTurn === "white" ? "black" : "white"));
  setMoveHistory((prevHistory) => [...prevHistory, move]);
  setBoardHistory((prevHistory) => [...prevHistory, board]);
}
