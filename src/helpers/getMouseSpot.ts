import getBoardBound from "./getBoardBound";

export default function getMouseSpot({ x, y }: MouseEvent) {
  const { boardLeft, boardTop, squareSize } = getBoardBound();

  const boardX = x - boardLeft;
  const boardY = y - boardTop;

  if (boardX < 0 || boardX > 8 * squareSize || boardY < 0 || boardY > 8 * squareSize) return null;

  const col = Math.floor(boardX / squareSize);
  const row = Math.floor(boardY / squareSize);

  return { x: col, y: row };
}
