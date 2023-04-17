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

  // const [mouseDownPosition, setMouseDownPosition] = useState<ClickPosition[]>([]);
  // const [mouseUpPosition, setMouseUpPosition] = useState<ClickPosition[]>([]);

  const [clickPositions, setClickPositions] = useState<ClickPosition[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current as HTMLCanvasElement;

    canvas.style.position = "absolute";
    canvas.style.left = `${boardLeft}px`;
    canvas.style.top = `${boardTop}px`;
    canvas.width = boardWidth;
    canvas.height = boardWidth;
    canvas.style.zIndex = "100";

    let mouseDownPosition: Position | null = null;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setClickPositions([]);
        return;
      }

      if (e.button !== 2) return; // 2 = right click
      mouseDownPosition = getMouseSpot(e);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 2) return; // 2 = right click

      setClickPositions((prev) => {
        const position = getMouseSpot(e);
        if (!position) return prev;

        return [...prev, { mouseDown: mouseDownPosition!, mouseUp: position }];
      });
    };

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

    console.log(clickPositions);

    if (clickPositions.length === 0) return;

    ctx.strokeStyle = "rgba(255, 165, 0, 0.5)";
    ctx.lineWidth = squareSize * 0.2;

    clickPositions.forEach((pos) => {
      const { mouseDown, mouseUp } = pos;
      const { x: mouseDownX, y: mouseDownY } = mouseDown;
      const { x: mouseUpX, y: mouseUpY } = mouseUp;

      ctx.beginPath();

      // Draw arrow line
      ctx.moveTo(mouseDownX * squareSize + squareSize / 2, mouseDownY * squareSize + squareSize * 0.65);
      ctx.lineTo(mouseUpX * squareSize + squareSize / 2, mouseUpY * squareSize + squareSize * 0.65);

      ctx.stroke();

      // Calculate the angle in radians between mouseDown and mouseUp points
      const dx = mouseUpX - mouseDownX;
      const dy = mouseUpY - mouseDownY;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;

      const tipSize = squareSize * 0.05;
      const sideSize = squareSize * 0.075;

      // Calculate the coordinates of the three points of the triangle
      const tipX = mouseUpX * squareSize + squareSize / 2 + Math.cos(angle) * tipSize;
      const tipY = mouseUpY * squareSize + squareSize / 2 + Math.sin(angle) * tipSize;
      const leftX = mouseUpX * squareSize + squareSize / 2 + Math.cos(angle - Math.PI * 0.75) * sideSize;
      const leftY = mouseUpY * squareSize + squareSize / 2 + Math.sin(angle - Math.PI * 0.75) * sideSize;
      const rightX = mouseUpX * squareSize + squareSize / 2 + Math.cos(angle + Math.PI * 0.75) * sideSize;
      const rightY = mouseUpY * squareSize + squareSize / 2 + Math.sin(angle + Math.PI * 0.75) * sideSize;

      // Save the canvas state
      ctx.save();

      // Translate the canvas to the tip of the triangle
      ctx.translate(tipX, tipY);

      // Rotate the canvas around the tip of the triangle
      ctx.rotate(angle);

      // Draw the smaller triangle centered at the tip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-sideSize * 0.75, sideSize);
      ctx.lineTo(sideSize * 0.75, sideSize);
      ctx.closePath();
      ctx.stroke();

      // Restore the canvas state
      ctx.restore();

      // ctx.stroke();
    });
  }, [clickPositions, squareSize]);

  return <canvas ref={canvasRef} />;
}
