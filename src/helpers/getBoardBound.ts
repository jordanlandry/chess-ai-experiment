export default function getBoardBound() {
  const board = document.getElementById("board");
  if (!board) return { boardLeft: 0, boardTop: 0, boardWidth: 0, squareSize: 0 };

  const { top, left, width } = board.getBoundingClientRect();
  return { boardLeft: left, boardTop: top, boardWidth: width, squareSize: width / 8 };
}
