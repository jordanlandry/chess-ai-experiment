import properties, { audioSettings, blankPiece, kingPositions, Moves, PiecesType, PieceType, PromotionPieceType, Teams } from "../properties";

export async function movePiece(
  board: PieceType[][],
  move: Moves,
  aiTeam: Teams,
  props: {
    setBoard: React.Dispatch<React.SetStateAction<PieceType[][]>>;
    setAvailableMoves: React.Dispatch<React.SetStateAction<Moves[]>>;
    setTurn: React.Dispatch<React.SetStateAction<Teams>>;
    setMoveHistory: React.Dispatch<React.SetStateAction<Moves[]>>;
    setBoardHistory: React.Dispatch<React.SetStateAction<PieceType[][][]>>;
    setIsPromoting: React.Dispatch<React.SetStateAction<boolean>>;
    setPromotedPieces: React.Dispatch<React.SetStateAction<PromotionPieceType[]>>;
    setPromotionPiece: React.Dispatch<React.SetStateAction<PromotionPieceType>>;
  }
) {
  const newBoard = board.map((row) => [...row]);

  const { from, to, piece, enPassant, castle, promotion } = move;
  const { setBoard, setAvailableMoves, setTurn, setMoveHistory, setBoardHistory, setIsPromoting, setPromotedPieces, setPromotionPiece } = props;

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
  audio.onended = () => (audioSettings.isPlaying = false);

  // if the board at the position is a promoted piece, remove it
  if (board[to.y][to.x].promotionPiece) {
    setPromotedPieces((prev) => prev.filter((p) => p.id !== board[to.y][to.x].id));
  }

  // Update the king positions
  if (piece.piece === PiecesType.King) {
    kingPositions[piece.color] = to;
  }

  newBoard[from.y][from.x] = { ...blankPiece, hasMoved: true };
  newBoard[to.y][to.x] = { ...piece, hasMoved: true };
  setBoard(newBoard);

  // Look for special moves
  if (castle !== undefined) {
    const rookFrom = { x: castle.rookFrom.x, y: castle.rookFrom.y };
    const rookTo = { x: castle.rookTo.x, y: castle.rookTo.y };

    newBoard[rookTo.y][rookTo.x] = newBoard[rookFrom.y][rookFrom.x];
    newBoard[rookFrom.y][rookFrom.x] = { ...blankPiece, hasMoved: true };
    setBoard(newBoard);
  }

  if (enPassant) {
    const enPassantPiece = { x: to.x, y: from.y };
    newBoard[enPassantPiece.y][enPassantPiece.x] = blankPiece;
    setBoard(newBoard);
  }

  // Update
  setAvailableMoves([]);
  setMoveHistory((history) => [...history, move]);
  setBoardHistory((history) => [...history, newBoard.map((row) => row.slice())]);

  // If it is a promotion, I want to wait for the user to select a promotion piece, before changing the turn
  // To give this effect, I will skip the turn change here, and do it in the promotion component

  // If it is the AI making the promotion, I can skip this and just make the promotion
  if (promotion && aiTeam === piece.color) {
    const promotedPiece = { piece: move.promotionPiece!, color: piece.color, id: properties.currentId++, hasMoved: true, x: to.x, y: to.y };
    setPromotionPiece(promotedPiece);
    setPromotedPieces((prevPieces) => [...prevPieces, promotedPiece]);

    setTurn((turn) => (turn === Teams.White ? Teams.Black : Teams.White));
  }

  // Not the AI turn
  else if (promotion) setIsPromoting(true);
  else setTurn((turn) => (turn === Teams.White ? Teams.Black : Teams.White));
}
