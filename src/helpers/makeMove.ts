import { Teams } from "../properties";

// Psuedo will be true when we are not updating the state,
// This will only be true when we are checking from the AI
// Temporary will be true when looking for attacked squares
// But I'm going to change it to constantly update after each move
// So it won't be there after that
export default async function makeMove(
  from: number,
  to: number,
  castle: boolean | undefined,
  enPassant: boolean | undefined,
  promotionPiece: number | undefined,
  psuedo = false,
  undo = false,
  capturedPiece?: number | undefined
) {
  // const team = getTeam(board[from]);
  // const piece = pieceType(board[from]);
  // This is such a gross way to do this lol pls don't judge me 🙃
  // if (!psuedo) {
  // Play audio
  // Pick an audio file based on the move made
  // let file = "";
  // if (castle) file = "castle.mp3";
  // else if (board[to]) file = "capture.mp3";
  // else file = "move-self.mp3";
  // const audio = new Audio(`../assets/sounds/${file}`);
  // audio.play();
  //   const previousPiece = document.getElementById(to.toString());
  //   if (previousPiece) previousPiece.remove();
  //   if (enPassant) {
  //     if (getTeam(board[from]) === Teams.White) {
  //       const previousPiece = document.getElementById((to + 8).toString());
  //       if (previousPiece) previousPiece.remove();
  //     } else {
  //       const previousPiece = document.getElementById((to - 8).toString());
  //       if (previousPiece) previousPiece.remove();
  //     }
  //   }
  //   const movingPiece = document.getElementById(from.toString()) as HTMLImageElement;
  //   if (movingPiece) movingPiece.id = to.toString();
  //   if (promotionPiece) {
  //     // Need to change the image source.
  //     // Replace the 6th last character with the new piece
  //     const type = pieceType(promotionPiece);
  //     const a = movingPiece.src.split("");
  //     a[a.length - 6] = type.toLowerCase();
  //     const newSrc = a.join("");
  //     movingPiece.src = newSrc;
  //     movingPiece.alt = type.toLowerCase();
  //   }
  //   if (castle) {
  //     if (team === Teams.White) {
  //       const rookFrom = to === 62 ? 63 : 56;
  //       const rookTo = to === 62 ? 61 : 59;
  //       const rook = document.getElementById(rookFrom.toString());
  //       if (rook) rook.id = rookTo.toString();
  //     } else {
  //       const rookFrom = to === 6 ? 7 : 0;
  //       const rookTo = to === 6 ? 5 : 3;
  //       const rook = document.getElementById(rookFrom.toString());
  //       if (rook) rook.id = rookTo.toString();
  //     }
  //   }
  // }
  // if (undo) undoPiecePosition(piece, team, from, to, castle, enPassant, promotionPiece, capturedPiece);
  // else updatePiecePositions(piece, team, from, to, castle, enPassant, promotionPiece);
  // if (!psuedo) updateReadableBoard();
}
