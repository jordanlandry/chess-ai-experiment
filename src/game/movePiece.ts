import { audioSettings, Moves, PiecesType, PieceType, Teams } from "../properties";

export function movePiece(
  board: PieceType[][],
  setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>,
  move: Moves,
  setAvailableMoves: React.Dispatch<React.SetStateAction<Moves[]>>,
  setTurn: React.Dispatch<React.SetStateAction<Teams>>,
  setMoveHistory: React.Dispatch<React.SetStateAction<Moves[]>>
) {
  const blankPiece = { piece: PiecesType.None, color: Teams.None, id: -1, hasMoved: false };
  const newBoard = board.map((row) => [...row]);

  const { from, to, piece, enPassant, castle, promotion } = move;

  // Play audio
  // Pick an audio file based on the move mad
  let file = "";
  if (castle) file = "castle.mp3";
  else if (board[to.y][to.x].piece !== PiecesType.None) file = "capture.mp3";
  else file = "move-self.mp3";

  const audio = new Audio(`../assets/sounds/${file}`);
  if (!audioSettings.isPlaying) {
    audio.play();
    audioSettings.isPlaying = true;
  }

  // When audio is done
  audio.onended = () => {
    audioSettings.isPlaying = false;
  };

  newBoard[from.y][from.x] = blankPiece;
  newBoard[to.y][to.x] = piece;
  setBoard(newBoard);

  // Look for special moves
  if (castle !== undefined) {
    const rookFrom = { x: castle.rookFrom.x, y: castle.rookFrom.y };
    const rookTo = { x: castle.rookTo.x, y: castle.rookTo.y };

    newBoard[rookTo.y][rookTo.x] = newBoard[rookFrom.y][rookFrom.x];
    newBoard[rookFrom.y][rookFrom.x] = blankPiece;
    setBoard(newBoard);
  }

  if (enPassant) {
    const enPassantPiece = { x: to.x, y: from.y };
    newBoard[enPassantPiece.y][enPassantPiece.x] = blankPiece;
    setBoard(newBoard);
  }

  // TODO
  if (promotion) {
  }

  // Update
  setAvailableMoves([]);
  setTurn((turn) => (turn === Teams.White ? Teams.Black : Teams.White));
  setMoveHistory((history) => [...history, move]);
}
