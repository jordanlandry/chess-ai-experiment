import React, { useEffect, useRef, useState } from "react";
import { IntRange, Position } from "../../types";
import useBoardBound from "../../hooks/useBoardBound";
import getMouseSpot from "../../helpers/getMouseSpot";

type ClickPosition = {
  mouseDown: Position;
  mouseUp: Position;
};
export default function Arrow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { boardLeft, boardWidth, boardTop, squareSize } = useBoardBound();

  const [clickPositions, setClickPositions] = useState<ClickPosition[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current as HTMLCanvasElement;

    // Set canvas position and size
    canvas.style.position = "absolute";
    canvas.style.left = `${boardLeft}px`;
    canvas.style.top = `${boardTop}px`;
    canvas.width = boardWidth;
    canvas.height = boardWidth;
    canvas.style.zIndex = "100";

    // Get the start position of the arrow
    let mouseDownPosition: Position | null = null;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return; // 2 = right click
      mouseDownPosition = getMouseSpot(e);
    };

    // Remove arrow if it already exists or add a new one
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setClickPositions([]);
        return;
      }

      if (e.button !== 2) return; // 2 = right click

      setClickPositions((prev) => {
        const position = getMouseSpot(e);
        if (!position) return prev;

        // If they didn't move the mouse, don't add an arrow
        if (JSON.stringify(position) === JSON.stringify(mouseDownPosition)) return prev;

        const newArrows = [...prev];

        // Remove arrow if it already exists
        const index = newArrows.findIndex(
          (s) =>
            s.mouseDown.x === mouseDownPosition!.x &&
            s.mouseDown.y === mouseDownPosition!.y &&
            s.mouseUp.x === position.x &&
            s.mouseUp.y === position.y
        );

        if (index !== -1) {
          newArrows.splice(index, 1);
          return newArrows;
        }

        return [...prev, { mouseDown: mouseDownPosition!, mouseUp: position }];
      });
    };

    // Mousemove is so we can get the path, if they've done a knight move
    // TODO: Add knight move path
    const handleMouseMove = (e: MouseEvent) => {};

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Hide the right click menu only on canvas
    canvas.addEventListener("contextmenu", (e) => e.preventDefault(), false);

    // Remove event listeners on cleanup
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvasRef, boardLeft, boardTop, boardWidth]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current as HTMLCanvasElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (clickPositions.length === 0) return;

    ctx.strokeStyle = "rgba(255, 165, 0, 0.5)";
    ctx.lineWidth = squareSize * 0.2;

    clickPositions.forEach((pos) => {
      const { mouseDown, mouseUp } = pos;
      const { x: mouseDownX, y: mouseDownY } = mouseDown;
      const { x: mouseUpX, y: mouseUpY } = mouseUp;

      drawArrow(ctx, mouseDownX, mouseDownY, mouseUpX, mouseUpY);
    });
  }, [clickPositions, squareSize]);

  const drawArrow = (ctx: CanvasRenderingContext2D, mouseDownX: number, mouseDownY: number, mouseUpX: number, mouseUpY: number) => {
    const arrowSize = squareSize * 0.25;

    const x1 = mouseDownX * squareSize + squareSize / 2;
    const y1 = mouseDownY * squareSize + squareSize / 2;
    const x2 = mouseUpX * squareSize + squareSize / 2;
    const y2 = mouseUpY * squareSize + squareSize / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    // Coordinates of arrowhead points
    const x3 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const y3 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const x4 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const y4 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.moveTo(x3, y3);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x4, y4);
    ctx.stroke();
  };

  return <canvas ref={canvasRef} />;
}
