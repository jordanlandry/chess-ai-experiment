import getTeam from "../helpers/getTeam";
import { Board, Move, Position, PromotionPiece, Team } from "../types";

export function getAvailableMoves(board: Board, pos: Position, prevBoard: Board, isPsuedo = false): Move[] {
  const moves: Move[] = [];

  const piece = board[pos.y][pos.x].piece.toLowerCase();
  const pieceFunctions = {
    p: pawn,
    r: rook,
    n: knight,
    b: bishop,
    q: queen,
    k: king,
    " ": () => {},
  } as { [key: string]: Function };

  if (piece) pieceFunctions[piece](board, moves, pos, prevBoard, isPsuedo);

  if (isPsuedo) return moves;

  // Add team property to each move (this way because it is much easier than to type it in every single time when adding a move)
  const team = getTeam(board, pos);
  moves.forEach((move) => (move.team = team));

  return removeIllegalMoves(board, moves, pos);
}

function getKingPos(board: Board, team: Team) {
  const king = team === "white" ? "K" : "k";
  let kingPos: Position = { x: 0, y: 0 };

  board.forEach((row, y) => {
    row.forEach((square, x) => {
      if (square.piece === king) kingPos = { x, y };
    });
  });

  return kingPos;
}

function isSquareAttacked(board: Board, pos: Position, team: Team) {
  // Generate all possible moves for the opposite team and see if any of them attack the square
  const oppositeTeam = team === "white" ? "black" : "white";

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (getTeam(board, { x, y }) !== oppositeTeam) continue;

      const moves = getAvailableMoves(board, { x, y }, board, true);
      // console.log(moves);

      const move = moves.find((move) => move.to.x === pos.x && move.to.y === pos.y);
      if (move) return true;
    }
  }
}

function removeIllegalMoves(board: Board, moves: Move[], pos: Position): Move[] {
  const team = getTeam(board, pos);

  return moves.filter((move) => {
    const newBoard = JSON.parse(JSON.stringify(board));

    // Make move on a copy of the board
    newBoard[move.to.y][move.to.x].piece = newBoard[move.from.y][move.from.x].piece;
    newBoard[move.from.y][move.from.x].piece = " ";
    const kingPos = getKingPos(newBoard, team);

    if (move.enPassant) newBoard[move.enPassant.y][move.enPassant.x].piece = " ";
    return !isSquareAttacked(newBoard, kingPos, team);
  });
}

// --------------------------------------------
function pawn(board: Board, moves: Move[], pos: Position, prevBoard: Board) {
  const piece = board[pos.y][pos.x].piece;
  const team: Team = piece === piece.toLowerCase() ? "black" : "white";

  if (team === "white") whitePawn(board, moves, pos, prevBoard);
  else blackPawn(board, moves, pos, prevBoard);
}

function inBounds(pos: Position) {
  return pos.x >= 0 && pos.x <= 7 && pos.y >= 0 && pos.y <= 7;
}

function canEnpassant(board: Board, pos: Position, team: Team, prevBoard: Board) {
  const { x, y } = pos;

  const target = team === "white" ? "p" : "P";
  const row = team === "white" ? 3 : 4;
  const offset1 = team === "white" ? -1 : 1;
  const offset2 = team === "white" ? -2 : 2;

  return (
    inBounds(pos) &&
    pos.y === row &&
    board[y][x].piece === target &&
    board[y + offset1][pos.x].piece === " " &&
    board[y + offset2][pos.x].piece === " " &&
    prevBoard[y][x].piece === " " &&
    prevBoard[y + offset1][pos.x].piece === " " &&
    prevBoard[y + offset2][pos.x].piece === target
  );
}

function whitePawn(board: Board, moves: Move[], pos: Position, prevBoard: Board) {
  const empty = " ";
  const START_ROW = 6;
  const PROMOTION_ROW = 0;
  const { x, y } = pos;

  const move1 = { x, y: y - 1 };
  const move2 = { x, y: y - 2 };

  const captureLeft = { x: x - 1, y: y - 1 };
  const captureRight = { x: x + 1, y: y - 1 };

  const promotionPieces = ["Q", "R", "B", "N"] as PromotionPiece[];

  // Move forward 1
  if (inBounds(move1) && board[move1.y][move1.x].piece === empty) {
    if (y === PROMOTION_ROW + 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: move1, promotionPiece: piece }));
    else moves.push({ from: pos, to: move1 });
  }

  // Move forward 2
  if (y === START_ROW && board[move2.y][move2.x].piece === empty && board[move1.y][move1.x].piece === empty) {
    if (y === PROMOTION_ROW + 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: move2, promotionPiece: piece }));
    else moves.push({ from: pos, to: move2 });
  }

  // Capture left
  if (inBounds(captureLeft) && getTeam(board, captureLeft) !== "white" && board[captureLeft.y][captureLeft.x].piece !== empty) {
    if (y === PROMOTION_ROW + 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: captureLeft, promotionPiece: piece }));
    else moves.push({ from: pos, to: captureLeft, capture: true });
  }

  // Capture right
  if (inBounds(captureRight) && getTeam(board, captureRight) !== "white" && board[captureRight.y][captureRight.x].piece !== empty) {
    if (y === PROMOTION_ROW + 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: captureRight, promotionPiece: piece }));
    else moves.push({ from: pos, to: captureRight, capture: true });
  }

  // Promotion
  // if (y === PROMOTION_ROW + 1) {
  //   const promotionPieces = ["Q", "R", "B", "N"] as PromotionPiece[];
  //   promotionPieces.forEach((piece) => {
  //     moves.push({ from: pos, to: { x, y: y - 1 }, promotionPiece: piece });
  //   });
  // }

  // En passant
  if (canEnpassant(board, { x: x - 1, y }, "white", prevBoard)) moves.push({ from: pos, to: captureLeft, enPassant: { x: x - 1, y } });
  if (canEnpassant(board, { x: x + 1, y }, "white", prevBoard)) moves.push({ from: pos, to: captureRight, enPassant: { x: x + 1, y } });
}

