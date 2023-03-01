import getBoardBound from "./getBoardBound";

export default function getSpot({ x, y }: MouseEvent) {
  const { boardLeft, boardTop, squareSize } = getBoardBound();

  const spot = {
    x: Math.floor((x - boardLeft) / squareSize),
    y: Math.floor((y - boardTop) / squareSize),
  };

  if (spot.x < 0 || spot.x > 7 || spot.y < 0 || spot.y > 7) return { x: -1, y: -1 };
  return spot;
}
