import { useEffect } from "react";
import { board, getAllPieces, Move } from "../board";
import properties, { Teams } from "../properties";
import { testBoard } from "../Testing/testBoard";
import useBoardBound from "./useBoardBound";
import useLoad from "./useLoad";

export default function usePieceCentering(promotionPiece: number, moveHistory: Move[]) {
  3080;
  const loaded = useLoad();
  // const board = getAllPieces();
  const { boardLeft, boardTop, squareSize } = useBoardBound();

  useEffect(() => {
    // When I move a piece, the id will change to it's new position making this work.
    // Probably not the best way to do it but in order to keep the same instance of the piece
    // I have to do something like this, which I need to prevent it from moving the piece without animation.
    // As updating the position in a state will re-instantiate the piece and cause it to teleport instead of animating
    // And to prevent me having to code my own animation code using previous values and a bunch of math and it would be slow and a mess
    // Plus changing the id on piece move lets me keep the piece position arrays as number arrays instead of using objects
    // Which would slow down the code, and performance is #1 for this as Minimax is a very expensive algorithm.
    // Anyways this is the best way I could think of to do this at the moment, may or may not change it later as it works
    // And to change the functionality, would have to change multple functions.

    // board.forEach((_, i) => {
    //   if (!loaded) return;
    //   const piece = document.getElementById(i + "");

    //   if (!piece) return;

    //   const x = (i % 8) * squareSize;
    //   const y = Math.floor(i / 8) * squareSize;

    //   piece.style.position = "absolute";
    //   piece.style.left = boardLeft + x + "px";
    //   piece.style.top = boardTop + y + "px";

    //   piece.style.transition = properties.animationTimeMs + "ms";
    //   piece.style.display = "block";
    // });

    testBoard.forEach((_, i) => {
      const piece = document.getElementById(i + "");

      if (!piece) return;

      const x = (i % 8) * squareSize;
      const y = Math.floor(i / 8) * squareSize;

      piece.style.position = "absolute";
      piece.style.left = boardLeft + x + "px";
      piece.style.top = boardTop + y + "px";

      piece.style.transition = properties.animationTimeMs + "ms";
      piece.style.display = "block";
    });
  }, [promotionPiece, moveHistory]);

  // This removes the transition property when resizing the window
  // Yes I know I could just use refs and make a custom hook to see what the previous value was
  // And then only set the transition property based on which dependancy changed but
  // This is easier and I don't care cuz this is the only place I'm using it and it works so whatever
  // If the code was super complex and I was using this in multiple places then I would do it the right way
  // But this is way faster to write even though in the amount of time it took me to write this comment I could have just done it the right way
  // And copilot probably could've just done it in like 5 seconds...
  // Oh well I'm too far into this now so deal with it
  useEffect(() => {
    // if (!loaded) return;

    testBoard.forEach((_, i) => {
      const piece = document.getElementById(i + "");
      if (!piece) return;

      const x = (i % 8) * squareSize;
      const y = Math.floor(i / 8) * squareSize;
      piece.style.position = "absolute";
      piece.style.left = boardLeft + x + "px";
      piece.style.top = boardTop + y + "px";

      piece.style.transition = "0s";
      piece.style.display = "block";
    });
  }, [boardLeft, boardTop, squareSize, loaded]);
  // useEffect(() => {
  //   if (!loaded) return;

  //   board.forEach((_, i) => {
  //     const piece = document.getElementById(i + "");
  //     if (!piece) return;

  //     const x = (i % 8) * squareSize;
  //     const y = Math.floor(i / 8) * squareSize;
  //     piece.style.position = "absolute";
  //     piece.style.left = boardLeft + x + "px";
  //     piece.style.top = boardTop + y + "px";

  //     piece.style.transition = "0s";
  //     piece.style.display = "block";
  //   });
  // }, [boardLeft, boardTop, squareSize, loaded]);
}
