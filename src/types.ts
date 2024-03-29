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
  isPromotion?: boolean;
  promotionPiece?: PromotionPiece;
  enPassant?: Position;
  team?: Team;
};

export type MoveEvaluation = "blunder" | "mistake" | "inaccuracy" | "good" | "great" | "brilliant" | "top" | "book" | "";

export type Team = "white" | "black";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
1;
