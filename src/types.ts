export type TPiece = "p" | "r" | "n" | "b" | "q" | "k" | "P" | "R" | "N" | "B" | "Q" | "K" | " ";

export interface IPiece {
  piece: TPiece;
  id: number;
  hasMoved: boolean;
}

export type Board = IPiece[][];

export type Position = {
  x: number;
  y: number;
};

export type PromotionPiece = "q" | "r" | "b" | "n" | "Q" | "R" | "B" | "N";

export type Move = {
  from: Position;
  to: Position;
  capture?: boolean;
  castle?: { rookFrom: Position; rookTo: Position };
  promotionPiece?: PromotionPiece;
  enPassant?: Position;
  team?: Team;
};

export type MoveEvaluation = "blunder" | "mistake" | "inaccuracy" | "good" | "great" | "brilliant" | "top" | "book" | "";

export type Team = "white" | "black";