function blackPawn(board: Board, moves: Move[], pos: Position, prevBoard: Board) {
  const empty = " ";
  const START_ROW = 1;
  const PROMOTION_ROW = 7;
  const { x, y } = pos;

  const move1 = { x, y: y + 1 };
  const move2 = { x, y: y + 2 };

  const captureLeft = { x: x - 1, y: y + 1 };
  const captureRight = { x: x + 1, y: y + 1 };
  const promotionPieces = ["q", "r", "b", "n"] as PromotionPiece[];

  // Move forward 1
  if (inBounds(move1) && board[move1.y][move1.x].piece === empty) {
    if (y === PROMOTION_ROW - 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: move1, promotionPiece: piece }));
    else moves.push({ from: pos, to: move1 });
  }

  // Move forward 2
  if (y === START_ROW && board[move2.y][move2.x].piece === empty) {
    if (y === PROMOTION_ROW - 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: move2, promotionPiece: piece }));
    else moves.push({ from: pos, to: move2 });
  }

  // Capture left
  if (inBounds(captureLeft) && getTeam(board, captureLeft) !== "black" && board[captureLeft.y][captureLeft.x].piece !== empty) {
    if (y === PROMOTION_ROW - 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: captureLeft, promotionPiece: piece }));
    else moves.push({ from: pos, to: captureLeft, capture: true });
  }

  // Capture right
  if (inBounds(captureRight) && getTeam(board, captureRight) !== "black" && board[captureRight.y][captureRight.x].piece !== empty) {
    if (y === PROMOTION_ROW - 1) promotionPieces.forEach((piece) => moves.push({ from: pos, to: captureRight, promotionPiece: piece }));
    else moves.push({ from: pos, to: captureRight, capture: true });
  }

  // Promotion
  // if (y === PROMOTION_ROW - 1) {
  //   const promotionPieces = ["q", "r", "b", "n"] as PromotionPiece[];
  //   promotionPieces.forEach((piece) => {
  //     moves.push({ from: pos, to: { x, y: y + 1 }, promotionPiece: piece });
  //   });
  // }

  // En passant
  if (canEnpassant(board, { x: x - 1, y }, "black", prevBoard)) moves.push({ from: pos, to: captureLeft, enPassant: { x: x - 1, y } });
  if (canEnpassant(board, { x: x + 1, y }, "black", prevBoard)) moves.push({ from: pos, to: captureRight, enPassant: { x: x + 1, y } });
}

function rook(board: Board, moves: Move[], pos: Position) {
  const empty = " ";
  const { x, y } = pos;

  // Up
  for (let i = y - 1; i >= 0; i--) {
    const move = { x, y: i };
    if (board[i][x].piece === empty) {
      moves.push({ from: pos, to: move });
    } else {
      if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
      break;
    }
  }

  // Down
  for (let i = y + 1; i < 8; i++) {
    const move = { x, y: i };
    if (board[i][x].piece === empty) {
      moves.push({ from: pos, to: move });
    } else {
      if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
      break;
    }
  }

  // Left
  for (let i = x - 1; i >= 0; i--) {
    const move = { x: i, y };
    if (board[y][i].piece === empty) {
      moves.push({ from: pos, to: move });
    } else {
      if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
      break;
    }
  }

  // Right
  for (let i = x + 1; i < 8; i++) {
    const move = { x: i, y };
    if (board[y][i].piece === empty) {
      moves.push({ from: pos, to: move });
    } else {
      if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
      break;
    }
  }
}

function knight(board: Board, moves: Move[], pos: Position) {
  const empty = " ";
  const { x, y } = pos;

  const movesArr = [
    { x: x - 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
    { x: x + 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
  ];

  movesArr.forEach((move) => {
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) moves.push({ from: pos, to: move });
      else if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
    }
  });
}

function bishop(board: Board, moves: Move[], pos: Position) {
  const empty = " ";
  const { x, y } = pos;

  // Up left
  for (let i = 1; i < 8; i++) {
    const move = { x: x - i, y: y - i };
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) {
        moves.push({ from: pos, to: move });
      } else {
        if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
        break;
      }
    } else break;
  }

  // Up right
  for (let i = 1; i < 8; i++) {
    const move = { x: x + i, y: y - i };
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) {
        moves.push({ from: pos, to: move });
      } else {
        if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
        break;
      }
    } else break;
  }

  // Down left
  for (let i = 1; i < 8; i++) {
    const move = { x: x - i, y: y + i };
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) {
        moves.push({ from: pos, to: move });
      } else {
        if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
        break;
      }
    } else break;
  }

  // Down right
  for (let i = 1; i < 8; i++) {
    const move = { x: x + i, y: y + i };
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) {
        moves.push({ from: pos, to: move });
      } else {
        if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
        break;
      }
    } else break;
  }
}

function queen(board: Board, moves: Move[], pos: Position) {
  rook(board, moves, pos);
  bishop(board, moves, pos);
}

function king(board: Board, moves: Move[], pos: Position, _: Board, isPsuedo: boolean) {
  const empty = " ";
  const { x, y } = pos;

  const movesArr = [
    { x: x - 1, y: y - 1 },
    { x: x - 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y },
    { x: x + 1, y: y + 1 },
  ];

  movesArr.forEach((move) => {
    if (inBounds(move)) {
      if (board[move.y][move.x].piece === empty) moves.push({ from: pos, to: move });
      else if (getTeam(board, move) !== getTeam(board, pos)) moves.push({ from: pos, to: move, capture: true });
    }
  });

  // Castling

  // Psuedo moves are used to check when a square is attacked, without this it will be an infinite recursion
  if (isPsuedo) return;
  const team = getTeam(board, pos);

  const castlePositions = {
    white: {
      king: { x: 4, y: 7 },
      rook1: { x: 0, y: 7 },
      rook2: { x: 7, y: 7 },
    },
    black: {
      king: { x: 4, y: 0 },
      rook1: { x: 0, y: 0 },
      rook2: { x: 7, y: 0 },
    },
  };

  if (team === "white") {
    const king = board[castlePositions.white.king.y][castlePositions.white.king.x];
    const rook1 = board[castlePositions.white.rook1.y][castlePositions.white.rook1.x];
    const rook2 = board[castlePositions.white.rook2.y][castlePositions.white.rook2.x];

    if (king.hasMoved) return;

    // Castle long (Queen side)
    if (
      rook1.piece === "R" &&
      !rook1.hasMoved &&
      !isSquareAttacked(board, castlePositions.white.king, "white") &&
      !isSquareAttacked(board, { x: 2, y: 7 }, "white") &&
      !isSquareAttacked(board, { x: 3, y: 7 }, "white") &&
      board[7][1].piece === " " &&
      board[7][2].piece === " " &&
      board[7][3].piece === " "
    )
      moves.push({ from: pos, to: { x: 2, y: 7 }, castle: { rookFrom: { x: 0, y: 7 }, rookTo: { x: 3, y: 7 } } });

    // Castle short (King side)
    if (
      rook2.piece === "R" &&
      !rook2.hasMoved &&
      !isSquareAttacked(board, castlePositions.white.king, "white") &&
      !isSquareAttacked(board, { x: 6, y: 7 }, "white") &&
      board[7][5].piece === " " &&
      board[7][6].piece === " "
    )
      moves.push({ from: pos, to: { x: 6, y: 7 }, castle: { rookFrom: { x: 7, y: 7 }, rookTo: { x: 5, y: 7 } } });
  }

  if (team === "black") {
    const king = board[castlePositions.black.king.y][castlePositions.black.king.x];
    const rook1 = board[castlePositions.black.rook1.y][castlePositions.black.rook1.x];
    const rook2 = board[castlePositions.black.rook2.y][castlePositions.black.rook2.x];

    if (king.hasMoved) return;

    // Castle long (Queen side)
    if (
      rook1.piece === "r" &&
      !rook1.hasMoved &&
      !isSquareAttacked(board, castlePositions.black.king, "black") &&
      !isSquareAttacked(board, { x: 2, y: 0 }, "black") &&
      !isSquareAttacked(board, { x: 3, y: 0 }, "black") &&
      board[0][1].piece === " " &&
      board[0][2].piece === " " &&
      board[0][3].piece === " "
    )
      moves.push({ from: pos, to: { x: 2, y: 0 }, castle: { rookFrom: { x: 0, y: 0 }, rookTo: { x: 3, y: 0 } } });

    // Castle short (King side)
    if (
      rook2.piece === "r" &&
      !rook2.hasMoved &&
      !isSquareAttacked(board, castlePositions.black.king, "black") &&
      !isSquareAttacked(board, { x: 6, y: 0 }, "black") &&
      board[0][5].piece === " " &&
      board[0][6].piece === " "
    )
      moves.push({ from: pos, to: { x: 6, y: 0 }, castle: { rookFrom: { x: 7, y: 0 }, rookTo: { x: 5, y: 0 } } });
  }
}
